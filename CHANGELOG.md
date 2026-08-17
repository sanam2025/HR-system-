# Changelog

Scope of this pass: connecting the frontend to the backend for the
**employee role only**. Manager/HR/admin wiring is explicitly out of scope
and untouched.

Two evidence tiers are used below:

- **CONFIRMED (live)** — verified by running `scripts/probe_api.py` against
  the real deployment at `http://masarhr.alwaysdata.net/api/`.
- **Collection-only** — inferred from the Masar-HR Postman collection's
  request shapes; not yet exercised against the live backend (the seeded
  test account in the collection, `omar14@gmail.com` / `33333333`, does not
  authenticate on this deployment — see "Blocked" below).

---

## Backend bugs — CONFIRMED (live)

1. **Login rejects the seeded Postman credentials.**
   `POST /login` with `omar14@gmail.com` / `33333333` (exactly as saved in
   the Postman collection) returns:
   ```json
   { "message": "Envalid email Or Password. ", "status_code": 400 }
   ```
   Tested both the collection's original query-string form and a corrected
   JSON-body form — identical result either way, so this isn't a
   request-format problem, it's that this account doesn't authenticate on
   this deployment. **Blocks all further verification of authenticated
   endpoints** — see "Blocked" below.

2. **Wrong HTTP status code for a bad login.** Invalid credentials return
   `400 Bad Request`. Convention (and what any reasonable frontend will
   check for) is `401 Unauthorized` for bad credentials, or `422` if it's
   framed as a validation failure. A client that specifically handles 401
   to show "check your email/password" will not catch this.

3. **Typo in the login error message.** `"Envalid email Or Password."`
   should read "Invalid". User-facing string, currently shipping with the
   typo.

4. **Inconsistent error envelope.** Every other error response observed
   (401s, 404s) has the shape `{ "success": false, "message": "..." }`.
   The login error breaks that pattern: no `success` key, and an
   extra `status_code` field that just duplicates the HTTP status already
   on the response. Frontend error handling has to special-case login
   rather than relying on one consistent envelope.

5. **`GET /user` (the collection's "putPassword" request) doesn't exist.**
   Returns `404 { "success": false, "message": "Route Not Found" }`. This
   route was never anything but a GET-by-email lookup in the collection
   anyway (see "Collection-only" #1 below) — now confirmed it isn't even
   live.

6. **`GET /my-contract/download` doesn't exist.**
   `404 Route Not Found`.

7. **`GET /my-documents` doesn't exist.**
   `404 Route Not Found`. The frontend has no way to list an employee's own
   uploaded documents at all right now.

8. **Corrected assumption: `GET /onboarding/status` *does* exist.**
   An earlier pass here flagged this as missing because the Postman
   collection's "onboarding status e" request has no saved URL. The live
   probe shows `401 Unauthenticated` (not 404), meaning the route is real
   and just requires auth. Fixed the incorrect "missing endpoint" comments
   in `src/api/endpoints.ts` and `src/api/onboarding.ts` accordingly. This
   is exactly the kind of thing the collection's total absence of saved
   response examples hides.

9. **Confirmed live and auth-gated (route exists, needs a valid token to go
   further):** `GET /profiles`, `GET /profiles/{id}`, `GET /my/contract`,
   `GET /my-monthly-attendance`, `GET /leaveRequests`,
   `GET /leaveRequests/{id}`, `GET /my-leave-request`,
   `GET /hourly-leave-Requests`, `GET /hourly-leave-Requests/{id}`,
   `GET /my-hourly-leave-request`. All return
   `401 { "success": false, "message": "Unauthenticated." }` with no valid
   token, which is the expected/correct behavior.

---

## Backend bugs — collection-only (not yet verified live)

1. **Credentials sent via query string.** The Postman collection's login
   request sends `email`/`password` as URL query parameters rather than a
   JSON body. Query strings end up in server access logs and browser
   history. This frontend always sends a JSON body instead
   (`src/api/auth.ts`).

2. **Inconsistent route casing for the same resource.**
   - `hourly-leave-Requests` (capital R) for create/list/show/update/delete
     vs. `hourly-leave-requests` (lowercase r) for approve/reject.
   - `leaveRequests` (camelCase) for create/list/show/update/delete vs.
     `leave-requests` (kebab-case) for approve/reject.
   Both casings are transcribed verbatim in `src/api/endpoints.ts` with
   inline notes, since "fixing" the casing silently would just break the
   route.

3. **Settings and skill values sent via query string on POST/PUT** instead
   of a request body (`settings?expected_check_in=`, `skills?name=`). Not
   in this pass's employee scope, noted for whoever picks up
   manager/HR/admin wiring.

4. **Candidate status update sends an empty `?status=` query param** with
   no request body on a PATCH. Not in employee scope, noted for later.

5. **CV download URL has a stray literal `"` baked into the raw URL** in
   the Postman collection. Not in employee scope, noted for later.

6. **"Reject after interview" targets an unresolved `{interview}` literal**
   path placeholder and uses GET for a mutating action. Not in employee
   scope, noted for later.

7. **No self-service leave balance endpoint.** Only
   `employee-leave/{id}/balance` exists, and every saved auth token against
   it in the collection belongs to a manager/HR account (same secrets used
   on `manager-employees`, `department-leave-request`, etc.), not an
   employee looking up their own balance.

8. **Laravel doesn't parse multipart bodies on a real PUT/PATGH request**
   (PHP itself only parses `multipart/form-data` on POST). The Postman
   collection's "Update Profile e" request sidesteps this by only ever
   sending JSON on PUT — it has no test for updating the profile picture at
   all. This frontend's `updateProfile()` (`src/api/profiles.ts`) uses
   Laravel's `_method=PUT` verb-spoofing-over-POST trick whenever a picture
   is included, and a plain PUT otherwise.

---

## Blocked

**Need valid employee credentials for `http://masarhr.alwaysdata.net/api/`**
to go any further. Every authenticated employee endpoint currently only
tells us "route exists, requires auth" — none of the actual response
shapes (profile fields, leave request fields, attendance record fields,
etc.) are known yet, so `src/api/models.ts` is still built on inference
from the request payloads, not verified responses.

Once real credentials are available, re-run:
```bash
python scripts/probe_api.py --base-url http://masarhr.alwaysdata.net/api/ \
    --email <real-email> --password <real-password>
```
and, once a token comes back, ideally also:
```bash
python scripts/probe_api.py --token "<token from above>" --mutate
```
to see real check-in/check-out/leave-request-creation response shapes.

---

## Frontend changes made this pass

- Rebuilt the API layer from scratch, scoped to the employee role:
  `src/lib/http/client.ts` (axios instance: auth header injection, GET
  retry-with-backoff, 401 → session-expiry event, response
  unwrapping), `src/lib/http/ApiError.ts` (normalized error type), and
  employee-scoped modules/hooks for auth, profiles, onboarding, documents,
  attendance, leave requests, and hourly leave requests.
- `src/api/endpoints.ts` is the single source of truth for every path this
  frontend calls, with the casing/format quirks above documented inline.
- Added a real `Login` page (`src/shared/pages/Login.tsx`), a route guard
  (`RequireAuth.tsx`), and a global session-expiry listener
  (`SessionExpiryListener.tsx`) — none of this existed before; there was no
  auth flow in the UI at all.
- Added a sign-out control to the sidebar (`SideBar.tsx` / `AppLayout.tsx`)
  — there wasn't one before.
- `main.tsx` now wraps the app in `QueryClientProvider` — `@tanstack/react-query`
  was an installed dependency but was never actually wired up anywhere.
- Removed the empty placeholder files `src/api/axios.ts`, `src/api/auth.ts`,
  `src/api/admin.ts`, `src/api/hr.ts`, `src/api/manager.ts`,
  `src/api/emplyees.ts` that existed with no content before this pass.
- Added `scripts/probe_api.py`: a standalone script that hits the real
  backend directly (no mocks) using the exact request shapes from the
  Postman collection, scoped to employee endpoints, and dumps every raw
  response for calibrating the types above against reality instead of
  guessing.

## Known gaps not yet wired to real data (pending a decision, see chat)

The employee UI references data with **no backing endpoint anywhere** in
the Postman collection: payslips and assigned tasks (`EmployeeTasksFinance`
page), and "Recent Tasks"/"Announcements" (`EmployeeDashboard`). Per the
project's "no mock data" rule, these have not been wired to fabricated
data — they're still on the pre-existing mock data pending a decision on
whether to show an explicit "not available" state or hide the
sections/nav entirely.

# API probe script

`probe_api.py` hits the real Masar-HR backend directly — no mocks — using
the exact request shapes from the Postman collection, scoped to the
employee-role endpoints. It exists because the Postman collection saves
zero response examples, so nobody actually knows what shape the backend
returns until something like this runs against it.

## Run it

```bash
pip install -r scripts/requirements.txt
python scripts/probe_api.py
```

By default it targets `http://masarhr.alwaysdata.net/api/` with the seeded
`omar14@gmail.com` / `33333333` account from the Postman collection, and
only runs **read-only** requests.

```bash
# Different backend / account
python scripts/probe_api.py --base-url http://127.0.0.1:8000/api/ \
    --email you@example.com --password yourpassword

# Already have a token? Skip login entirely.
python scripts/probe_api.py --token "eyJ..."

# Also run requests that change data: check-in/out, create a leave
# request, create an hourly leave request, create a profile.
python scripts/probe_api.py --mutate

# Also run destructive/session-ending requests: onboarding document
# upload, logout. (change-password is intentionally never run automatically
# — it would lock you out of whatever account you point this at.)
python scripts/probe_api.py --mutate --dangerous
```

## Output

- Prints a pass/fail table (status code + timing) for every request.
- Writes the full request/response detail to `api_probe_report.json` next
  to wherever you ran the script from.

**`api_probe_report.json` contains your bearer token and whatever personal
data the API returns — it's git-ignored already; don't paste it anywhere
public, but do feel free to share it back for calibrating the frontend's
API types against the real responses.**

## What it checks

Every employee-scoped endpoint this frontend calls: login (both the
query-string form the Postman collection uses today, and the corrected
JSON-body form, so you can see whether the backend accepts one, the other,
or both), profile, onboarding, contract/documents, attendance, and both
leave-request flavors — including the ones the Postman collection
references by name but never gives a URL for (`onboarding/status`,
`my-documents`), so you get a definitive 404 (or a surprise) instead of a
guess.

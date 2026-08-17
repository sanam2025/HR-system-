#!/usr/bin/env python3
"""
Masar-HR API probe.

Hits the real backend directly (no mocks) using the exact request shapes
from the Masar-HR Postman collection, scoped to the employee-role
endpoints, and dumps every raw response to a JSON report. The Postman
collection saves zero response examples, so this is how we find out what
the backend *actually* returns instead of guessing.

Usage
-----
    pip install requests
    python scripts/probe_api.py

    # Point at a different backend / account
    python scripts/probe_api.py --base-url http://127.0.0.1:8000/api/ \\
        --email someone@example.com --password secret

    # Also run requests that change data (check-in/out, create leave
    # requests, etc.) — off by default so a first run never mutates
    # anything on a shared/staging backend.
    python scripts/probe_api.py --mutate

    # Also run genuinely dangerous requests (change-password, logout,
    # onboarding upload) — off by default, and asks for confirmation.
    python scripts/probe_api.py --mutate --dangerous

    # Skip login and use a token you already have.
    python scripts/probe_api.py --token "eyJ..."

Output
------
Writes `api_probe_report.json` (full request/response detail — treat it as
sensitive, it may contain a bearer token and personal data) and prints a
compact pass/fail table to stdout.
"""

from __future__ import annotations

import argparse
import base64
import json
import sys
import time
from dataclasses import asdict, dataclass, field
from typing import Any

try:
    import requests
except ImportError:  # pragma: no cover
    sys.exit("Missing dependency. Run: pip install requests")

DEFAULT_BASE_URL = "http://masarhr.alwaysdata.net/api/"
# Seeded test account transcribed from the Masar-HR Postman collection.
DEFAULT_EMAIL = "omar14@gmail.com"
DEFAULT_PASSWORD = "33333333"

# A valid, minimal 1x1 transparent PNG — used as dummy "file" payload for
# multipart endpoints (profile picture, onboarding documents) so we can see
# how the backend responds to a well-formed image upload without needing a
# real photo/ID/bank document on disk.
TINY_PNG_B64 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk"
    "+A8AAQUBAScY42YAAAAASUVORK5CYII="
)


def tiny_png_bytes() -> bytes:
    return base64.b64decode(TINY_PNG_B64)


@dataclass
class ProbeResult:
    name: str
    method: str
    url: str
    category: str  # "read" | "mutate" | "dangerous" | "skipped"
    status_code: int | None = None
    ok: bool = False
    duration_ms: float | None = None
    response_headers: dict[str, str] = field(default_factory=dict)
    response_body: Any = None
    error: str | None = None
    note: str | None = None


class ApiProbe:
    def __init__(self, base_url: str, timeout: float = 15.0):
        self.base_url = base_url.rstrip("/") + "/"
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({"Accept": "application/json"})
        self.results: list[ProbeResult] = []

    def set_token(self, token: str | None) -> None:
        if token:
            self.session.headers["Authorization"] = f"Bearer {token}"
        else:
            self.session.headers.pop("Authorization", None)

    def request(
        self,
        name: str,
        method: str,
        path: str,
        category: str = "read",
        **kwargs: Any,
    ) -> ProbeResult:
        url = self.base_url + path.lstrip("/")
        start = time.monotonic()
        result = ProbeResult(name=name, method=method.upper(), url=url, category=category)
        try:
            response = self.session.request(
                method, url, timeout=self.timeout, **kwargs
            )
            result.duration_ms = round((time.monotonic() - start) * 1000, 1)
            result.status_code = response.status_code
            result.ok = response.ok
            result.response_headers = {
                k: v
                for k, v in response.headers.items()
                if k.lower() in ("content-type", "content-length", "x-request-id")
            }
            content_type = response.headers.get("content-type", "")
            if "application/json" in content_type:
                try:
                    result.response_body = response.json()
                except ValueError:
                    result.response_body = response.text[:2000]
            elif response.request.method == "GET" and "download" in path:
                # Binary download endpoints: don't dump bytes into the report.
                result.response_body = f"<{len(response.content)} bytes, {content_type or 'unknown content-type'}>"
            else:
                result.response_body = response.text[:2000]
        except requests.RequestException as exc:
            result.duration_ms = round((time.monotonic() - start) * 1000, 1)
            result.error = str(exc)
        self.results.append(result)
        return result

    def skip(self, name: str, method: str, path: str, category: str, reason: str) -> ProbeResult:
        result = ProbeResult(
            name=name,
            method=method.upper(),
            url=self.base_url + path.lstrip("/"),
            category=category,
            note=f"SKIPPED: {reason}",
        )
        self.results.append(result)
        return result


def extract_token(body: Any) -> str | None:
    """Best-effort token extraction across the shapes a Laravel app commonly
    returns (`token`, `access_token`, or nested under `data`)."""
    if not isinstance(body, dict):
        return None
    for key in ("token", "access_token"):
        if isinstance(body.get(key), str):
            return body[key]
    nested = body.get("data")
    if isinstance(nested, dict):
        for key in ("token", "access_token"):
            if isinstance(nested.get(key), str):
                return nested[key]
    return None


def run(args: argparse.Namespace) -> list[ProbeResult]:
    probe = ApiProbe(args.base_url, timeout=args.timeout)
    token = args.token

    if token:
        print(f"Using supplied token (skipping login). {token[:8]}…")
        probe.set_token(token)
    else:
        # 1. Exactly as the Postman collection sends it: credentials as a
        #    query string on the POST body.
        r1 = probe.request(
            "login_query_string_as_in_collection",
            "POST",
            "login",
            params={"email": args.email, "password": args.password},
        )
        token = extract_token(r1.response_body)

        # 2. The corrected way: credentials as a JSON body. Run regardless
        #    so we can see whether the backend supports (or requires) this
        #    instead of / in addition to the query-string variant.
        r2 = probe.request(
            "login_json_body_corrected",
            "POST",
            "login",
            json={"email": args.email, "password": args.password},
        )
        token = token or extract_token(r2.response_body)

        if token:
            print(f"Obtained bearer token ({token[:8]}…) — proceeding as {args.email}")
            probe.set_token(token)
        else:
            print(
                "WARNING: could not find a token in either login response. "
                "Authenticated calls below will run unauthenticated and are "
                "expected to fail with 401 — inspect api_probe_report.json "
                "for the real login response shape.",
                file=sys.stderr,
            )

    # ── Read-only probes (always run) ──────────────────────────────────────
    probe.request("auth_user_by_email_putPassword", "GET", "user", params={"email": args.email})
    probe.request("profiles_mine", "GET", "profiles")
    probe.request("profiles_show_1", "GET", "profiles/1")
    probe.request("onboarding_status", "GET", "onboarding/status")
    probe.request("my_contract", "GET", "my/contract")
    probe.request("my_contract_download", "GET", "my-contract/download")
    probe.request("my_documents", "GET", "my-documents")
    probe.request("my_monthly_attendance", "GET", "my-monthly-attendance")
    probe.request("leave_requests_list", "GET", "leaveRequests")
    probe.request("leave_requests_show_2", "GET", "leaveRequests/2")
    probe.request(
        "my_leave_request_approved", "GET", "my-leave-request", params={"status": "approved"}
    )
    probe.request("hourly_leave_requests_list", "GET", "hourly-leave-Requests")
    probe.request("hourly_leave_requests_show_3", "GET", "hourly-leave-Requests/3")
    probe.request(
        "my_hourly_leave_request_pending",
        "GET",
        "my-hourly-leave-request",
        params={"status": "pending"},
    )

    # ── Mutating probes (change real data) — opt in with --mutate ──────────
    if args.mutate:
        probe.request("attendance_check_in", "PUT", "check-in", category="mutate")
        probe.request("attendance_check_out", "PUT", "check-out", category="mutate")
        probe.request(
            "profiles_create",
            "POST",
            "profiles",
            category="mutate",
            data={
                "gender": "male",
                "birth_date": "1995-03-15",
                "phone_number": "0968459869",
                "address": "Probe script test address",
            },
            files={"picture": ("probe.png", tiny_png_bytes(), "image/png")},
        )
        probe.request(
            "leave_requests_create",
            "POST",
            "leaveRequests",
            category="mutate",
            data={"start_date": "2026-09-01", "type": "annual", "days_count": "1"},
        )
        probe.request(
            "hourly_leave_requests_create",
            "POST",
            "hourly-leave-Requests",
            category="mutate",
            data={
                "date": "2026-09-01",
                "start_time": "10:00",
                "end_time": "12:00",
                "reason": "Probe script test",
            },
        )
    else:
        for name, method, path in [
            ("attendance_check_in", "PUT", "check-in"),
            ("attendance_check_out", "PUT", "check-out"),
            ("profiles_create", "POST", "profiles"),
            ("leave_requests_create", "POST", "leaveRequests"),
            ("hourly_leave_requests_create", "POST", "hourly-leave-Requests"),
        ]:
            probe.skip(name, method, path, "mutate", "pass --mutate to run this")

    # ── Dangerous probes (destructive / end the session) — opt in ──────────
    if args.dangerous:
        probe.request(
            "onboarding_upload",
            "POST",
            "onboarding/upload",
            category="dangerous",
            files={
                "id_card": ("id_card.png", tiny_png_bytes(), "image/png"),
                "photo": ("photo.png", tiny_png_bytes(), "image/png"),
                "bank_info": ("bank_info.png", tiny_png_bytes(), "image/png"),
            },
        )
        probe.request("auth_logout", "POST", "logout", category="dangerous")
        # change-password intentionally excluded even under --dangerous: it
        # would lock you out of the seeded test account. Uncomment only if
        # you're using a disposable account and know the new password.
        # probe.request("auth_change_password", "POST", "change-password",
        #     category="dangerous",
        #     json={"password": "NewPass123!", "password_confirmation": "NewPass123!"})
    else:
        for name, method, path in [
            ("onboarding_upload", "POST", "onboarding/upload"),
            ("auth_logout", "POST", "logout"),
        ]:
            probe.skip(name, method, path, "dangerous", "pass --dangerous to run this")

    return probe.results


def print_summary(results: list[ProbeResult]) -> None:
    print("\n" + "=" * 88)
    print(f"{'NAME':<38} {'METHOD':<6} {'STATUS':<7} {'MS':<7} NOTE")
    print("-" * 88)
    for r in results:
        status = str(r.status_code) if r.status_code is not None else ("ERR" if r.error else "-")
        ms = f"{r.duration_ms:.0f}" if r.duration_ms is not None else "-"
        note = r.note or r.error or ""
        print(f"{r.name:<38} {r.method:<6} {status:<7} {ms:<7} {note}")
    print("=" * 88)
    failed = [r for r in results if r.error]
    if failed:
        print(f"\n{len(failed)} request(s) could not complete (network/timeout) — see report.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL, help=f"default: {DEFAULT_BASE_URL}")
    parser.add_argument("--email", default=DEFAULT_EMAIL)
    parser.add_argument("--password", default=DEFAULT_PASSWORD)
    parser.add_argument("--token", default=None, help="skip login and use this bearer token")
    parser.add_argument("--timeout", type=float, default=15.0)
    parser.add_argument(
        "--mutate", action="store_true",
        help="also run requests that change data (check-in/out, create leave requests, create profile)",
    )
    parser.add_argument(
        "--dangerous", action="store_true",
        help="also run destructive/session-ending requests (onboarding upload, logout)",
    )
    parser.add_argument("--output", default="api_probe_report.json")
    args = parser.parse_args()

    if args.dangerous and not args.mutate:
        print("Note: --dangerous implies real writes; consider --mutate too for full coverage.")

    print(f"Probing {args.base_url} as {args.email if not args.token else '(supplied token)'}\n")
    results = run(args)
    print_summary(results)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump([asdict(r) for r in results], f, indent=2, ensure_ascii=False, default=str)
    print(f"\nFull report written to {args.output} (contains your bearer token — don't commit it).")


if __name__ == "__main__":
    main()

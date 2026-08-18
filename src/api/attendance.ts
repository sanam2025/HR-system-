import { httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import { ApiError } from "../lib/http/ApiError";
import type { RequestOptions } from "../lib/http/client";
import type { AttendanceRecord, CheckInOutPayload } from "./models";

/**
 * CONFIRMED via live backend testing: check-in/check-out genuinely require
 * `latitude`/`longitude` — submitting without them fails validation
 * ("Your current location is required."), it isn't just an optional extra
 * field. An earlier version of this function swallowed a geolocation
 * failure and sent an empty body anyway, which just traded a clear
 * "allow location access" message for a confusing backend validation
 * error. Reject with an actionable `ApiError` instead so the check-in/
 * check-out button's error state tells the user what to actually do.
 */
function getCurrentPosition(): Promise<CheckInOutPayload> {
  return new Promise((resolve, reject) => {
    function locationError(message: string) {
      reject(new ApiError({ message, status: null, kind: "unknown" }));
    }
    if (!("geolocation" in navigator)) {
      locationError("Check-in requires location access, which this browser doesn't support.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        }),
      () =>
        locationError(
          "Location access is required to check in/out. Please allow location access for this site and try again."
        ),
      { timeout: 5000 }
    );
  });
}

export async function checkIn(options?: RequestOptions): Promise<AttendanceRecord> {
  const payload = await getCurrentPosition();
  const response = await httpClient.put(endpoints.attendance.checkIn, payload, options);
  return unwrap<AttendanceRecord>(response);
}

export async function checkOut(options?: RequestOptions): Promise<AttendanceRecord> {
  const payload = await getCurrentPosition();
  const response = await httpClient.put(endpoints.attendance.checkOut, payload, options);
  return unwrap<AttendanceRecord>(response);
}

export async function getMyMonthlyAttendance(
  options?: RequestOptions
): Promise<AttendanceRecord[]> {
  const response = await httpClient.get(endpoints.attendance.myMonthly, options);
  return unwrap<AttendanceRecord[]>(response);
}

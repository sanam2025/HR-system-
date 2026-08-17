import { httpClient, unwrap } from "../lib/http/client";
import { endpoints } from "./endpoints";
import type { RequestOptions } from "../lib/http/client";
import type { Coordinates } from "../lib/geolocation";
import type { AttendanceFilterParams, AttendancePercentage, AttendanceRecord } from "./models";

export async function checkIn(
  coords: Coordinates,
  options?: RequestOptions
): Promise<AttendanceRecord> {
  const response = await httpClient.put(
    endpoints.attendance.checkIn,
    { latitude: coords.latitude, longitude: coords.longitude },
    options
  );
  return unwrap<AttendanceRecord>(response);
}

export async function checkOut(
  coords: Coordinates,
  options?: RequestOptions
): Promise<AttendanceRecord> {
  const response = await httpClient.put(
    endpoints.attendance.checkOut,
    { latitude: coords.latitude, longitude: coords.longitude },
    options
  );
  return unwrap<AttendanceRecord>(response);
}

export async function getMyMonthlyAttendance(
  options?: RequestOptions
): Promise<AttendanceRecord[]> {
  const response = await httpClient.get(endpoints.attendance.myMonthly, options);
  return unwrap<AttendanceRecord[]>(response);
}

/** Attendance records within an arbitrary date range (`from`/`to`, inclusive per the collection's example). */
export async function getFilteredAttendance(
  params: AttendanceFilterParams,
  options?: RequestOptions
): Promise<AttendanceRecord[]> {
  const response = await httpClient.get(endpoints.attendance.filtered, {
    ...options,
    params: { ...params, ...options?.params },
  });
  return unwrap<AttendanceRecord[]>(response);
}

export async function getAttendancePercentage(
  options?: RequestOptions
): Promise<AttendancePercentage> {
  const response = await httpClient.get(endpoints.attendance.percentage, options);
  return unwrap<AttendancePercentage>(response);
}

/**
 * CONFIRMED via live backend testing: `AttendanceRecord.date` comes back as
 * a full timestamp (`"2026-08-17T21:00:00.000000Z"`, apparently a
 * timezone-shifted midnight rather than a plain `YYYY-MM-DD`), not the bare
 * date string the field name implies. Comparing it to `new Date().toISOString().slice(0,10)`
 * with `===` silently never matches. Parse both sides as dates and compare
 * calendar fields instead of relying on either string's exact format.
 */
export function isSameCalendarDay(dateStr: string, reference: Date = new Date()): boolean {
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return false;
  return (
    parsed.getFullYear() === reference.getFullYear() &&
    parsed.getMonth() === reference.getMonth() &&
    parsed.getDate() === reference.getDate()
  );
}

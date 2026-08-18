const UPPERCASE_WORDS = new Set(["hr", "id"]);

/**
 * Turns a raw backend status/enum value (`"pending_hr_approval"`,
 * `"in_progress"`) into a readable label ("Pending HR Approval", "In
 * Progress"). Handles snake_case and kebab-case; known abbreviations
 * (HR, ID) stay uppercase instead of being title-cased into "Hr"/"Id".
 */
export function humanizeStatus(value: string): string {
  return value
    .split(/[_-]+/)
    .filter(Boolean)
    .map((word) =>
      UPPERCASE_WORDS.has(word.toLowerCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

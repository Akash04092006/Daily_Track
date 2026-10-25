const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates whether a string is a valid YYYY-MM-DD calendar date.
 */
export function isValidDateString(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) return false;
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Returns today's date formatted as YYYY-MM-DD in the user's timezone.
 */
export function getTodayString(timezone: string = "Asia/Kolkata"): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date());
  } catch {
    // Fallback to UTC if timezone is invalid
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date());
  }
}

/**
 * Formats a Date object to YYYY-MM-DD in the specified timezone.
 */
export function formatDateString(date: Date, timezone: string = "UTC"): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  } catch {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date);
  }
}

/**
 * Parses YYYY-MM-DD into a Date object at UTC midnight.
 */
export function parseDateString(dateStr: string): Date {
  if (!isValidDateString(dateStr)) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }
  const [year, month, day] = dateStr.split("-").map((n) => parseInt(n, 10));
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Returns day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday) for a YYYY-MM-DD date.
 */
export function getDayOfWeek(dateStr: string): number {
  const date = parseDateString(dateStr);
  return date.getUTCDay();
}

/**
 * Adds or subtracts days from a YYYY-MM-DD date and returns a YYYY-MM-DD date.
 */
export function addDays(dateStr: string, days: number): string {
  const date = parseDateString(dateStr);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0];
}

/**
 * Returns an inclusive list of YYYY-MM-DD strings between from and to.
 */
export function getDateRange(from: string, to: string, maxDays: number = 366): string[] {
  if (!isValidDateString(from) || !isValidDateString(to)) return [];
  if (from > to) return [];

  const dates: string[] = [];
  let current = from;
  let count = 0;

  while (current <= to && count < maxDays) {
    dates.push(current);
    current = addDays(current, 1);
    count++;
  }

  return dates;
}

/**
 * Determines whether a habit is scheduled/due on a given YYYY-MM-DD date.
 */
export function isHabitDueOnDate(
  habit: { frequencyType: string; frequencyDays?: string | null },
  dateStr: string
): boolean {
  if (habit.frequencyType === "daily") {
    return true;
  }

  const dayOfWeek = getDayOfWeek(dateStr);

  if (habit.frequencyType === "weekdays") {
    // 1 (Monday) to 5 (Friday)
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }

  if (habit.frequencyType === "custom" && habit.frequencyDays) {
    const targetDays = habit.frequencyDays
      .split(",")
      .map((d) => parseInt(d.trim(), 10))
      .filter((n) => !isNaN(n));
    return targetDays.includes(dayOfWeek);
  }

  return false;
}

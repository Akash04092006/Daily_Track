import { describe, it, expect } from "vitest";
import {
  isValidDateString,
  getTodayString,
  formatDateString,
  getDateRange,
  getDayOfWeek,
  isHabitDueOnDate,
  addDays,
} from "@/lib/dates";

describe("Date Utilities & Timezone Handling", () => {
  describe("isValidDateString", () => {
    it("should accept valid YYYY-MM-DD dates", () => {
      expect(isValidDateString("2026-10-25")).toBe(true);
      expect(isValidDateString("2026-01-01")).toBe(true);
      expect(isValidDateString("2026-12-31")).toBe(true);
    });

    it("should handle leap years correctly", () => {
      expect(isValidDateString("2024-02-29")).toBe(true); // 2024 is leap year
      expect(isValidDateString("2026-02-29")).toBe(false); // 2026 is NOT leap year
    });

    it("should reject invalid dates and wrong month lengths", () => {
      expect(isValidDateString("2026-04-31")).toBe(false); // April has 30 days
      expect(isValidDateString("2026-06-31")).toBe(false); // June has 30 days
      expect(isValidDateString("2026-13-01")).toBe(false); // Month 13
      expect(isValidDateString("2026-00-10")).toBe(false); // Month 0
      expect(isValidDateString("2026-05-32")).toBe(false); // Day 32
      expect(isValidDateString("25-10-2026")).toBe(false); // Wrong format
      expect(isValidDateString("not-a-date")).toBe(false);
      expect(isValidDateString("")).toBe(false);
    });
  });

  describe("Timezone Edge Cases around Midnight", () => {
    it("should format dates correctly across distinct international timezones", () => {
      // 2026-10-25 at 23:30:00 UTC
      const fixedTime = new Date("2026-10-25T23:30:00.000Z");

      // In UTC, it is Oct 25
      expect(formatDateString(fixedTime, "UTC")).toBe("2026-10-25");

      // In America/Los_Angeles (UTC-7/8), it is still Oct 25 (16:30)
      expect(formatDateString(fixedTime, "America/Los_Angeles")).toBe("2026-10-25");

      // In Asia/Kolkata (UTC+5:30), it has crossed midnight into Oct 26 (05:00)
      expect(formatDateString(fixedTime, "Asia/Kolkata")).toBe("2026-10-26");

      // In Pacific/Auckland (UTC+13), it has crossed midnight into Oct 26 (12:30)
      expect(formatDateString(fixedTime, "Pacific/Auckland")).toBe("2026-10-26");
    });

    it("should return a valid YYYY-MM-DD date string for getTodayString", () => {
      const today = getTodayString("Asia/Kolkata");
      expect(isValidDateString(today)).toBe(true);
    });
  });

  describe("getDateRange", () => {
    it("should generate continuous inclusive date range", () => {
      const range = getDateRange("2026-10-01", "2026-10-05");
      expect(range).toEqual([
        "2026-10-01",
        "2026-10-02",
        "2026-10-03",
        "2026-10-04",
        "2026-10-05",
      ]);
    });

    it("should handle single day range", () => {
      const range = getDateRange("2026-10-15", "2026-10-15");
      expect(range).toEqual(["2026-10-15"]);
    });

    it("should return empty array if from is after to", () => {
      const range = getDateRange("2026-10-20", "2026-10-10");
      expect(range).toEqual([]);
    });

    it("should return empty array on invalid inputs", () => {
      expect(getDateRange("invalid", "2026-10-10")).toEqual([]);
    });
  });

  describe("isHabitDueOnDate", () => {
    // 2026-10-25 is a Sunday (day 0)
    // 2026-10-26 is a Monday (day 1)
    // 2026-10-27 is a Tuesday (day 2)
    // 2026-10-28 is a Wednesday (day 3)
    // 2026-10-31 is a Saturday (day 6)

    it("should mark daily habits due on any day", () => {
      const dailyHabit = { frequencyType: "daily", frequencyDays: null };
      expect(isHabitDueOnDate(dailyHabit, "2026-10-25")).toBe(true); // Sunday
      expect(isHabitDueOnDate(dailyHabit, "2026-10-26")).toBe(true); // Monday
    });

    it("should mark weekdays habits due only on Monday through Friday", () => {
      const weekdayHabit = { frequencyType: "weekdays", frequencyDays: null };
      expect(isHabitDueOnDate(weekdayHabit, "2026-10-25")).toBe(false); // Sunday
      expect(isHabitDueOnDate(weekdayHabit, "2026-10-26")).toBe(true); // Monday
      expect(isHabitDueOnDate(weekdayHabit, "2026-10-27")).toBe(true); // Tuesday
      expect(isHabitDueOnDate(weekdayHabit, "2026-10-31")).toBe(false); // Saturday
    });

    it("should mark custom habits due only on specified days of week", () => {
      // 1 (Mon), 3 (Wed), 5 (Fri)
      const customHabit = { frequencyType: "custom", frequencyDays: "1,3,5" };
      expect(isHabitDueOnDate(customHabit, "2026-10-25")).toBe(false); // Sunday (0)
      expect(isHabitDueOnDate(customHabit, "2026-10-26")).toBe(true); // Monday (1)
      expect(isHabitDueOnDate(customHabit, "2026-10-27")).toBe(false); // Tuesday (2)
      expect(isHabitDueOnDate(customHabit, "2026-10-28")).toBe(true); // Wednesday (3)
    });
  });

  describe("getDayOfWeek", () => {
    it("should return the correct day of week index (0=Sunday to 6=Saturday)", () => {
      expect(getDayOfWeek("2026-10-25")).toBe(0); // Sunday
      expect(getDayOfWeek("2026-10-26")).toBe(1); // Monday
      expect(getDayOfWeek("2026-10-31")).toBe(6); // Saturday
    });
  });

  describe("addDays", () => {
    it("should add days to a YYYY-MM-DD date string", () => {
      expect(addDays("2026-10-25", 1)).toBe("2026-10-26");
      expect(addDays("2026-10-25", 7)).toBe("2026-11-01");
      expect(addDays("2026-10-25", -1)).toBe("2026-10-24");
    });
  });
});

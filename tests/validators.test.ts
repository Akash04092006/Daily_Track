import { describe, it, expect } from "vitest";
import { signupSchema, loginSchema } from "@/server/validators/auth.schema";
import {
  createHabitSchema,
  updateHabitSchema,
  reorderHabitsSchema,
} from "@/server/validators/habit.schema";
import {
  upsertHabitLogSchema,
  getHabitLogsQuerySchema,
} from "@/server/validators/habit-log.schema";
import { upsertDailyEntrySchema } from "@/server/validators/daily-entry.schema";
import { createGoalSchema, createMilestoneSchema } from "@/server/validators/goal.schema";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "@/server/validators/profile.schema";

describe("Zod Request Validators", () => {
  describe("Auth Schemas", () => {
    it("should accept valid signup payload", () => {
      const result = signupSchema.safeParse({
        email: "user@example.com",
        name: "Test User",
        password: "securePassword123!",
      });
      expect(result.success).toBe(true);
    });

    it("should reject signup with invalid email or short password", () => {
      expect(
        signupSchema.safeParse({
          email: "invalid-email",
          name: "Test",
          password: "short",
        }).success
      ).toBe(false);
    });

    it("should accept valid login payload", () => {
      expect(
        loginSchema.safeParse({
          email: "user@example.com",
          password: "password123",
        }).success
      ).toBe(true);
    });

    it("should reject login with missing password", () => {
      expect(
        loginSchema.safeParse({
          email: "user@example.com",
          password: "",
        }).success
      ).toBe(false);
    });
  });

  describe("Habit Schemas", () => {
    it("should accept valid habit creation payload", () => {
      const result = createHabitSchema.safeParse({
        title: "Morning Run",
        category: "fitness",
        frequencyType: "daily",
        targetPerDay: 1,
        reminderTime: "07:00",
      });
      expect(result.success).toBe(true);
    });

    it("should reject habit creation with invalid category", () => {
      const result = createHabitSchema.safeParse({
        title: "Invalid Habit",
        category: "non_existent_category",
      });
      expect(result.success).toBe(false);
    });

    it("should reject habit creation with malformed reminderTime", () => {
      const result = createHabitSchema.safeParse({
        title: "Invalid Reminder",
        category: "health",
        reminderTime: "25:70", // invalid hour and minute
      });
      expect(result.success).toBe(false);
    });

    it("should accept valid habit update payload", () => {
      const result = updateHabitSchema.safeParse({
        title: "Updated Run Title",
        targetPerDay: 2,
        isArchived: true,
      });
      expect(result.success).toBe(true);
    });

    it("should accept valid reorder array and reject empty list", () => {
      expect(reorderHabitsSchema.safeParse({ habitIds: ["h1", "h2"] }).success).toBe(
        true
      );
      expect(reorderHabitsSchema.safeParse({ habitIds: [] }).success).toBe(false);
    });
  });

  describe("HabitLog & DailyEntry Schemas", () => {
    it("should accept valid log upsert and reject negative value", () => {
      expect(upsertHabitLogSchema.safeParse({ value: 2, note: "Good job" }).success).toBe(
        true
      );
      expect(upsertHabitLogSchema.safeParse({ value: -1 }).success).toBe(false);
    });

    it("should validate date query range format", () => {
      expect(
        getHabitLogsQuerySchema.safeParse({ from: "2026-10-01", to: "2026-10-31" })
          .success
      ).toBe(true);
      expect(
        getHabitLogsQuerySchema.safeParse({ from: "01-10-2026", to: "2026-10-31" })
          .success
      ).toBe(false);
    });

    it("should validate daily entry mood, energy, focus within 1 to 5 range", () => {
      expect(
        upsertDailyEntrySchema.safeParse({ mood: 4, energy: 5, focus: 3 }).success
      ).toBe(true);
      expect(upsertDailyEntrySchema.safeParse({ mood: 6 }).success).toBe(false);
      expect(upsertDailyEntrySchema.safeParse({ energy: 0 }).success).toBe(false);
    });
  });

  describe("Goal & Profile Schemas", () => {
    it("should validate goal creation and milestone creation", () => {
      const goalResult = createGoalSchema.safeParse({
        title: "Learn Rust",
        category: "learning",
        startDate: "2026-01-01T00:00:00Z",
        targetValue: 10,
        unit: "chapters",
      });
      expect(goalResult.success).toBe(true);

      const milestoneResult = createMilestoneSchema.safeParse({
        title: "Read ownership chapter",
        isDone: false,
      });
      expect(milestoneResult.success).toBe(true);
    });

    it("should validate profile update and change password", () => {
      expect(
        updateProfileSchema.safeParse({
          name: "Updated Name",
          theme: "dark",
          weekStartsOn: 1,
        }).success
      ).toBe(true);

      // weekStartsOn only allows 0 or 1
      expect(updateProfileSchema.safeParse({ weekStartsOn: 2 }).success).toBe(false);

      expect(
        changePasswordSchema.safeParse({
          currentPassword: "oldPassword123",
          newPassword: "newStrongPassword456",
        }).success
      ).toBe(true);

      expect(
        changePasswordSchema.safeParse({
          currentPassword: "old",
          newPassword: "short",
        }).success
      ).toBe(false);
    });
  });
});

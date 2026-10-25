import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { HabitsService } from "@/server/services/habits.service";
import { HabitLogsService } from "@/server/services/habit-logs.service";

describe("Habits & HabitLogs Service Multi-Tenant Isolation", () => {
  let userAId: string;
  let userBId: string;

  beforeAll(async () => {
    // Clean up any test users if leftover from previous test runs
    await prisma.user.deleteMany({
      where: {
        email: { in: ["userA@service-test.com", "userB@service-test.com"] },
      },
    });

    const userA = await prisma.user.create({
      data: {
        email: "userA@service-test.com",
        name: "User Alpha",
        passwordHash: "hash_a",
        timezone: "Asia/Kolkata",
      },
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        email: "userB@service-test.com",
        name: "User Beta",
        passwordHash: "hash_b",
        timezone: "Asia/Kolkata",
      },
    });
    userBId = userB.id;
  });

  afterAll(async () => {
    // Cleanup users and all cascaded data
    await prisma.user.deleteMany({
      where: {
        id: { in: [userAId, userBId] },
      },
    });
  });

  it("should create a habit for User A", async () => {
    const habit = await HabitsService.createHabit(userAId, {
      title: "Morning 5k Run",
      category: "fitness",
      frequencyType: "daily",
      targetPerDay: 1,
      unit: "run",
    });

    expect(habit).toBeDefined();
    expect(habit.userId).toBe(userAId);
    expect(habit.title).toBe("Morning 5k Run");
  });

  it("PROVE ISOLATION: User B CANNOT read User A's habit", async () => {
    const habitA = await HabitsService.createHabit(userAId, {
      title: "Secret Journaling",
      category: "mindfulness",
      frequencyType: "daily",
      targetPerDay: 1,
    });

    // Attempt read by User B
    const readByB = await HabitsService.getHabit(userBId, habitA.id);
    expect(readByB).toBeNull();

    // User B's list should not include User A's habit
    const listB = await HabitsService.listHabits(userBId);
    const foundInList = listB.some((h) => h.id === habitA.id);
    expect(foundInList).toBe(false);
  });

  it("PROVE ISOLATION: User B CANNOT modify User A's habit", async () => {
    const habitA = await HabitsService.createHabit(userAId, {
      title: "Unmodifiable Habit",
      category: "learning",
      frequencyType: "daily",
      targetPerDay: 1,
    });

    // Attempt update by User B
    const updateResult = await HabitsService.updateHabit(userBId, habitA.id, {
      title: "Hacked by User B!",
    });
    expect(updateResult).toBeNull();

    // Verify title was NOT changed
    const freshHabitA = await HabitsService.getHabit(userAId, habitA.id);
    expect(freshHabitA?.title).toBe("Unmodifiable Habit");
  });

  it("PROVE ISOLATION: User B CANNOT delete User A's habit", async () => {
    const habitA = await HabitsService.createHabit(userAId, {
      title: "Persistent Habit",
      category: "health",
      frequencyType: "daily",
      targetPerDay: 1,
    });

    // Attempt deletion by User B
    const deleteResult = await HabitsService.deleteHabit(userBId, habitA.id);
    expect(deleteResult).toBe(false);

    // Verify habit still exists for User A
    const freshHabitA = await HabitsService.getHabit(userAId, habitA.id);
    expect(freshHabitA).not.toBeNull();
  });

  it("PROVE ISOLATION: User B CANNOT log for or delete logs of User A's habit", async () => {
    const habitA = await HabitsService.createHabit(userAId, {
      title: "Hydration Check",
      category: "health",
      frequencyType: "daily",
      targetPerDay: 3,
    });

    // User B attempts to upsert log for User A's habit -> must return null
    const logResult = await HabitLogsService.upsertLog(
      userBId,
      habitA.id,
      "2026-10-25",
      1,
      "Attempted unauthorized log"
    );
    expect(logResult).toBeNull();

    // User A writes valid log
    const validLog = await HabitLogsService.upsertLog(
      userAId,
      habitA.id,
      "2026-10-25",
      3,
      "Completed daily hydration"
    );
    expect(validLog).not.toBeNull();
    expect(validLog?.userId).toBe(userAId);

    // User B attempts to delete User A's log -> must return false
    const deleteLogResult = await HabitLogsService.deleteLog(
      userBId,
      habitA.id,
      "2026-10-25"
    );
    expect(deleteLogResult).toBe(false);

    // User B queries logs for this date -> must see 0 logs
    const userBLogs = await HabitLogsService.getLogs(userBId, "2026-10-25", "2026-10-25");
    expect(userBLogs.length).toBe(0);

    // User A queries logs -> must see their log
    const userALogs = await HabitLogsService.getLogs(userAId, "2026-10-25", "2026-10-25");
    expect(userALogs.length).toBe(1);
    expect(userALogs[0].habitId).toBe(habitA.id);
  });
});

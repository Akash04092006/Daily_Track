import { prisma } from "@/lib/prisma";
import { recalculateStreaks } from "./streaks";
import type { HabitLog } from "@prisma/client";

export class HabitLogsService {
  /**
   * Retrieves habit logs for a date range, scoped to the user.
   */
  static async getLogs(
    userId: string,
    from: string,
    to: string,
    habitId?: string
  ): Promise<HabitLog[]> {
    return prisma.habitLog.findMany({
      where: {
        userId,
        date: {
          gte: from,
          lte: to,
        },
        ...(habitId ? { habitId } : {}),
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
  }

  /**
   * Upserts a log entry for a specific habit and date.
   */
  static async upsertLog(
    userId: string,
    habitId: string,
    date: string,
    value: number = 1,
    note?: string | null
  ): Promise<HabitLog | null> {
    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      return null;
    }

    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
      create: {
        habitId,
        userId,
        date,
        value,
        note: note ?? null,
      },
      update: {
        value,
        ...(note !== undefined ? { note: note ?? null } : {}),
      },
    });

    // Notify streak recalculation stub (Phase 5)
    await recalculateStreaks(habitId);

    return log;
  }

  /**
   * Deletes a log entry for a habit and date.
   */
  static async deleteLog(
    userId: string,
    habitId: string,
    date: string
  ): Promise<boolean> {
    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) {
      return false;
    }

    const existing = await prisma.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    if (!existing) {
      return false;
    }

    await prisma.habitLog.delete({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    // Notify streak recalculation stub (Phase 5)
    await recalculateStreaks(habitId);

    return true;
  }
}

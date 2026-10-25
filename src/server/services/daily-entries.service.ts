import { prisma } from "@/lib/prisma";
import type { UpsertDailyEntryInput } from "@/server/validators/daily-entry.schema";
import type { DailyEntry } from "@prisma/client";

export class DailyEntriesService {
  /**
   * Retrieves journal entries for a user, optionally filtered by date range.
   */
  static async getEntries(
    userId: string,
    from?: string,
    to?: string
  ): Promise<DailyEntry[]> {
    return prisma.dailyEntry.findMany({
      where: {
        userId,
        ...(from || to
          ? {
              date: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      orderBy: { date: "desc" },
    });
  }

  /**
   * Retrieves a single entry for a user on a specific date.
   */
  static async getEntry(userId: string, date: string): Promise<DailyEntry | null> {
    return prisma.dailyEntry.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });
  }

  /**
   * Upserts a journal entry for a specific date.
   */
  static async upsertEntry(
    userId: string,
    date: string,
    input: UpsertDailyEntryInput
  ): Promise<DailyEntry> {
    return prisma.dailyEntry.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      create: {
        userId,
        date,
        mood: input.mood ?? null,
        energy: input.energy ?? null,
        focus: input.focus ?? null,
        reflection: input.reflection ?? null,
        wins: input.wins ?? null,
      },
      update: {
        ...(input.mood !== undefined ? { mood: input.mood } : {}),
        ...(input.energy !== undefined ? { energy: input.energy } : {}),
        ...(input.focus !== undefined ? { focus: input.focus } : {}),
        ...(input.reflection !== undefined ? { reflection: input.reflection } : {}),
        ...(input.wins !== undefined ? { wins: input.wins } : {}),
      },
    });
  }

  /**
   * Deletes a journal entry for a date.
   */
  static async deleteEntry(userId: string, date: string): Promise<boolean> {
    const existing = await prisma.dailyEntry.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    if (!existing) {
      return false;
    }

    await prisma.dailyEntry.delete({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });

    return true;
  }
}

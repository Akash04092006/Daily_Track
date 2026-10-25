import { prisma } from "@/lib/prisma";
import { getTodayString } from "@/lib/dates";

export interface StatsSummaryResponse {
  totalHabits: number;
  completedToday: number;
  activeGoals: number;
}

export class StatsService {
  /**
   * Returns basic counts for dashboard stats cards.
   *
   * NOTE / TODO (Phase 5): Real streak calculations, completion analytics,
   * heatmaps, and weekly trends will be implemented in Phase 5 (Reminders & Streaks).
   */
  static async getSummary(userId: string): Promise<StatsSummaryResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    });

    const timezone = user?.timezone || "Asia/Kolkata";
    const today = getTodayString(timezone);

    // Total active habits
    const totalHabits = await prisma.habit.count({
      where: {
        userId,
        isArchived: false,
      },
    });

    // Habits with logs completed today
    const habitsWithLogs = await prisma.habit.findMany({
      where: {
        userId,
        isArchived: false,
      },
      include: {
        logs: {
          where: { date: today },
        },
      },
    });

    const completedToday = habitsWithLogs.filter(
      (h) => h.logs.length > 0 && h.logs[0].value >= h.targetPerDay
    ).length;

    // Active goals
    const activeGoals = await prisma.goal.count({
      where: {
        userId,
        status: "active",
      },
    });

    return {
      totalHabits,
      completedToday,
      activeGoals,
    };
  }
}

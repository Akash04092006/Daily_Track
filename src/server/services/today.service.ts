import { prisma } from "@/lib/prisma";
import { getTodayString, isHabitDueOnDate } from "@/lib/dates";
import type { Habit, HabitLog, DailyEntry } from "@prisma/client";

export interface TodayHabitItem {
  habit: Habit;
  log: HabitLog | null;
  isCompleted: boolean;
}

export interface TodayViewResponse {
  date: string;
  timezone: string;
  habits: TodayHabitItem[];
  dailyEntry: DailyEntry | null;
  summary: {
    totalDue: number;
    completedCount: number;
    completionRate: number;
  };
}

export class TodayService {
  /**
   * Constructs the complete Today View for the current date in the user's timezone.
   */
  static async getTodayView(userId: string): Promise<TodayViewResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    });

    if (!user) {
      return null;
    }

    const timezone = user.timezone || "Asia/Kolkata";
    const today = getTodayString(timezone);

    // Fetch active habits
    const activeHabits = await prisma.habit.findMany({
      where: {
        userId,
        isArchived: false,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    // Filter to habits due today based on frequency
    const dueHabits = activeHabits.filter((habit) => isHabitDueOnDate(habit, today));

    // Fetch logs for today
    const logs = await prisma.habitLog.findMany({
      where: {
        userId,
        date: today,
      },
    });

    const logsByHabitId = new Map<string, HabitLog>();
    for (const log of logs) {
      logsByHabitId.set(log.habitId, log);
    }

    // Fetch daily journal entry for today
    const dailyEntry = await prisma.dailyEntry.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    // Assemble items
    let completedCount = 0;
    const habits: TodayHabitItem[] = dueHabits.map((habit) => {
      const log = logsByHabitId.get(habit.id) || null;
      const isCompleted = (log?.value ?? 0) >= habit.targetPerDay;
      if (isCompleted) completedCount++;

      return {
        habit,
        log,
        isCompleted,
      };
    });

    const totalDue = habits.length;
    const completionRate =
      totalDue > 0 ? Math.round((completedCount / totalDue) * 100) : 0;

    return {
      date: today,
      timezone,
      habits,
      dailyEntry,
      summary: {
        totalDue,
        completedCount,
        completionRate,
      },
    };
  }
}

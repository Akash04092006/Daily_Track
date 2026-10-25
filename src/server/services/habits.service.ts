import { prisma } from "@/lib/prisma";
import type {
  CreateHabitInput,
  UpdateHabitInput,
} from "@/server/validators/habit.schema";
import type { Habit } from "@prisma/client";

export class HabitsService {
  /**
   * Lists all habits for a user, optionally filtered by archived status and category.
   */
  static async listHabits(
    userId: string,
    filters?: { archived?: boolean; category?: string }
  ): Promise<Habit[]> {
    return prisma.habit.findMany({
      where: {
        userId,
        ...(filters?.archived !== undefined ? { isArchived: filters.archived } : {}),
        ...(filters?.category ? { category: filters.category } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  /**
   * Retrieves a single habit by ID, scoped to user.
   */
  static async getHabit(userId: string, habitId: string): Promise<Habit | null> {
    return prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });
  }

  /**
   * Creates a new habit for the user.
   */
  static async createHabit(userId: string, input: CreateHabitInput): Promise<Habit> {
    let sortOrder = input.sortOrder;

    if (sortOrder === undefined) {
      const maxSort = await prisma.habit.findFirst({
        where: { userId },
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });
      sortOrder = (maxSort?.sortOrder ?? -1) + 1;
    }

    return prisma.habit.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        category: input.category,
        icon: input.icon,
        color: input.color,
        frequencyType: input.frequencyType,
        frequencyDays: input.frequencyDays,
        targetPerDay: input.targetPerDay,
        unit: input.unit,
        reminderTime: input.reminderTime,
        sortOrder,
      },
    });
  }

  /**
   * Updates an existing habit, ensuring it belongs to the user.
   */
  static async updateHabit(
    userId: string,
    habitId: string,
    input: UpdateHabitInput
  ): Promise<Habit | null> {
    const existing = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!existing) {
      return null;
    }

    return prisma.habit.update({
      where: { id: habitId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.icon !== undefined ? { icon: input.icon } : {}),
        ...(input.color !== undefined ? { color: input.color } : {}),
        ...(input.frequencyType !== undefined
          ? { frequencyType: input.frequencyType }
          : {}),
        ...(input.frequencyDays !== undefined
          ? { frequencyDays: input.frequencyDays }
          : {}),
        ...(input.targetPerDay !== undefined ? { targetPerDay: input.targetPerDay } : {}),
        ...(input.unit !== undefined ? { unit: input.unit } : {}),
        ...(input.reminderTime !== undefined ? { reminderTime: input.reminderTime } : {}),
        ...(input.isArchived !== undefined ? { isArchived: input.isArchived } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      },
    });
  }

  /**
   * Deletes a habit, ensuring it belongs to the user.
   */
  static async deleteHabit(userId: string, habitId: string): Promise<boolean> {
    const existing = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!existing) {
      return false;
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });
    return true;
  }

  /**
   * Toggles or sets the archived status of a habit.
   */
  static async archiveHabit(
    userId: string,
    habitId: string,
    archive: boolean = true
  ): Promise<Habit | null> {
    const existing = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!existing) {
      return null;
    }

    return prisma.habit.update({
      where: { id: habitId },
      data: { isArchived: archive },
    });
  }

  /**
   * Reorders a list of habits by updating their sortOrder indices.
   */
  static async reorderHabits(userId: string, habitIds: string[]): Promise<boolean> {
    // Verify all habits belong to the user
    const habits = await prisma.habit.findMany({
      where: { id: { in: habitIds }, userId },
      select: { id: true },
    });

    if (habits.length !== habitIds.length) {
      return false;
    }

    await prisma.$transaction(
      habitIds.map((id, index) =>
        prisma.habit.update({
          where: { id },
          data: { sortOrder: index },
        })
      )
    );

    return true;
  }
}

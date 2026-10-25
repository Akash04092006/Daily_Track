import { prisma } from "@/lib/prisma";
import type {
  CreateGoalInput,
  UpdateGoalInput,
  CreateMilestoneInput,
  UpdateMilestoneInput,
} from "@/server/validators/goal.schema";

export class GoalsService {
  /**
   * Lists goals for a user, with optional status filter.
   */
  static async listGoals(userId: string, status?: string) {
    return prisma.goal.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      include: {
        milestones: {
          orderBy: { sortOrder: "asc" },
        },
        goalHabits: {
          include: {
            habit: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Retrieves a single goal by ID, scoped to user.
   */
  static async getGoal(userId: string, goalId: string) {
    return prisma.goal.findFirst({
      where: { id: goalId, userId },
      include: {
        milestones: {
          orderBy: { sortOrder: "asc" },
        },
        goalHabits: {
          include: {
            habit: true,
          },
        },
      },
    });
  }

  /**
   * Creates a new goal.
   */
  static async createGoal(userId: string, input: CreateGoalInput) {
    return prisma.goal.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        category: input.category,
        status: input.status,
        targetValue: input.targetValue,
        currentValue: input.currentValue,
        unit: input.unit,
        startDate: new Date(input.startDate),
        targetDate: input.targetDate ? new Date(input.targetDate) : null,
      },
      include: {
        milestones: true,
        goalHabits: true,
      },
    });
  }

  /**
   * Updates an existing goal.
   */
  static async updateGoal(userId: string, goalId: string, input: UpdateGoalInput) {
    const existing = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!existing) {
      return null;
    }

    return prisma.goal.update({
      where: { id: goalId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.targetValue !== undefined ? { targetValue: input.targetValue } : {}),
        ...(input.currentValue !== undefined ? { currentValue: input.currentValue } : {}),
        ...(input.unit !== undefined ? { unit: input.unit } : {}),
        ...(input.startDate !== undefined
          ? { startDate: new Date(input.startDate) }
          : {}),
        ...(input.targetDate !== undefined
          ? { targetDate: input.targetDate ? new Date(input.targetDate) : null }
          : {}),
        ...(input.completedAt !== undefined
          ? { completedAt: input.completedAt ? new Date(input.completedAt) : null }
          : {}),
      },
      include: {
        milestones: { orderBy: { sortOrder: "asc" } },
        goalHabits: { include: { habit: true } },
      },
    });
  }

  /**
   * Deletes a goal and its cascaded milestones/links.
   */
  static async deleteGoal(userId: string, goalId: string): Promise<boolean> {
    const existing = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!existing) {
      return false;
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });

    return true;
  }

  /**
   * Adds a milestone to a goal.
   */
  static async createMilestone(
    userId: string,
    goalId: string,
    input: CreateMilestoneInput
  ) {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      return null;
    }

    let sortOrder = input.sortOrder;
    if (sortOrder === undefined) {
      const maxSort = await prisma.milestone.findFirst({
        where: { goalId },
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });
      sortOrder = (maxSort?.sortOrder ?? -1) + 1;
    }

    return prisma.milestone.create({
      data: {
        goalId,
        title: input.title,
        isDone: input.isDone,
        doneAt: input.isDone ? new Date() : null,
        sortOrder,
      },
    });
  }

  /**
   * Updates a milestone.
   */
  static async updateMilestone(
    userId: string,
    goalId: string,
    milestoneId: string,
    input: UpdateMilestoneInput
  ) {
    // Verify goal belongs to user
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      return null;
    }

    const milestone = await prisma.milestone.findFirst({
      where: { id: milestoneId, goalId },
    });

    if (!milestone) {
      return null;
    }

    let doneAt = milestone.doneAt;
    if (input.isDone !== undefined) {
      if (input.isDone && !milestone.isDone) {
        doneAt = new Date();
      } else if (!input.isDone) {
        doneAt = null;
      }
    }

    return prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.isDone !== undefined ? { isDone: input.isDone, doneAt } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      },
    });
  }

  /**
   * Deletes a milestone.
   */
  static async deleteMilestone(
    userId: string,
    goalId: string,
    milestoneId: string
  ): Promise<boolean> {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      return false;
    }

    const milestone = await prisma.milestone.findFirst({
      where: { id: milestoneId, goalId },
    });

    if (!milestone) {
      return false;
    }

    await prisma.milestone.delete({
      where: { id: milestoneId },
    });

    return true;
  }

  /**
   * Replaces the set of habits linked to this goal.
   */
  static async linkHabits(
    userId: string,
    goalId: string,
    habitIds: string[]
  ): Promise<boolean> {
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      return false;
    }

    if (habitIds.length > 0) {
      // Verify all habits belong to this user
      const userHabits = await prisma.habit.findMany({
        where: { id: { in: habitIds }, userId },
        select: { id: true },
      });

      if (userHabits.length !== habitIds.length) {
        return false;
      }
    }

    await prisma.$transaction([
      prisma.goalHabit.deleteMany({
        where: { goalId },
      }),
      ...habitIds.map((habitId) =>
        prisma.goalHabit.create({
          data: {
            goalId,
            habitId,
          },
        })
      ),
    ]);

    return true;
  }
}

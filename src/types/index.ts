import type {
  User as PrismaUser,
  Habit as PrismaHabit,
  HabitLog as PrismaHabitLog,
  DailyEntry as PrismaDailyEntry,
  Goal as PrismaGoal,
  Milestone as PrismaMilestone,
  GoalHabit as PrismaGoalHabit,
} from "@prisma/client";

export type {
  PrismaUser as User,
  PrismaHabit as Habit,
  PrismaHabitLog as HabitLog,
  PrismaDailyEntry as DailyEntry,
  PrismaGoal as Goal,
  PrismaMilestone as Milestone,
  PrismaGoalHabit as GoalHabit,
};

export type { SafeUser } from "@/server/auth/current-user";

export type {
  HabitCategory,
  FrequencyType,
  GoalStatus,
  ThemePreference,
  IconKey,
  ColorKey,
} from "@/lib/constants";

export {
  HABIT_CATEGORIES,
  FREQUENCY_TYPES,
  GOAL_STATUSES,
  THEME_PREFERENCES,
  ICON_KEYS,
  COLOR_KEYS,
} from "@/lib/constants";

export type { SignupInput, LoginInput } from "@/server/validators/auth.schema";

export type {
  CreateHabitInput,
  UpdateHabitInput,
  ReorderHabitsInput,
} from "@/server/validators/habit.schema";

export type {
  UpsertHabitLogInput,
  GetHabitLogsQuery,
} from "@/server/validators/habit-log.schema";

export type {
  UpsertDailyEntryInput,
  GetDailyEntriesQuery,
} from "@/server/validators/daily-entry.schema";

export type {
  CreateGoalInput,
  UpdateGoalInput,
  CreateMilestoneInput,
  UpdateMilestoneInput,
  LinkHabitsInput,
} from "@/server/validators/goal.schema";

export type {
  UpdateProfileInput,
  ChangePasswordInput,
} from "@/server/validators/profile.schema";

export type { TodayHabitItem, TodayViewResponse } from "@/server/services/today.service";

export type { StatsSummaryResponse } from "@/server/services/stats.service";

export type {
  ApiResponse,
  ApiResponseSuccess,
  ApiResponseError,
} from "@/server/utils/response";

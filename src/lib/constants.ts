export const HABIT_CATEGORIES = [
  "health",
  "fitness",
  "learning",
  "mindfulness",
  "productivity",
  "finance",
  "social",
  "other",
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

export const FREQUENCY_TYPES = ["daily", "weekdays", "custom"] as const;
export type FrequencyType = (typeof FREQUENCY_TYPES)[number];

export const GOAL_STATUSES = ["active", "completed", "paused", "abandoned"] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const ICON_KEYS = [
  "dumbbell",
  "book",
  "sun",
  "heart",
  "code",
  "water",
  "brain",
  "dollar",
  "users",
  "zap",
  "smile",
  "moon",
  "target",
  "coffee",
  "shield",
] as const;
export type IconKey = (typeof ICON_KEYS)[number];

export const COLOR_KEYS = [
  "emerald",
  "blue",
  "indigo",
  "violet",
  "amber",
  "rose",
  "cyan",
  "orange",
] as const;
export type ColorKey = (typeof COLOR_KEYS)[number];

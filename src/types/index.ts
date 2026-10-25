export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  targetCount: number;
  completedCount: number;
  streak: number;
  createdAt: Date;
}

export type Theme = "light" | "dark" | "system";

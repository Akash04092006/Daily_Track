import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { HabitsService } from "@/server/services/habits.service";
import { createHabitSchema } from "@/server/validators/habit.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { searchParams } = request.nextUrl;
  const archivedParam = searchParams.get("archived");
  const categoryParam = searchParams.get("category");

  const archived =
    archivedParam !== null
      ? archivedParam === "true" || archivedParam === "1"
      : undefined;

  const habits = await HabitsService.listHabits(user.id, {
    archived,
    category: categoryParam || undefined,
  });

  return apiSuccess(habits, 200);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Malformed JSON request body", null, 400);
  }

  const result = createHabitSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const habit = await HabitsService.createHabit(user.id, result.data);
  return apiSuccess(habit, 201);
}

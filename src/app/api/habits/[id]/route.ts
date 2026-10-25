import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { HabitsService } from "@/server/services/habits.service";
import { updateHabitSchema } from "@/server/validators/habit.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { id } = await params;
  const habit = await HabitsService.getHabit(user.id, id);

  if (!habit) {
    return apiError("NOT_FOUND", "Habit not found", null, 404);
  }

  return apiSuccess(habit, 200);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Malformed JSON request body", null, 400);
  }

  const result = updateHabitSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const updated = await HabitsService.updateHabit(user.id, id, result.data);
  if (!updated) {
    return apiError("NOT_FOUND", "Habit not found", null, 404);
  }

  return apiSuccess(updated, 200);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { id } = await params;
  const deleted = await HabitsService.deleteHabit(user.id, id);

  if (!deleted) {
    return apiError("NOT_FOUND", "Habit not found", null, 404);
  }

  return apiSuccess({ message: "Habit deleted successfully" }, 200);
}

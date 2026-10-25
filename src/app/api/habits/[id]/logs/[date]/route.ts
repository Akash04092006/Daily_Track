import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { HabitLogsService } from "@/server/services/habit-logs.service";
import { upsertHabitLogSchema } from "@/server/validators/habit-log.schema";
import { isValidDateString } from "@/lib/dates";
import { apiSuccess, apiError } from "@/server/utils/response";

interface RouteContext {
  params: Promise<{ id: string; date: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { id: habitId, date } = await params;

  if (!isValidDateString(date)) {
    return apiError("INVALID_DATE", "Date must be in YYYY-MM-DD format", null, 400);
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is allowed and will use defaults (value: 1)
  }

  const result = upsertHabitLogSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const log = await HabitLogsService.upsertLog(
    user.id,
    habitId,
    date,
    result.data.value,
    result.data.note
  );

  if (!log) {
    return apiError("NOT_FOUND", "Habit not found", null, 404);
  }

  return apiSuccess(log, 200);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { id: habitId, date } = await params;

  if (!isValidDateString(date)) {
    return apiError("INVALID_DATE", "Date must be in YYYY-MM-DD format", null, 400);
  }

  const deleted = await HabitLogsService.deleteLog(user.id, habitId, date);
  if (!deleted) {
    return apiError("NOT_FOUND", "Habit log not found", null, 404);
  }

  return apiSuccess({ message: "Habit log deleted successfully" }, 200);
}

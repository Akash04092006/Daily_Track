import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { HabitsService } from "@/server/services/habits.service";
import { reorderHabitsSchema } from "@/server/validators/habit.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

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

  const result = reorderHabitsSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const success = await HabitsService.reorderHabits(user.id, result.data.habitIds);
  if (!success) {
    return apiError(
      "INVALID_HABITS",
      "One or more habit IDs are invalid or do not belong to the user",
      null,
      400
    );
  }

  return apiSuccess({ message: "Habits reordered successfully" }, 200);
}

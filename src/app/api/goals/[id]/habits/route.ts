import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { GoalsService } from "@/server/services/goals.service";
import { linkHabitsSchema } from "@/server/validators/goal.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { id: goalId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Malformed JSON request body", null, 400);
  }

  const result = linkHabitsSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const success = await GoalsService.linkHabits(user.id, goalId, result.data.habitIds);
  if (!success) {
    return apiError(
      "NOT_FOUND",
      "Goal not found or one or more habit IDs do not belong to the user",
      null,
      404
    );
  }

  return apiSuccess({ message: "Linked habits updated successfully" }, 200);
}

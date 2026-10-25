import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { GoalsService } from "@/server/services/goals.service";
import { updateMilestoneSchema } from "@/server/validators/goal.schema";
import { apiSuccess, apiError } from "@/server/utils/response";

interface RouteContext {
  params: Promise<{ id: string; milestoneId: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { id: goalId, milestoneId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("INVALID_JSON", "Malformed JSON request body", null, 400);
  }

  const result = updateMilestoneSchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const updated = await GoalsService.updateMilestone(
    user.id,
    goalId,
    milestoneId,
    result.data
  );

  if (!updated) {
    return apiError("NOT_FOUND", "Goal or milestone not found", null, 404);
  }

  return apiSuccess(updated, 200);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { id: goalId, milestoneId } = await params;

  const deleted = await GoalsService.deleteMilestone(user.id, goalId, milestoneId);
  if (!deleted) {
    return apiError("NOT_FOUND", "Goal or milestone not found", null, 404);
  }

  return apiSuccess({ message: "Milestone deleted successfully" }, 200);
}

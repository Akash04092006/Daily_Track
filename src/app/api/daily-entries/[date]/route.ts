import { NextRequest } from "next/server";
import { getCurrentUser } from "@/server/auth/current-user";
import { DailyEntriesService } from "@/server/services/daily-entries.service";
import { upsertDailyEntrySchema } from "@/server/validators/daily-entry.schema";
import { isValidDateString } from "@/lib/dates";
import { apiSuccess, apiError } from "@/server/utils/response";

interface RouteContext {
  params: Promise<{ date: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { date } = await params;

  if (!isValidDateString(date)) {
    return apiError("INVALID_DATE", "Date must be in YYYY-MM-DD format", null, 400);
  }

  const entry = await DailyEntriesService.getEntry(user.id, date);
  return apiSuccess(entry, 200);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { date } = await params;

  if (!isValidDateString(date)) {
    return apiError("INVALID_DATE", "Date must be in YYYY-MM-DD format", null, 400);
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // Allows empty body
  }

  const result = upsertDailyEntrySchema.safeParse(body);
  if (!result.success) {
    return apiError("VALIDATION_ERROR", "Validation failed", result.error.format(), 422);
  }

  const entry = await DailyEntriesService.upsertEntry(user.id, date, result.data);
  return apiSuccess(entry, 200);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError("UNAUTHORIZED", "Authentication required", null, 401);
  }

  const { date } = await params;

  if (!isValidDateString(date)) {
    return apiError("INVALID_DATE", "Date must be in YYYY-MM-DD format", null, 400);
  }

  const deleted = await DailyEntriesService.deleteEntry(user.id, date);
  if (!deleted) {
    return apiError("NOT_FOUND", "Daily entry not found", null, 404);
  }

  return apiSuccess({ message: "Daily entry deleted successfully" }, 200);
}

import { NextResponse } from "next/server";

export interface ApiResponseSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiResponseError {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

/**
 * Creates a standard JSON success response.
 */
export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json<ApiResponseSuccess<T>>(
    {
      ok: true,
      data,
    },
    { status }
  );
}

/**
 * Creates a standard JSON failure response.
 */
export function apiError(
  code: string,
  message: string,
  details: unknown = null,
  status: number = 400
) {
  return NextResponse.json<ApiResponseError>(
    {
      ok: false,
      error: {
        code,
        message,
        ...(details !== null && details !== undefined ? { details } : {}),
      },
    },
    { status }
  );
}

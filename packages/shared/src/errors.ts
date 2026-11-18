import { z } from "zod";

export const ERROR_CODES = [
  "unauthorized",
  "not_found",
  "plan_limit",
  "payment_required",
  "rate_limited",
  "quota_exceeded",
  "validation",
  "internal",
] as const;
export const errorCodeSchema = z.enum(ERROR_CODES);
export type ErrorCode = z.infer<typeof errorCodeSchema>;

/** HTTP status for each error code. */
export const ERROR_STATUS: Readonly<Record<ErrorCode, number>> = Object.freeze({
  unauthorized: 401,
  not_found: 404,
  plan_limit: 403,
  payment_required: 402,
  rate_limited: 429,
  quota_exceeded: 429,
  validation: 400,
  internal: 500,
});

/** Default message for each error code, safe to show to users. */
export const ERROR_MESSAGES: Readonly<Record<ErrorCode, string>> = Object.freeze({
  unauthorized: "Please sign in.",
  not_found: "Not found.",
  plan_limit: "Your plan's limit is reached. Upgrade to add more.",
  payment_required: "This needs the Pro plan.",
  rate_limited: "Too many requests. Please wait a moment.",
  quota_exceeded: "This assistant has reached its monthly message limit.",
  validation: "Some input is invalid.",
  internal: "Something went wrong. Please try again.",
});

export const apiErrorSchema = z.object({
  error: z.object({
    code: errorCodeSchema,
    message: z.string(),
  }),
});

/** Body of every error response: `{ error: { code, message } }`. */
export type ApiError = z.infer<typeof apiErrorSchema>;

/** Build an error body. Uses the code's default message when none is given. */
export function apiError(code: ErrorCode, message?: string): ApiError {
  return { error: { code, message: message ?? ERROR_MESSAGES[code] } };
}

/** Whether a parsed JSON body is an `ApiError`. */
export function isApiError(body: unknown): body is ApiError {
  return apiErrorSchema.safeParse(body).success;
}

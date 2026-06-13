/**
 * Maps Better Auth error responses to clear, user-friendly messages.
 *
 * Better Auth's `onError` callback receives `{ error: { message, status, code } }`.
 * Thrown/network failures have no structured shape, so we normalize everything
 * here and always return something readable (never "undefined").
 */

type AuthErrorLike = {
  code?: string;
  message?: string;
  status?: number;
};

const MESSAGES_BY_CODE: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Incorrect email or password. Please try again.",
  INVALID_PASSWORD: "Incorrect password. Please try again.",
  INVALID_EMAIL: "Please enter a valid email address.",
  USER_NOT_FOUND: "No account found with that email.",
  USER_ALREADY_EXISTS: "An account with that email already exists.",
  EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
  PASSWORD_TOO_SHORT: "Password is too short.",
  PASSWORD_TOO_LONG: "Password is too long.",
  CREDENTIAL_ACCOUNT_NOT_FOUND: "No account found with that email.",
  ACCOUNT_NOT_FOUND: "No account found with that email.",
  TOO_MANY_REQUESTS: "Too many attempts. Please wait a moment and try again.",
};

/** Extracts a friendly message from any Better Auth / network error shape. */
export function getAuthErrorMessage(error: unknown): string {
  // Better Auth onError shape: { error: { code, message, status } }
  const candidate =
    error && typeof error === "object" && "error" in error
      ? (error as { error: AuthErrorLike }).error
      : (error as AuthErrorLike);

  const code = candidate?.code?.toUpperCase();
  if (code && MESSAGES_BY_CODE[code]) {
    return MESSAGES_BY_CODE[code];
  }

  // Rate limiting / server errors by status.
  if (candidate?.status === 429) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (candidate?.status && candidate.status >= 500) {
    return "Something went wrong on our end. Please try again shortly.";
  }

  // A non-empty, human-readable message from the server.
  if (candidate?.message && candidate.message.trim()) {
    return candidate.message;
  }

  // Network failure (fetch threw) — no structured response at all.
  if (error instanceof TypeError) {
    return "Can't reach the server. Check your connection and try again.";
  }

  return "Something went wrong. Please try again.";
}

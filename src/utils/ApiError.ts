/**
 * Custom error type for API responses with HTTP status and payload details.
 */
class ApiError extends Error {
  /**
   * @param statusCode - HTTP status code for the error response.
   * @param message - Human-readable error message.
   * @param errors - Optional list of validation or domain errors.
   * @param data - Optional payload to include with the error.
   * @param success - Success flag (typically false for errors).
   * @param stack - Optional stack trace override.
   */
  constructor(
    public statusCode: number,
    message: string = 'Something went wrong',
    public errors: unknown[] = [],
    public data: unknown | null = null,
    public success: boolean,
    stack: string = ''
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.stack = stack;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

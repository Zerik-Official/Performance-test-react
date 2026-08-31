/**
 * Error handling utilities.
 * @module shared/utils/errors
 */

export type ApiErrorType = 'network' | 'validation' | 'auth' | 'forbidden' | 'conflict' | 'unknown';

export class ApiError extends Error {
  public readonly type: ApiErrorType;
  public readonly status?: number;
  public readonly details?: unknown;

  /**
   * Creates an ApiError.
   * @param {string} message - Error message.
   * @param {ApiErrorType} type - Error category.
   * @param {number} [status] - HTTP status.
   * @param {unknown} [details] - Raw details.
   */
  constructor(message: string, type: ApiErrorType, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
    this.details = details;
  }
}

/**
 * Maps axios/fetch error to ApiError.
 * @param {unknown} error - Raw error.
 * @returns {ApiError} Normalized error.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  const err = error as { response?: { status?: number; data?: { message?: string } }; request?: unknown; message?: string };
  if (err.response) {
    const status = err.response.status || 500;
    const message = err.response.data?.message || err.message || 'Request failed';
    if (status === 400) return new ApiError(message, 'validation', status, err.response.data);
    if (status === 401) return new ApiError(message, 'auth', status, err.response.data);
    if (status === 403) return new ApiError(message, 'forbidden', status, err.response.data);
    if (status === 409) return new ApiError(message, 'conflict', status, err.response.data);
    return new ApiError(message, 'unknown', status, err.response.data);
  }
  if (err.request) {
    return new ApiError('Network error - backend unavailable', 'network', undefined, err.request);
  }
  return new ApiError((err.message as string) || 'Unknown error', 'unknown');
}
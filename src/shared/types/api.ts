/**
 * Api domain types.
 * @module shared/types/api
 */

export interface ApiResponse {
    message?: string;
    error?: string;
    statusCode?: number;
}
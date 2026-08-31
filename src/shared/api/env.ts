/**
 * Environment configuration helper.
 * @module shared/api/env
 */

/**
 * @typedef {Object} EnvConfig
 * @property {string} apiUrl - Base API URL.
 */

/**
 * Retrieves environment configuration.
 * @returns {EnvConfig} Env config.
 */
export function getEnv(): { apiUrl: string } {
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
  return {
    apiUrl: apiUrl || 'http://localhost:3000',
  };
}
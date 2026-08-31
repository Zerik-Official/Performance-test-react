/**
 * Role constants.
 * @module shared/constants/roles
 */

export const ROLES = {
  ADMIN: 'admin' as const,
  USER: 'user' as const,
};

export type Role = typeof ROLES[keyof typeof ROLES];
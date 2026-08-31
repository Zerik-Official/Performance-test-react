/**
 * Auth domain types.
 * @module shared/types/auth
 */
import type { User } from './user';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}
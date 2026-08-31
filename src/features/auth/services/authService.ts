/**
 * Auth service with class-based API.
 * @module features/auth/services/authService
 */
import { apiClient } from '@shared/api/client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@shared/types/auth';
import type { User } from '@shared/types/user';

/**
 * Handles authentication operations.
 */
export class AuthService {
  /**
   * Logs in a user.
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @returns {Promise<AuthResponse>} Auth response.
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const payload: LoginPayload = { email, password };
    const res = await apiClient.post<AuthResponse>('/auth/login', payload);
    return res.data;
  }

  /**
   * Registers a new user.
   * @param {string} name - User name.
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @returns {Promise<AuthResponse>} Auth response.
   */
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const payload: RegisterPayload = { name, email, password };
    const res = await apiClient.post<AuthResponse>('/auth/register', payload);
    return res.data;
  }

  /**
   * Logs out current user and redirects to login.
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      window.location.href = '/login';
    }
  }

  /**
   * Fetches current user profile.
   * @returns {Promise<User>} User.
   */
  async me(): Promise<User> {
    const res = await apiClient.get<User>('/users/me');
    return res.data;
  }
}
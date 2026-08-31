/**
 * Session storage manager for authentication token and user.
 * @module shared/lib/sessionStore
 */

export interface StoredUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

/**
 * Manages sessionStorage operations for auth state.
 */
export class SessionStore {
  private readonly tokenKey = 'accessToken';
  private readonly userKey = 'authUser';

  /**
   * Retrieves the stored access token.
   * @returns {string | null} Token or null if not found.
   */
  get(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  /**
   * Stores the access token.
   * @param {string} token - JWT token to store.
   * @returns {void}
   */
  set(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  /**
   * Removes the access token and user from storage.
   * @returns {void}
   */
  delete(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }

  /**
   * Stores the authenticated user.
   * @param {StoredUser} user - User object to store.
   * @returns {void}
   */
  setUser(user: StoredUser): void {
    sessionStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Retrieves the stored user.
   * @returns {StoredUser | null} User or null.
   */
  getUser(): StoredUser | null {
    const raw = sessionStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredUser;
    } catch {
      return null;
    }
  }
}

export const sessionStore = new SessionStore();
/**
 * Axios client with auth interceptors.
 * @module shared/api/client
 */
import axios from 'axios';
import { getEnv } from './env';
import { sessionStore } from '@shared/lib/sessionStore';

const env = getEnv();
const authRoutes: Array<string> = ["login", "register"];

/**
 * Configured axios instance for API communication.
 */
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStore.get();
  if (token && config.headers) {
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  
  (response) => response,
  (error) => {
    const currentPath = window.location.href.replace('/', '');

    if (error.response && error.response.status === 401) {
      sessionStore.delete();
      if (!authRoutes.includes(currentPath)) window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
/**
 * Generic fetch hook.
 * @module shared/hooks/useFetch
 */
import { useEffect, useState } from 'react';
import { apiClient } from '@shared/api/client';
import { toApiError, ApiError } from '@shared/utils/errors';

export interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * Reusable generic fetch hook.
 * @template T
 * @param {string} url - Request URL.
 * @returns {UseFetchState<T>} State.
 */
export function useFetch<T>(url: string): UseFetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let active = true;
    async function load(): Promise<void> {
      try {
        setLoading(true);
        const res = await apiClient.get<T>(url);
        if (active) setData(res.data);
      } catch (err) {
        if (active) setError(toApiError(err));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [url]);

  return { data, loading, error };
}
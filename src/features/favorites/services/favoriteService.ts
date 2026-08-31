// src/features/favorites/services/favoriteService.ts
import { apiClient } from '@shared/api/client';
import type { Event } from '@/shared/types/events';

export class FavoriteService {
  async getFavorites(): Promise<Event[] | []> {
    const res = await apiClient.get<Event[]>('/favorites');
    return res.data;
  }

  async addFavorite(eventId: string): Promise<void> {
    await apiClient.post(`/favorites/${eventId}`);
  }

  async removeFavorite(eventId: string): Promise<void> {
    await apiClient.delete(`/favorites/${eventId}`);
  }
}

export const favoriteService = new FavoriteService();
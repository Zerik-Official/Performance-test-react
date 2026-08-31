/**
 * Event service with class-based API.
 * @module features/events/services/eventService
 */
import { apiClient } from '@shared/api/client';
import type { Event, EventPayload, EventResponse } from '@/shared/types/events';
import type { ApiResponse } from '@/shared/types/api';

/**
 * Handles event operations.
 */
export class EventService {
  /**
   * Fetches all events, with optional search and category filters.
   * @param {string} [search] - Text query to filter by name or description.
   * @param {string} [categoryId] - Category ID to filter events.
   * @returns {Promise<Event[] | []>} List of events.
   */
  async getEvents(search?: string, categoryId?: string): Promise<Event[] | []> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (categoryId) params.append('categoryId', categoryId);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await apiClient.get<Event[]>(`/events${query}`);
    return res.data;
  }

  /**
   * Fetches an event by its ID.
   * @param {string} eventId - Event ID.
   * @returns {Promise<EventResponse | ApiResponse>} Event details.
   */
  async getEventById(eventId: string): Promise<EventResponse | ApiResponse> {
    const res = await apiClient.get<Event>(`/events/${eventId}`);
    return res.data;
  }

  /**
   * Creates a new event.
   * @param {EventPayload} payload - Event data to create.
   * @returns {Promise<EventResponse>} Created event.
   */
  async createEvent(payload: EventPayload): Promise<EventResponse> {
    const res = await apiClient.post<EventResponse>('/events', payload);
    return res.data;
  }

  /**
   * Updates an existing event.
   * @param {string} eventId - Event ID.
   * @param {Partial<EventPayload>} payload - Event data payload to update.
   * @returns {Promise<EventPayload>} Updated event payload.
   */
  async updateEvent(eventId: string, payload: Partial<EventPayload>): Promise<EventPayload> {
    const res = await apiClient.patch(`/events/${eventId}`, payload);
    return res.data;
  }

  /**
   * Deletes an event by its ID.
   * @param {string} eventId - Event ID.
   * @returns {Promise<undefined>}
   */
  async deleteEvent(eventId: string): Promise<undefined> {
    await apiClient.delete(`/events/${eventId}`);
  }
}

export const eventService = new EventService();
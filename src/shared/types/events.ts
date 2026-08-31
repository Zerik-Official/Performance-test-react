/**
 * Event domain types.
 * @module shared/types/event
 */

export interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  location: string;
  price: string | number;
  capacity: string | number;
  categoryId: string;
  images: Array<string>;
  createdAt?: string;
  updateAt?: string;
}

export type EventPayload = Omit<Event, 'id' | 'createdAt' | 'updateAt'>;

export type EventResponse = Event;
import type { Event } from './events';

export interface Favorite {
  id: string;
  userId: string;
  eventId: string;
  event?: Event;
}
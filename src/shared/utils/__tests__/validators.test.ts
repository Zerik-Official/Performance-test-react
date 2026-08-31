import { describe, it, expect } from 'vitest';

// Ejemplo de función pura de validación de email o payload de eventos
export function validateEventPayload(data: { title: string; price: number }) {
  if (!data.title || data.title.trim() === '') return false;
  if (data.price < 0) return false;
  return true;
}

describe('Event Payload Unit Tests', () => {
  it('should return true for a valid event payload', () => {
    const isValid = validateEventPayload({ title: 'Concert in Park', price: 15 });
    expect(isValid).toBe(true);
  });

  it('should return false if title is empty', () => {
    const isValid = validateEventPayload({ title: '', price: 10 });
    expect(isValid).toBe(false);
  });

  it('should return false if price is negative', () => {
    const isValid = validateEventPayload({ title: 'Workshop', price: -5 });
    expect(isValid).toBe(false);
  });
});
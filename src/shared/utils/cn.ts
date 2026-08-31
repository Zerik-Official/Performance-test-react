/**
 * Class name merger for tailwind.
 * @module shared/utils/cn
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names with tailwind conflict resolution.
 * @param {...ClassValue} inputs - Class values.
 * @returns {string} Merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
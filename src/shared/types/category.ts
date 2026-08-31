/**
 * Category domain types.
 * @module shared/types/category
 */

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updateAt?: string;
}

export type CategoryPayload = Pick<Category, 'name' | 'description'>;

export type CategoryResponse = Category
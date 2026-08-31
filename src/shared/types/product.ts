/**
 * Product domain types.
 * @module shared/types/product
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
  createdAt?: string;
}
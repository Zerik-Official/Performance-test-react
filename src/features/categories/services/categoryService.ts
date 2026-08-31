/**
 * Category service with class-based API.
 * @module features/categories/services/categoryService
 */
import { apiClient } from '@shared/api/client';
import type { Category, CategoryPayload, CategoryResponse } from '@/shared/types/category';
import type { ApiResponse } from '@/shared/types/api';

/**
 * Handles category operations.
 */
export class CategoryService {
  /**
   * Fetches all categories.
   * @returns {Promise<Category[] | []>} List of categories.
   */
  async getCategories(): Promise<Category[] | []> {
    const res = await apiClient.get<Category[]>('/categories');
    return res.data;
  }

  /**
   * Fetches a category by its ID.
   * @param {string} categoryId - Category ID.
   * @returns {Promise<Category | []>} Category details.
   */
  async getCategoryById(categoryId: string): Promise<CategoryResponse | ApiResponse> {
    const res = await apiClient.get<Category>(`/categories/${categoryId}`);
    return res.data;
  }

  /**
     * Creates a new category.
     * @param {CategoryPayload} payload - Category data to create.
     * @returns {Promise<CategoryResponse>} Created category.
     */
    async createCategory(payload: CategoryPayload): Promise<CategoryResponse> {
      const res = await apiClient.post<CategoryResponse>('/categories', payload);
      return res.data;
    }

  /**
   * Updates an existing category.
   * @param {string} categoryId - Category ID.
   * @param {string} name - Category name.
   * @param {string} [description] - Category description.
   * @returns {Promise<CategoryPayload>} Updated category payload.
   */
  async updateCategory(categoryId: string, name: string, description: string = ''): Promise<CategoryPayload> {
    const categoryPayload: CategoryPayload = { name, description };
    const res = await apiClient.patch(`/categories/${categoryId}`, categoryPayload);
    return res.data;
  }

  /**
   * Deletes a category by its ID.
   * @param {string} categoryId - Category ID.
   * @returns {Promise<undefined>}
   */
  async deleteCategory(categoryId: string): Promise<undefined> {
    await apiClient.delete(`/categories/${categoryId}`);
  }
}

export const categoryService = new CategoryService();
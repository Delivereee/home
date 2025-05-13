import apiClient from './config';
import { Category } from '../types/category';

// 모든 카테고리 가져오기
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // 에러 발생 시 빈 배열 반환하거나 적절히 처리
    return [];
  }
};

// 특정 카테고리 가져오기
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    return null;
  }
};

// 카테고리 생성
export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
  try {
    const response = await apiClient.post('/categories', category);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
};

// 이외 필요한 API 메서드 추가 가능 
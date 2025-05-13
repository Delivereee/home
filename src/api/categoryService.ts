import apiClient from './config';
import { Category } from '../types/category';
import { handleApiError, logApiResponse } from './utils';

/**
 * 모든 카테고리 가져오기
 * @returns 카테고리 목록
 */
export const getCategories = async (): Promise<Category[]> => {
  const endpoint = '/categories';
  
  try {
    const response = await apiClient.get(endpoint);
    logApiResponse(endpoint, response.data);
    
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error fetching categories: ${apiError.message}`, apiError);
    
    // 개발 환경에서는 빈 배열 반환 (샘플 데이터를 사용하도록)
    if (process.env.NODE_ENV === 'development') {
      console.info('Returning empty array to use sample category data');
      return [];
    }
    
    throw apiError;
  }
};

/**
 * 특정 카테고리 가져오기
 * @param id 카테고리 ID
 * @returns 카테고리 상세 정보
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const endpoint = `/categories/${id}`;
  
  try {
    const response = await apiClient.get(endpoint);
    logApiResponse(endpoint, response.data);
    
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error fetching category with id ${id}: ${apiError.message}`, apiError);
    
    return null;
  }
};

/**
 * 카테고리 생성
 * @param category 생성할 카테고리 정보
 * @returns 생성된 카테고리 정보
 */
export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category | null> => {
  const endpoint = '/categories';
  
  try {
    const response = await apiClient.post(endpoint, category);
    logApiResponse(endpoint, response.data);
    
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error creating category: ${apiError.message}`, apiError);
    
    return null;
  }
};

// 이외 필요한 API 메서드 추가 가능 
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
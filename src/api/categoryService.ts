import { Category, CATEGORIES } from '../types/category';

/**
 * 모든 카테고리 가져오기
 * @returns 카테고리 목록
 */
export const getCategories = async (): Promise<Category[]> => {
  // 항상 미리 정의된 카테고리 데이터 사용
  return CATEGORIES;
};
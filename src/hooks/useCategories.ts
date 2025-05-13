import { useState, useEffect, useCallback } from 'react';
import { getCategories } from '../api/categoryService';
import { Category, CATEGORIES } from '../types/category';
import { STATUS_MESSAGES } from '../config/constants';

/**
 * 카테고리 목록을 가져오는 커스텀 훅
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API에서 데이터 가져오기 시도
      const data = await getCategories();
      
      // API 호출 실패 시 로컬 데이터 사용 (개발 편의를 위해)
      if (data.length === 0) {
        // 로컬 샘플 데이터 사용
        setCategories(CATEGORIES);
        console.log('Using sample data for categories');
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(STATUS_MESSAGES.error.categories);
      
      // 에러 발생 시에도 기본 카테고리 데이터 사용
      setCategories(CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}; 
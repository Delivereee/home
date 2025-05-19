import { useState, useEffect, useCallback } from 'react';
import { getCategories } from '../api/categoryService';
import { Category } from '../types/category';
import { getStatusMessages } from '../config/constants';

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
      
      // 데이터 설정
      setCategories(data);
      
      // 데이터가 비어있으면 사용자에게 알림
      if (data.length === 0) {
        console.log('가져온 카테고리 데이터가 없습니다.');
      }
    } catch (err) {
      console.error('카테고리 데이터를 가져오는데 실패했습니다:', err);
      const STATUS_MESSAGES = getStatusMessages();
      setError(STATUS_MESSAGES.error.categories);
      
      // 에러 발생 시 빈 배열 설정
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}; 
import { useState, useEffect, useCallback } from 'react';
import { getNearbyRestaurants } from '../api/restaurantService';
import { Restaurant } from '../types/restaurant';
import { FoodCategory } from '../types/category';
import { DEFAULT_COORDINATES, STATUS_MESSAGES } from '../config/constants';

/**
 * 레스토랑 목록을 가져오는 커스텀 훅
 * @param categoryName 카테고리 이름
 */
export const useRestaurants = (categoryName?: string) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 환경 설정에서 위치 정보 가져오기
      const { lat, lng } = DEFAULT_COORDINATES;
      
      // URL에서 받은 카테고리 이름을 사용하거나 기본값 사용
      const category = categoryName || FoodCategory.FAST_FOOD;
      
      const data = await getNearbyRestaurants({
        category,
        lat,
        lng
      });
      
      setRestaurants(data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError(STATUS_MESSAGES.error.restaurants);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);
  
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);
  
  return { restaurants, loading, error, refetch: fetchRestaurants };
}; 
import { useState, useEffect, useCallback } from 'react';
import { getNearbyRestaurants } from '../api/restaurantService';
import { Restaurant } from '../types/restaurant';
import { DEFAULT_COORDINATES, STATUS_MESSAGES } from '../config/constants';

interface UseRestaurantsProps {
  categoryName?: string;
  franchiseId?: string;
  allRestaurants?: boolean;
}

/**
 * 레스토랑 목록을 가져오는 커스텀 훅
 * @param categoryName 카테고리 이름 (선택적)
 * @param franchiseId 체인점 ID (선택적)
 * @param allRestaurants 전체 레스토랑 목록 조회 여부 (선택적)
 */
export const useRestaurants = (
  categoryNameOrOptions?: string | UseRestaurantsProps
) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 파라미터 처리: 문자열 또는 객체
  let options: UseRestaurantsProps = {};
  
  if (typeof categoryNameOrOptions === 'string') {
    options = { categoryName: categoryNameOrOptions };
  } else if (categoryNameOrOptions) {
    options = categoryNameOrOptions;
  }
  
  const { categoryName, franchiseId, allRestaurants } = options;
  
  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 환경 설정에서 위치 정보 가져오기
      const { lat, lng } = DEFAULT_COORDINATES;
      
      // 요청 파라미터 구성
      const params = {
        lat,
        lng
      };
      
      // 카테고리가 있는 경우, 요청 파라미터에 추가
      if (categoryName) {
        Object.assign(params, { category: decodeURIComponent(categoryName) });
      }
      
      // 체인점 ID가 있는 경우, 요청 파라미터에 추가
      if (franchiseId) {
        Object.assign(params, { franchiseId });
      }
      
      // 모든 필터링 파라미터가 없는 경우, 전체 목록 조회 (params에 카테고리 등 필터링 없음)
      
      const data = await getNearbyRestaurants(params);
      setRestaurants(data);
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError(STATUS_MESSAGES.error.restaurants);
    } finally {
      setLoading(false);
    }
  }, [categoryName, franchiseId, allRestaurants]);
  
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);
  
  return { restaurants, loading, error, refetch: fetchRestaurants };
}; 
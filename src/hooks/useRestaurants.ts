import { useState, useEffect, useCallback } from 'react';
import { getNearbyRestaurants } from '../api/restaurantService';
import { Restaurant } from '../types/restaurant';
import { DEFAULT_COORDINATES, STATUS_MESSAGES } from '../config/constants';
import { useAddress } from '../contexts/AddressContext';

interface UseRestaurantsProps {
  categoryName?: string;
  categoryId?: string;
  franchiseId?: string;
  allRestaurants?: boolean;
}

/**
 * 레스토랑 목록을 가져오는 커스텀 훅
 * @param categoryName 카테고리 이름 (선택적)
 * @param categoryId 카테고리 ID (선택적)
 * @param franchiseId 체인점 ID (선택적)
 * @param allRestaurants 전체 레스토랑 목록 조회 여부 (선택적)
 */
export const useRestaurants = (
  categoryNameOrOptions?: string | UseRestaurantsProps
) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAddress();
  
  // 파라미터 처리: 문자열 또는 객체
  let options: UseRestaurantsProps = {};
  
  if (typeof categoryNameOrOptions === 'string') {
    options = { categoryName: categoryNameOrOptions };
  } else if (categoryNameOrOptions) {
    options = categoryNameOrOptions;
  }
  
  const { categoryName, categoryId, franchiseId, allRestaurants } = options;
  
  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 주소 컨텍스트에서 좌표 정보 가져오기, 없으면 기본 좌표 사용
      const coordinates = {
        lat: address?.lat ?? DEFAULT_COORDINATES.lat,
        lng: address?.lng ?? DEFAULT_COORDINATES.lng
      };
      
      // 요청 파라미터 구성
      const params = {
        lat: coordinates.lat,
        lng: coordinates.lng
      };
      
      // 카테고리 ID가 있는 경우, 요청 파라미터에 추가 (우선순위)
      if (categoryId) {
        Object.assign(params, { categoryId });
      }
      // 호환성을 위해 카테고리 이름이 있고 ID가 없는 경우에만 category 사용
      else if (categoryName) {
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
  }, [categoryName, categoryId, franchiseId, allRestaurants, address]);
  
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);
  
  return { restaurants, loading, error, refetch: fetchRestaurants };
}; 
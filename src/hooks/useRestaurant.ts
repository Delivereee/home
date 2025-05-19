import { useState, useEffect, useCallback } from 'react';
import { getRestaurantDetails } from '../api/restaurantService';
import { Restaurant } from '../types/restaurant';
import { getStatusMessages } from '../config/constants';

/**
 * 개별 레스토랑 정보를 가져오는 커스텀 훅
 * @param restaurantId 레스토랑 ID
 */
export const useRestaurant = (restaurantId: string | number) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRestaurant = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getRestaurantDetails(String(restaurantId));
      setRestaurant(data);
    } catch (err) {
      console.error('Error fetching restaurant details:', err);
      const STATUS_MESSAGES = getStatusMessages();
      setError(STATUS_MESSAGES.error.restaurants);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);
  
  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);
  
  return { restaurant, loading, error, refetch: fetchRestaurant };
}; 
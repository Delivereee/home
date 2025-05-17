import { useState, useEffect, useCallback } from 'react';
import { getRestaurantMenus } from '../api/menuService';
import { MenuSection } from '../types/menu';
import { STATUS_MESSAGES } from '../config/constants';

/**
 * 레스토랑 메뉴 목록을 가져오는 커스텀 훅
 * @param restaurantId 레스토랑 ID
 */
export const useRestaurantMenus = (restaurantId: string | number) => {
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchMenus = useCallback(async () => {
    if (!restaurantId) {
      setError('Restaurant ID is required');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await getRestaurantMenus(restaurantId);
      
      if (Array.isArray(data) && data.length === 0) {
        console.warn(`No menu items found for restaurant ${restaurantId}`);
      }
      
      setMenuSections(data);
    } catch (err) {
      console.error('Error fetching restaurant menus:', err);
      setError(STATUS_MESSAGES.error.menus || 'Failed to load menus. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);
  
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);
  
  return { menuSections, loading, error, refetch: fetchMenus };
}; 
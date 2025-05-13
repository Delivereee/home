import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getNearbyRestaurants } from '../api/restaurantService';
import { Restaurant } from '../types/restaurant';
import { FoodCategory } from '../types/category';
import BackHeader from '../components/BackHeader';
import RestaurantItem from '../components/RestaurantItem';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const CategoryDetail: React.FC = () => {
  const { categoryName } = useParams<{ categoryId: string, categoryName: string }>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 하드코딩된 위치 정보 사용 (추후 사용자 위치로 대체 가능)
      const lat = 37.4994321012109;
      const lng = 127.043914628076;
      
      // URL에서 받은 카테고리 이름을 사용하거나 기본값 사용
      const category = categoryName || FoodCategory.FAST_FOOD;
      
      const data = await getNearbyRestaurants({
        category,
        lat,
        lng
      });
      
      setRestaurants(data);
    } catch (err) {
      console.error('Error in component:', err);
      setError('Failed to load restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [categoryName]);
  
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);
  
  // 표시할 타이틀 결정
  const displayTitle = categoryName ? `[${categoryName}]` : '[Categories / Chains Name]';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title={displayTitle} />
      
      <main className="p-4 pb-20">
        {/* 로딩 상태 */}
        {loading && <LoadingState message="Loading restaurants..." />}
        
        {/* 에러 상태 */}
        {!loading && error && <ErrorState message={error} onRetry={fetchRestaurants} />}
        
        {/* 결과 없음 */}
        {!loading && !error && restaurants.length === 0 && (
          <EmptyState message="No restaurants found for this category." />
        )}
        
        {/* 음식점 목록 */}
        {!loading && !error && restaurants.length > 0 && (
          <div>
            {restaurants.map((restaurant) => (
              <RestaurantItem key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryDetail; 
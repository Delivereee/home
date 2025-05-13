import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNearbyRestaurants } from '../api/restaurantService';
import { Restaurant } from '../types/restaurant';
import { FoodCategory } from '../types/category';
import BackHeader from '../components/BackHeader';
import RestaurantItem from '../components/RestaurantItem';

const CategoryDetail: React.FC = () => {
  const { categoryId, categoryName } = useParams<{ categoryId: string, categoryName: string }>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        
        // 하드코딩된 위치 정보 사용 (추후 사용자 위치로 대체 가능)
        const lat = 37.4994321012109;
        const lng = 127.043914628076;
        
        // URL에서 받은 카테고리 이름을 사용하거나 기본값 사용
        const category = categoryName || FoodCategory.PIZZA;
        
        const data = await getNearbyRestaurants({
          category,
          lat,
          lng
        });
        
        setRestaurants(data);
        setError(null);
      } catch (err) {
        console.error('Error in component:', err);
        setError('Failed to load restaurants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurants();
  }, [categoryId, categoryName]);
  
  // 표시할 타이틀 결정
  const displayTitle = categoryName ? `[${categoryName}]` : '[Categories / Chains Name]';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title={displayTitle} />
      
      <main className="p-4 pb-20">
        {/* 로딩 상태 */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <p>Loading restaurants...</p>
          </div>
        )}
        
        {/* 에러 상태 */}
        {!loading && error && (
          <div className="flex justify-center items-center h-64 text-red-500">
            <p>{error}</p>
          </div>
        )}
        
        {/* 결과 없음 */}
        {!loading && !error && restaurants.length === 0 && (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <p>No restaurants found for this category.</p>
          </div>
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
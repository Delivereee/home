import React from 'react';
import { useParams } from 'react-router-dom';
import BackHeader from '../components/BackHeader';
import RestaurantItem from '../components/RestaurantItem';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useRestaurants } from '../hooks/useRestaurants';
import { STATUS_MESSAGES } from '../config/constants';

const CategoryDetail: React.FC = () => {
  const { categoryName } = useParams<{ categoryId: string, categoryName: string }>();
  const { restaurants, loading, error, refetch } = useRestaurants(categoryName);
  
  // 표시할 타이틀 결정
  const displayTitle = categoryName ? `[${categoryName}]` : '[Categories / Chains Name]';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title={displayTitle} />
      
      <main className="p-4 pb-20">
        {/* 로딩 상태 */}
        {loading && <LoadingState message={STATUS_MESSAGES.loading.restaurants} />}
        
        {/* 에러 상태 */}
        {!loading && error && <ErrorState message={error} onRetry={refetch} />}
        
        {/* 결과 없음 */}
        {!loading && !error && restaurants.length === 0 && (
          <EmptyState message={STATUS_MESSAGES.empty.restaurants} />
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
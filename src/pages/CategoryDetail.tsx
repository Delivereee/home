import React, { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import BackHeader from '../components/BackHeader';
import RestaurantItem from '../components/RestaurantItem';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import NavigationBar from '../components/NavigationBar';
import { useRestaurants } from '../hooks/useRestaurants';
import { STATUS_MESSAGES } from '../config/constants';

const CategoryDetail: React.FC = () => {
  const { categoryName, chainName, chainId } = useParams<{ 
    categoryId?: string, 
    categoryName?: string,
    chainId?: string,
    chainName?: string
  }>();
  const location = useLocation();
  
  // 현재 어떤 타입의 요청인지 확인
  const isAllRestaurants = location.pathname === '/restaurants' || location.pathname === '/browse';
  
  // 검색 조건 구성
  const searchParams = useMemo(() => {
    if (isAllRestaurants) {
      return { allRestaurants: true };
    }
    
    if (chainId && chainName) {
      return { franchiseId: chainId };
    }
    
    return { categoryName };
  }, [categoryName, chainId, chainName, isAllRestaurants]);
  
  // API 요청
  const { restaurants, loading, error, refetch } = useRestaurants(searchParams);
  
  // 표시할 타이틀 결정
  const displayTitle = useMemo(() => {
    if (isAllRestaurants) {
      return 'All Restaurants Near You';
    }
    
    if (chainName) {
      return decodeURIComponent(chainName);
    }
    
    return categoryName ? decodeURIComponent(categoryName) : 'Restaurants';
  }, [categoryName, chainName, isAllRestaurants]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title={displayTitle} />
      
      <main className="p-4 pb-20">
        {/* 콘텐츠 영역: 로딩/에러/빈 결과/목록 중 하나만 표시 */}
        {loading ? (
          <LoadingState 
            message={STATUS_MESSAGES.loading.restaurants} 
            id={`category-${isAllRestaurants ? 'all-restaurants' : categoryName || 'unknown'}`}
          />
        ) : error ? (
          <ErrorState 
            message={error} 
            onRetry={refetch} 
            subtitle="We couldn't connect to our restaurant service. Please check your connection and try again."
          />
        ) : restaurants.length === 0 ? (
          <EmptyState 
            message={STATUS_MESSAGES.empty.restaurants} 
            subtitle="Try changing your location or exploring different categories."
            actionText="Refresh"
            onAction={refetch}
            hideIcon={true}
          />
        ) : (
          <div>
            <p className="text-gray-600 mb-4">
              {restaurants.length} {restaurants.length === 1 ? 'restaurant' : 'restaurants'} available
            </p>
            {restaurants.map((restaurant) => (
              <RestaurantItem key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </main>
      
      {/* 네비게이션 바 추가 */}
      <NavigationBar />
    </div>
  );
};

export default CategoryDetail; 
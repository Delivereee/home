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
  const isAllRestaurants = location.pathname === '/restaurants';
  
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
      
      {/* 네비게이션 바 추가 */}
      <NavigationBar />
    </div>
  );
};

export default CategoryDetail; 
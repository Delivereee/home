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
import { CATEGORIES } from '../types/category';

const CategoryDetail: React.FC = () => {
  const { categoryId, categoryName, chainName, chainId } = useParams<{ 
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
  
  // 카테고리ID로 영문 카테고리명 찾기
  const findCategoryEnglishName = (id?: string, decodedName?: string): string => {
    if (!id && !decodedName) return 'Restaurants';
    
    // ID로 카테고리 찾기
    if (id) {
      const category = CATEGORIES.find(cat => cat.id === id);
      if (category) return category.nameEn;
    }
    
    // 이름으로 카테고리 찾기
    if (decodedName) {
      const category = CATEGORIES.find(cat => cat.name === decodedName);
      if (category) return category.nameEn;
    }
    
    // 찾지 못한 경우 디코딩된 이름 또는 기본값 반환
    return decodedName || 'Restaurants';
  };
  
  // 표시할 타이틀 결정
  const displayTitle = useMemo(() => {
    if (isAllRestaurants) {
      return 'All Restaurants Near You';
    }
    
    if (chainName) {
      // 체인점은 그대로 표시 (영문명 이미 설정되어 있음)
      return decodeURIComponent(chainName);
    }
    
    // 카테고리인 경우 영문명 찾기
    const decodedCategoryName = categoryName ? decodeURIComponent(categoryName) : '';
    return findCategoryEnglishName(categoryId, decodedCategoryName);
    
  }, [categoryId, categoryName, chainName, isAllRestaurants]);
  
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
import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import BackHeader from '../components/BackHeader';
import RestaurantItem from '../components/RestaurantItem';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import NavigationBar from '../components/NavigationBar';
import { useRestaurants } from '../hooks/useRestaurants';
import { getCategories } from '../api/categoryService';
import { STATUS_MESSAGES } from '../config/constants';
import { Category } from '../types/category';

const CategoryDetail: React.FC = () => {
  const { categoryId, categoryName, chainName, chainId } = useParams<{ 
    categoryId?: string, 
    categoryName?: string,
    chainId?: string,
    chainName?: string
  }>();
  const location = useLocation();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // API에서 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const categories = await getCategories();
        if (categories.length > 0) {
          setAllCategories(categories);
          
          // categoryId로 현재 카테고리 찾기
          if (categoryId) {
            const category = categories.find(cat => cat.id === categoryId);
            if (category) {
              setSelectedCategory(category);
            }
          }
        }
      } catch (error) {
        console.error('카테고리 데이터를 가져오는데 실패했습니다:', error);
      }
    };
    
    fetchCategoriesData();
  }, [categoryId]);
  
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
    
    // 선택된 카테고리가 있으면 그 이름을 사용, 없으면 URL의 categoryName 사용
    if (selectedCategory) {
      return { categoryName: selectedCategory.name };
    }
    
    return { categoryName };
  }, [categoryName, chainId, chainName, isAllRestaurants, selectedCategory]);
  
  // API 요청
  const { restaurants, loading, error, refetch } = useRestaurants(searchParams);
  
  // 표시할 타이틀 결정
  const displayTitle = useMemo(() => {
    if (isAllRestaurants) {
      return 'All Restaurants Near You';
    }
    
    if (chainName) {
      // 체인점은 그대로 표시 (영문명 이미 설정되어 있음)
      return decodeURIComponent(chainName);
    }
    
    // 선택된 카테고리가 있으면 그 이름을 표시
    if (selectedCategory) {
      return selectedCategory.nameEn;
    }
    
    // ID로 카테고리 찾기
    if (categoryId) {
      const category = allCategories.find(cat => cat.id === categoryId);
      if (category) {
        return category.nameEn;
      }
    }
    
    // 카테고리명으로 찾기 (하위 호환성)
    if (categoryName) {
      const decodedName = decodeURIComponent(categoryName);
      const category = allCategories.find(cat => 
        cat.nameKo === decodedName || cat.name === decodedName
      );
      if (category) {
        return category.nameEn;
      }
      return decodedName;
    }
    
    return 'Restaurants';
  }, [categoryId, categoryName, chainName, isAllRestaurants, allCategories, selectedCategory]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title={displayTitle} />
      
      <main className="p-4 pb-20">
        {/* 콘텐츠 영역: 로딩/에러/빈 결과/목록 중 하나만 표시 */}
        {loading ? (
          <LoadingState 
            message={STATUS_MESSAGES.loading.restaurants} 
            id={`category-${isAllRestaurants ? 'all-restaurants' : categoryId || 'unknown'}`}
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
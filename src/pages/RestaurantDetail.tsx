import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurant } from '../hooks/useRestaurant';
import { useRestaurantMenus } from '../hooks/useRestaurantMenus';
import BackHeader from '../components/BackHeader';
import RestaurantItem from '../components/RestaurantItem';
import NavigationBar from '../components/NavigationBar';
import MenuSection from '../components/MenuSection';
import CartBottomSheet from '../components/CartBottomSheet';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { STATUS_MESSAGES } from '../config/constants';

const RestaurantDetail: React.FC = () => {
  const { restaurantId = '' } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  
  // 가게 정보 가져오기
  const { restaurant, loading: restaurantLoading, error: restaurantError } = useRestaurant(restaurantId);
  
  // 메뉴 정보 가져오기
  const { menuSections, loading: menuLoading, error: menuError, refetch: refetchMenus } = useRestaurantMenus(restaurantId);
  
  // 최소 주문 금액 (USD로 변환)
  const EXCHANGE_RATE = 0.00071; // 1원 = 0.00071달러
  const minOrderInUSD = useMemo(() => {
    if (!restaurant || !restaurant.minOrderAmount) return null;
    return restaurant.minOrderAmount * EXCHANGE_RATE;
  }, [restaurant]);
  
  // 영문 이름을 우선 사용하고, 없을 경우 기본 필드 사용
  const displayName = useMemo(() => {
    if (restaurantLoading || !restaurant) return '[Shop Name]';
    return restaurant.nameEn || restaurant.name;
  }, [restaurant, restaurantLoading]);
  
  // 결제 페이지로 이동
  const handleCheckout = () => {
    console.log('Navigate to checkout page');
    // navigate('/checkout');
  };
  
  // restaurantId가 없는 경우
  if (!restaurantId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Error" />
        <div className="p-4">
          <ErrorState message="Invalid restaurant ID" onRetry={() => window.location.reload()} />
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  // 로딩 중 표시
  if (restaurantLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title={displayName} />
        <div className="p-4">
          <LoadingState message={STATUS_MESSAGES.loading.restaurants} />
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  // 에러 표시
  if (restaurantError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Error" />
        <div className="p-4">
          <ErrorState message={restaurantError} onRetry={() => window.location.reload()} />
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  // 가게 정보가 없을 때
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Not Found" />
        <div className="p-4">
          <EmptyState message="Restaurant not found" />
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* GNB */}
      <BackHeader title={displayName} />
      
      <main className="p-4 pb-24">
        {/* 가게 정보 카드 */}
        <div className="mb-4">
          <RestaurantItem restaurant={restaurant} disableNavigation={true} />
        </div>
        
        {/* 구분선 */}
        <div className="border-b border-gray-200 my-4"></div>
        
        {/* 메뉴 타이틀 */}
        <h1 className="text-lg font-bold mb-4 text-left">Menu</h1>
        
        {/* 메뉴 섹션 */}
        {menuLoading ? (
          <LoadingState message={STATUS_MESSAGES.loading.menus} />
        ) : menuError ? (
          <ErrorState message={menuError} onRetry={refetchMenus} />
        ) : menuSections.length === 0 ? (
          <EmptyState message={STATUS_MESSAGES.empty.menus} />
        ) : (
          <div>
            {menuSections.map(section => (
              <MenuSection 
                key={section.id} 
                section={section} 
                restaurantId={restaurantId}
                restaurantName={displayName}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* 장바구니 바텀시트 */}
      <CartBottomSheet 
        minOrderAmount={minOrderInUSD}
        onCheckout={handleCheckout}
        restaurantId={restaurantId}
      />
      
      {/* 하단 네비게이션 바 */}
      <NavigationBar />
    </div>
  );
};

export default RestaurantDetail; 
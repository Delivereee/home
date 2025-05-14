import React from 'react';
import { Restaurant } from '../types/restaurant';

interface RestaurantItemProps {
  restaurant: Restaurant;
}

const RestaurantItem: React.FC<RestaurantItemProps> = ({ restaurant }) => {
  // 영문 이름과 설명을 우선 사용하고, 없을 경우 기본 필드 사용
  const displayName = restaurant.nameEn || restaurant.name || '[Shop Name]';
  const displayDescription = restaurant.introductionTitleEn || restaurant.introductionTitle || '[shop description]';
  
  // 환율 정보 (1원 = 0.00071달러)
  const EXCHANGE_RATE = 0.00071;
  
  // 최소 주문 금액을 달러로 변환
  const minOrderInUSD = restaurant.minOrderAmount * EXCHANGE_RATE;
  
  // 최소 주문 금액 표시 텍스트
  const minOrderText = restaurant.minOrderAmount > 0 
    ? `Minimum Order: $${minOrderInUSD.toFixed(2)}` 
    : 'No Minimum Order';

  return (
    <div className="border rounded-lg overflow-hidden mb-4 bg-white shadow-sm">
      {/* 레스토랑 이미지 */}
      <div className="h-48 overflow-hidden">
        <img 
          src={restaurant.backgroundUrl || restaurant.logoUrl} 
          alt={displayName}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 레스토랑 정보 */}
      <div className="p-4">
        {/* 가게 이름 (영문 우선) */}
        <h3 className="text-xl font-bold mb-2 text-left">{displayName}</h3>
        
        {/* 가게 설명 (영문 우선, 한 줄로 제한, 말줄임표 적용) */}
        <p className="text-gray-500 mb-4 overflow-hidden whitespace-nowrap text-ellipsis text-sm">
          {displayDescription}
        </p>
        
        {/* 하단 정보 영역 */}
        <div className="flex justify-between items-center mt-2">
          {/* 배달 시간 추정 (좌측 하단) */}
          <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
            20-30 min
          </div>
          
          {/* 최소 주문 금액 (우측 하단) - 달러로 표시 */}
          <div className="text-sm text-gray-600 text-right font-medium">
            {minOrderText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantItem; 
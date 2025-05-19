import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../types/restaurant';
import { getCurrentLanguage } from '../config/languageConfig';
import useTranslation from '../hooks/useTranslation';

interface RestaurantItemProps {
  restaurant: Restaurant;
  disableNavigation?: boolean;
}

const RestaurantItem: React.FC<RestaurantItemProps> = ({ restaurant, disableNavigation = false }) => {
  const navigate = useNavigate();
  const currentLang = getCurrentLanguage();
  const { t } = useTranslation();
  
  // 현재 언어에 맞는 이름과 설명 계산
  const { displayName, displayDescription } = useMemo(() => {
    // 기본값 설정
    let name = restaurant.name || '[Shop Name]';
    let description = restaurant.introductionTitle || '';

    // 현재 언어에 따라 적절한 필드 선택
    switch (currentLang) {
      case 'ko':
        return {
          displayName: restaurant.nameKo || name,
          displayDescription: restaurant.introductionTitleKo || description
        };
      case 'ja':
        return {
          displayName: restaurant.nameJa || name,
          displayDescription: restaurant.introductionTitleJa || description
        };
      case 'zh-CN':
        return {
          displayName: restaurant.nameZhCn || name,
          displayDescription: restaurant.introductionTitleZhCn || description
        };
      case 'zh-TW':
        return {
          displayName: restaurant.nameZhTw || name,
          displayDescription: restaurant.introductionTitleZhTw || description
        };
      case 'en':
      default:
        return {
          displayName: restaurant.nameEn || name,
          displayDescription: restaurant.introductionTitleEn || description
        };
    }
  }, [restaurant, currentLang]);
  
  // 환율 정보 (1원 = 0.00071달러)
  const EXCHANGE_RATE = 0.00071;
  
  // 최소 주문 금액을 달러로 변환
  const minOrderInUSD = restaurant.minOrderAmount * EXCHANGE_RATE;
  
  // 최소 주문 금액 표시 텍스트
  const minOrderText = restaurant.minOrderAmount > 0 
    ? `${t('restaurant.minimumOrder')}: $${minOrderInUSD.toFixed(2)}` 
    : t('restaurant.noMinimumOrder');
    
  // 가게 상세 페이지로 이동
  const handleClick = () => {
    if (disableNavigation) return;
    navigate(`/restaurant/${restaurant.id}`);
  };

  return (
    <div 
      className={`border rounded-lg overflow-hidden mb-4 bg-white shadow-sm ${!disableNavigation ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
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
        {/* 가게 이름 (현재 언어 우선) */}
        <h3 className="text-xl font-bold mb-2 text-left">{displayName}</h3>
        
        {/* 가게 설명 (현재 언어 우선, 한 줄로 제한, 말줄임표 적용) */}
        <p className="text-gray-500 mb-4 overflow-hidden whitespace-nowrap text-ellipsis text-sm">
          {displayDescription}
        </p>
        
        {/* 하단 정보 영역 */}
        <div className="flex justify-between items-center mt-2">
          {/* 배달 시간 추정 (좌측 하단) */}
          <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
            {t('restaurant.deliveryTime')}
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
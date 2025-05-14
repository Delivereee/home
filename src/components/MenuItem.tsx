import React, { useState } from 'react';
import { MenuItem as MenuItemType } from '../types/menu';
import ImageWithFallback from './ImageWithFallback';

interface MenuItemProps {
  menuItem: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ menuItem }) => {
  const [quantity, setQuantity] = useState(0);
  
  // 영문 이름과 설명을 우선 사용하고, 없을 경우 기본 필드 사용
  const displayName = menuItem.nameEn || menuItem.name || '[Menu Name]';
  const displayDescription = menuItem.descriptionEn || menuItem.description || '[menu description]';
  
  // 달러로 변환된 가격
  const EXCHANGE_RATE = 0.00071; // 1원 = 0.00071달러
  const priceInUSD = menuItem.price * EXCHANGE_RATE;
  const displayPrice = `$${priceInUSD.toFixed(2)}`;
  
  // 수량 증가
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  // 수량 감소
  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
    }
  };
  
  return (
    <div className="flex flex-col pb-6 mb-6 border-b border-gray-200">
      <div className="flex">
        {/* 메뉴 정보 */}
        <div className="flex-grow pr-4">
          <h3 className="text-lg font-semibold mb-1">{displayName}</h3>
          <p className="text-gray-500 text-sm mb-2 line-clamp-2">{displayDescription}</p>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              {/* 가격 */}
              <div className="font-semibold text-lg">
                {displayPrice}
                <span className="text-xs text-gray-500 ml-1">(per 1 piece)</span>
              </div>
              
              {/* 수량 조절 */}
              <div className="flex items-center">
                <button
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md"
                  onClick={decreaseQuantity}
                  disabled={quantity === 0}
                >
                  <span className="text-xl">−</span>
                </button>
                <span className="mx-4 text-lg">{quantity}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md"
                  onClick={increaseQuantity}
                >
                  <span className="text-xl">+</span>
                </button>
                
                {/* Add 버튼 */}
                <button
                  className={`ml-4 px-4 py-2 rounded-md ${quantity > 0 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                  disabled={quantity === 0}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 메뉴 이미지 */}
        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={menuItem.image || ''}
            alt={displayName}
            className="w-full h-full object-cover"
            fallback="https://source.unsplash.com/random/300x300/?food"
          />
        </div>
      </div>
    </div>
  );
};

export default MenuItem; 
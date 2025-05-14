import React, { useState } from 'react';
import { MenuItem as MenuItemType } from '../types/menu';
import ImageWithFallback from './ImageWithFallback';

interface MenuItemProps {
  menuItem: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ menuItem }) => {
  const [quantity, setQuantity] = useState(0);
  
  // 영문 이름과 설명을 우선 사용하고, 없을 경우 기본 필드 사용
  const displayName = menuItem.nameEn || '[Menu Name]';
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
    <div className="flex flex-col pb-4 mb-4 border-b border-gray-200">
      <div className="flex">
        {/* 메뉴 이미지 */}
        <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-4">
          <ImageWithFallback
            src={menuItem.image || ''}
            alt={displayName}
            className="w-full h-full object-cover"
            fallback="https://source.unsplash.com/random/300x300/?food"
          />
        </div>
        
        {/* 메뉴 정보 */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-1 text-left">{displayName}</h3>
              <p className="text-gray-500 text-sm mb-2 line-clamp-1 text-left">{displayDescription}</p>
            </div>
            
            {/* 메뉴 상세보기 버튼 아이콘 */}
            <div className="ml-2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </div>
          </div>
          
          {/* 가격, 수량 조절, Add 버튼 */}
          <div className="mt-2">
            <div className="flex items-center justify-between">
              {/* 가격 */}
              <div className="font-semibold text-lg flex flex-col">
                {displayPrice}
                <span className="text-xs text-gray-500">(per 1 piece)</span>
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
      </div>
    </div>
  );
};

export default MenuItem; 
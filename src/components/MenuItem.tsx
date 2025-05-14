import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem as MenuItemType } from '../types/menu';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../types/cart';
import ImageWithFallback from './ImageWithFallback';

interface MenuItemProps {
  menuItem: MenuItemType;
  restaurantId: string;
  restaurantName: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ menuItem, restaurantId, restaurantName }) => {
  const { cart, addToCart, updateItemQuantity } = useCart();
  
  // 영문 이름과 설명을 우선 사용하고, 없을 경우 기본 필드 사용
  const displayName = menuItem.nameEn || menuItem.name || '[Menu Name]';
  const displayDescription = menuItem.descriptionEn || menuItem.description || '[menu description]';
  
  // 달러로 변환된 가격
  const EXCHANGE_RATE = 0.00071; // 1원 = 0.00071달러
  const priceInUSD = menuItem.price * EXCHANGE_RATE;
  const displayPrice = `$${priceInUSD.toFixed(2)}`;
  
  // 장바구니에서 현재 아이템의 수량 찾기
  const getCartQuantity = useCallback((): number => {
    if (!cart) return 0;
    
    const cartItem = cart.items.find(item => item.id === menuItem.id);
    return cartItem ? cartItem.quantity : 0;
  }, [cart, menuItem.id]);
  
  // 현재 수량 상태 관리
  const [quantity, setQuantity] = useState<number>(getCartQuantity());
  
  // 카트 상태가 변경될 때마다 수량 동기화
  useEffect(() => {
    setQuantity(getCartQuantity());
  }, [cart, getCartQuantity]);
  
  // 수량 증가
  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartItem(newQuantity);
  };
  
  // 수량 감소
  const decreaseQuantity = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCartItem(newQuantity);
    }
  };
  
  // 장바구니 업데이트
  const updateCartItem = (newQuantity: number) => {
    if (newQuantity === 0) {
      // 수량이 0이면 아이템 제거 (updateItemQuantity에서 자동으로 처리됨)
      updateItemQuantity(menuItem.id, 0);
    } else if (quantity === 0 && newQuantity > 0) {
      // 처음 추가하는 경우
      const cartItem: CartItem = {
        id: menuItem.id,
        name: displayName,
        price: priceInUSD,
        quantity: newQuantity,
        options: [],
        image: menuItem.image
      };
      
      addToCart(restaurantId, restaurantName, cartItem);
    } else {
      // 기존 아이템 수량 업데이트
      updateItemQuantity(menuItem.id, newQuantity);
    }
  };
  
  return (
    <div className="flex flex-col pb-4 mb-4 border-b border-gray-200">
      <div className="flex">
        {/* 메뉴 이미지 */}
        <div className="w-28 h-28 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-4">
          <ImageWithFallback
            src={menuItem.image || ''}
            alt={displayName}
            className="w-full h-full object-cover"
            fallback="https://source.unsplash.com/random/300x300/?food"
          />
        </div>
        
        {/* 메뉴 정보 */}
        <div className="flex-grow flex flex-col justify-between">
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
          
          {/* 가격, 수량 조절 */}
          <div className="mt-auto">
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
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md bg-red-500 text-white"
                  onClick={increaseQuantity}
                >
                  <span className="text-xl">+</span>
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
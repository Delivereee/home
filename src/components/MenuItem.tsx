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
  const { cart, addToCart, updateItemQuantity, canceledItemId } = useCart();
  
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
    
    // 현재 표시중인 레스토랑과 카트에 저장된 레스토랑이 다르면 0 반환
    if (cart.restaurantId !== restaurantId) return 0;
    
    const cartItem = cart.items.find(item => item.id === menuItem.id);
    return cartItem ? cartItem.quantity : 0;
  }, [cart, menuItem.id, restaurantId]);
  
  // 현재 수량 상태 관리
  const [quantity, setQuantity] = useState<number>(getCartQuantity());
  
  // 카트 상태가 변경될 때마다 수량 동기화
  useEffect(() => {
    setQuantity(getCartQuantity());
  }, [cart, getCartQuantity]);
  
  // 취소된 아이템 감지하여 수량 초기화
  useEffect(() => {
    if (canceledItemId && canceledItemId === menuItem.id) {
      setQuantity(getCartQuantity());
    }
  }, [canceledItemId, menuItem.id, getCartQuantity]);
  
  // 수량 증가
  const increaseQuantity = () => {
    // 현재 카트가 다른 레스토랑의 것이면 1로 시작
    let startQuantity = quantity;
    if (cart && cart.restaurantId !== restaurantId && quantity === 0) {
      startQuantity = 0;
    }
    
    const newQuantity = startQuantity + 1;
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
    // 수량이 0이면 아이템 제거 (updateItemQuantity에서 자동으로 처리됨)
    if (newQuantity === 0) {
      updateItemQuantity(menuItem.id, 0);
    } 
    // 처음 추가하는 경우 (혹은 다른 레스토랑 카트가 있을 경우)
    else if (quantity === 0 && newQuantity > 0) {
      const cartItem: CartItem = {
        id: menuItem.id,
        name: displayName,
        price: priceInUSD,
        quantity: newQuantity,
        options: [],
        image: menuItem.image
      };
      
      addToCart(restaurantId, restaurantName, cartItem);
    } 
    // 기존 아이템 수량 업데이트 (같은 레스토랑일 경우에만)
    else if (cart && cart.restaurantId === restaurantId) {
      updateItemQuantity(menuItem.id, newQuantity);
    }
  };
  
  return (
    <div className="flex flex-col pb-4 mb-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-stretch relative">
        {/* 메뉴 이미지 */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-3 my-auto">
          <ImageWithFallback
            src={menuItem.image || ''}
            alt={displayName}
            className="w-full h-full object-cover"
            fallback="https://source.unsplash.com/random/300x300/?food"
          />
        </div>
        
        {/* 메뉴 정보 */}
        <div className="flex-grow flex flex-col justify-between py-1 pr-10">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 text-left line-clamp-1">{displayName}</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-2 line-clamp-2 text-left">{displayDescription}</p>
          </div>
          
          {/* 가격, 수량 조절 */}
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              {/* 가격 */}
              <div className="font-semibold text-base sm:text-lg flex flex-col">
                {displayPrice}
                <span className="text-xs text-gray-500">(per 1 piece)</span>
              </div>
              
              {/* 수량 조절 */}
              <div className="flex items-center">
                <button
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-md bg-white ${quantity > 0 ? 'text-gray-700' : 'text-gray-400'}`}
                  onClick={decreaseQuantity}
                  disabled={quantity === 0}
                  aria-label="Decrease quantity"
                >
                  <span className="text-lg sm:text-xl font-medium">−</span>
                </button>
                <span className="mx-2 sm:mx-3 text-base sm:text-lg font-medium min-w-[20px] text-center">{quantity}</span>
                <button
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border rounded-md ${
                    quantity > 0 
                      ? 'bg-red-500 text-white border-red-500' 
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                >
                  <span className="text-lg sm:text-xl font-medium">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 메뉴 상세보기 버튼 - Material Design 스타일 */}
        <div 
          className="absolute right-0 inset-y-0 flex items-center justify-center w-10 transition-colors hover:bg-gray-100 active:bg-gray-200 rounded-r cursor-pointer"
          role="button"
          aria-label="View menu details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MenuItem; 
import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/currencyUtils';

interface CartBottomSheetProps {
  minOrderAmount: number | null;
  onCheckout: () => void;
  restaurantId: string;
}

const CartBottomSheet: React.FC<CartBottomSheetProps> = ({ minOrderAmount, onCheckout, restaurantId }) => {
  const { 
    cart, 
    getTotalPrice, 
    getTotalItems, 
    isDeliveryAvailable, 
    getAmountToMinOrder,
    switchMessage,
    clearSwitchMessage,
    currentRestaurantId,
    setCurrentRestaurantId
  } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [showSwitchMessage, setShowSwitchMessage] = useState(false);
  
  // 현재 레스토랑 ID 업데이트
  useEffect(() => {
    setCurrentRestaurantId(restaurantId);
  }, [restaurantId, setCurrentRestaurantId]);
  
  // 카트 상태가 변경될 때마다 애니메이션 효과를 위한 상태 업데이트
  useEffect(() => {
    if (cart && cart.items.length > 0 && cart.restaurantId === restaurantId) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [cart, restaurantId]);
  
  // 전환 메시지 표시 처리
  useEffect(() => {
    if (switchMessage) {
      setShowSwitchMessage(true);
      const timer = setTimeout(() => {
        setShowSwitchMessage(false);
        clearSwitchMessage();
      }, 3000); // 3초 후 자동으로 닫힘
      return () => clearTimeout(timer);
    }
  }, [switchMessage, clearSwitchMessage]);
  
  // 카트가 비어있거나, 메시지가 없거나, 현재 레스토랑과 카트의 레스토랑이 다르면 렌더링하지 않음
  if (
    (!cart || cart.items.length === 0) && !showSwitchMessage || 
    (cart && cart.restaurantId !== restaurantId)
  ) {
    return null;
  }
  
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const deliveryAvailable = isDeliveryAvailable(minOrderAmount);
  const amountToMinOrder = getAmountToMinOrder(minOrderAmount);
  
  return (
    <div 
      className={`fixed bottom-[60px] left-0 right-0 bg-white z-20 rounded-t-xl transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ 
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* 전환 메시지 알림 */}
      {showSwitchMessage && switchMessage && (
        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 border-b border-yellow-200">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{switchMessage}</p>
            <button 
              onClick={() => {
                setShowSwitchMessage(false);
                clearSwitchMessage();
              }}
              className="text-yellow-500 hover:text-yellow-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* 카트 콘텐츠 - 현재 레스토랑과 카트의 레스토랑이 같을 때만 표시 */}
      {cart && cart.items.length > 0 && cart.restaurantId === restaurantId && (
        <div className="py-2.5 px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-shrink-0 w-2/5">
              {deliveryAvailable ? (
                <span className="text-base font-medium text-gray-800 whitespace-nowrap">Delivery Available</span>
              ) : (
                <span className="text-base font-medium text-red-500 whitespace-nowrap">Add {formatCurrency(amountToMinOrder)} more for delivery</span>
              )}
            </div>
            
            <div className="flex-grow flex justify-end w-3/5">
              <button 
                className={`max-w-[200px] ml-auto text-white py-3 px-3 rounded-lg font-semibold flex items-center justify-center ${
                  deliveryAvailable ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={onCheckout}
                disabled={!deliveryAvailable}
              >
                <div className={`rounded-full w-5 h-5 flex items-center justify-center mr-2 ${
                  deliveryAvailable ? 'bg-white text-red-500' : 'bg-white text-gray-400'
                }`}>
                  <span className="text-sm font-bold">{totalItems}</span>
                </div>
                <span className="text-lg font-semibold text-white">{formatCurrency(totalPrice)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartBottomSheet; 
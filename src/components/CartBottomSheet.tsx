import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

interface CartBottomSheetProps {
  minOrderAmount: number | null;
  onCheckout: () => void;
}

const CartBottomSheet: React.FC<CartBottomSheetProps> = ({ minOrderAmount, onCheckout }) => {
  const { cart, getTotalPrice, getTotalItems, isDeliveryAvailable, getAmountToMinOrder } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  
  // 카트 상태가 변경될 때마다 애니메이션 효과를 위한 상태 업데이트
  useEffect(() => {
    if (cart && cart.items.length > 0) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [cart]);
  
  // 카트가 비어있으면 렌더링하지 않음
  if (!cart || cart.items.length === 0) {
    return null;
  }
  
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const deliveryAvailable = isDeliveryAvailable(minOrderAmount);
  const amountToMinOrder = getAmountToMinOrder(minOrderAmount);
  
  // 가격 포맷팅 (USD)
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };
  
  return (
    <div 
      className={`fixed bottom-[60px] left-0 right-0 bg-white z-20 rounded-t-xl transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ 
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <div className="py-2.5 px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-shrink-0 w-1/3">
            <span className="text-base font-medium text-gray-800 whitespace-nowrap">Delivery Available</span>
          </div>
          
          <div className="flex-grow flex justify-end w-2/3">
            {deliveryAvailable ? (
              <button 
                className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center"
                onClick={onCheckout}
              >
                <div className="text-red-500 bg-white rounded-full w-5 h-5 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">{totalItems}</span>
                </div>
                <span className="text-lg font-semibold text-white">{formatPrice(totalPrice)}</span>
              </button>
            ) : (
              <button 
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center"
                disabled
              >
                {formatPrice(amountToMinOrder)} 더 담으면 배달 가능
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartBottomSheet; 
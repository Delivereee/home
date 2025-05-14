import React from 'react';
import { useCart } from '../contexts/CartContext';

interface CartBottomSheetProps {
  minOrderAmount: number | null;
  onCheckout: () => void;
}

const CartBottomSheet: React.FC<CartBottomSheetProps> = ({ minOrderAmount, onCheckout }) => {
  const { cart, getTotalPrice, getTotalItems, isDeliveryAvailable, getAmountToMinOrder } = useCart();
  
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
    <div className="fixed bottom-[49px] left-0 right-0 bg-white border-t border-gray-200 z-10">
      {/* 경계선 - 네비게이션 바와의 구분선 */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gray-200"></div>
      
      <div className="py-3 px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-shrink-0 min-w-[30%]">
            <span className="text-base font-medium text-gray-800 whitespace-nowrap">Delivery Available</span>
          </div>
          
          <div className="flex-grow flex justify-end">
            {deliveryAvailable ? (
              <button 
                className="min-w-[80%] bg-red-500 text-white py-3.5 px-4 rounded-lg font-semibold flex items-center justify-center shadow-md"
                onClick={onCheckout}
              >
                <div className="text-red-500 bg-white rounded-full w-5 h-5 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">{totalItems}</span>
                </div>
                <span className="text-xl font-semibold text-white">{formatPrice(totalPrice)}</span>
              </button>
            ) : (
              <button 
                className="min-w-[80%] bg-gray-300 text-gray-700 py-3.5 px-4 rounded-lg font-semibold flex items-center justify-center shadow-md"
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
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
    <div className="fixed bottom-16 left-0 right-0 bg-white border-t shadow-lg rounded-t-lg z-10">
      <div className="py-3 px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-shrink-0 min-w-[30%]">
            <span className="text-base font-medium text-gray-800 whitespace-nowrap">Delivery Available</span>
          </div>
          
          <div className="flex-grow flex justify-end">
            {deliveryAvailable ? (
              <button 
                className="min-w-[80%] bg-red-500 text-white py-3.5 px-4 rounded-md font-semibold flex items-center justify-center"
                onClick={onCheckout}
              >
                <div className="text-red-500 bg-white rounded-full w-5 h-5 flex items-center justify-center mr-3">
                  <span className="text-sm font-bold">{totalItems}</span>
                </div>
                <span className="text-xl font-semibold text-white">{formatPrice(totalPrice)}</span>
              </button>
            ) : (
              <button 
                className="min-w-[80%] bg-gray-300 text-gray-700 py-3.5 px-4 rounded-md font-semibold flex items-center justify-center"
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
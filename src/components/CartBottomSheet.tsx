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
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-black-500">Delivery Available
            </span>
          </div>
          
          {deliveryAvailable ? (
            <button 
              className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold flex items-center"
              onClick={onCheckout}
            >
             
             <div className="text-red-500 bg-white rounded-full w-5 h-5 flex items-center justify-center mr-2">
              <span>{totalItems}</span>
            </div>
              <span className="text-lg font-semibold text-white">{formatPrice(totalPrice)}</span>
            </button>
          ) : (
            <button 
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-semibold"
              disabled
            >
              {formatPrice(amountToMinOrder)} 더 담으면 배달 가능
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartBottomSheet; 
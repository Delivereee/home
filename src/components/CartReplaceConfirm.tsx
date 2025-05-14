import React from 'react';
import { useCart } from '../contexts/CartContext';

const CartReplaceConfirm: React.FC = () => {
  const { 
    showCartReplaceConfirm, 
    pendingCartItem, 
    cart, 
    confirmReplaceCart, 
    cancelReplaceCart 
  } = useCart();

  if (!showCartReplaceConfirm || !pendingCartItem || !cart) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-[90%] max-w-md overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center">
            <span className="text-yellow-500 mr-2">⚠️</span>
            <span>One restaurant per order</span>
          </h2>
        </div>
        
        <div className="px-4 py-4">
          <p className="text-gray-700 mb-6">
            You can only place one order from a single restaurant. Would you like to clear your current cart and add this item instead?
          </p>
          
          <div className="space-y-3">
            <button 
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold"
              onClick={confirmReplaceCart}
            >
              Replace Cart
            </button>
            
            <button 
              className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-semibold border border-gray-300"
              onClick={cancelReplaceCart}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartReplaceConfirm; 
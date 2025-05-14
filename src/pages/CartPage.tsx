import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import BackHeader from '../components/BackHeader';
import NavigationBar from '../components/NavigationBar';
import EmptyState from '../components/EmptyState';
import ImageWithFallback from '../components/ImageWithFallback';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeItem, 
    getTotalPrice 
  } = useCart();
  
  // 화폐 변환 상수
  const EXCHANGE_RATE = 0.00071; // 1원 = 0.00071달러
  
  // 배송비 및 수수료 (하드코딩된 값)
  const DELIVERY_FEE = 3000 * EXCHANGE_RATE; // 3,000원
  const PROXY_FEE = 1000 * EXCHANGE_RATE; // 1,000원
  
  // 소계 (카트 아이템 총액)
  const subtotal = getTotalPrice();
  
  // 총 주문 금액
  const total = subtotal + DELIVERY_FEE + PROXY_FEE;
  
  // 가격 포맷팅 (USD)
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };
  
  // 가게 상세 페이지로 이동
  const navigateToRestaurant = () => {
    if (cart && cart.restaurantId) {
      navigate(`/restaurant/${cart.restaurantId}`);
    }
  };
  
  // 메뉴 삭제
  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };
  
  // 체크아웃 진행
  const handleCheckout = () => {
    // 아직 미구현
    console.log('Proceed to checkout');
  };
  
  // 카트가 비어있을 때
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Cart" />
        <div className="p-4">
          <EmptyState message="Your cart is empty" />
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* GNB */}
      <BackHeader title="Cart" />
      
      <main className="pb-32">
        {/* 가게 정보 */}
        <div 
          className="p-4 bg-white mb-2 border-b border-gray-200 cursor-pointer"
          onClick={navigateToRestaurant}
        >
          <h2 className="text-lg font-bold text-left flex items-center">
            {cart.restaurantName}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1 text-gray-500">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </h2>
        </div>
        
        {/* 카트 아이템 목록 */}
        <div className="mb-4">
          {cart.items.map(item => (
            <div key={item.id} className="bg-white p-4 mb-1 border-b border-gray-100 flex items-center">
              {/* 메뉴 이미지 */}
              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-3 flex-shrink-0">
                <ImageWithFallback
                  src={item.image || ''}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  fallback="https://source.unsplash.com/random/300x300/?food"
                />
              </div>
              
              {/* 메뉴 정보 */}
              <div className="flex-grow">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium text-left">{item.name}</h3>
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 주문 요약 */}
        <div className="bg-white p-4 mb-4 rounded-lg">
          <h3 className="text-lg font-bold mb-4 text-left">Order Summary</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">{formatPrice(subtotal)}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-gray-600">Delivery Fee</p>
              <p className="font-medium">{formatPrice(DELIVERY_FEE)}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-gray-600">Proxy Ordering Fee</p>
              <p className="font-medium">{formatPrice(PROXY_FEE)}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <p className="font-bold">Total</p>
            <p className="font-bold">{formatPrice(total)}</p>
          </div>
        </div>
      </main>
      
      {/* 체크아웃 버튼 */}
      <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-white shadow-md">
        <button
          className="w-full py-4 rounded-lg font-bold text-white bg-red-500"
          onClick={handleCheckout}
        >
          Checkout - {formatPrice(total)}
        </button>
      </div>
      
      {/* 하단 네비게이션 바 */}
      <NavigationBar />
    </div>
  );
};

export default CartPage; 
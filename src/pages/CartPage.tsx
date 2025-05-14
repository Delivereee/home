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
    getTotalPrice,
    updateItemQuantity
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
  
  // 수량 증가
  const increaseQuantity = (itemId: string, currentQuantity: number) => {
    updateItemQuantity(itemId, currentQuantity + 1);
  };
  
  // 수량 감소
  const decreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateItemQuantity(itemId, currentQuantity - 1);
    } else {
      removeItem(itemId);
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
            <div key={item.id} className="bg-white p-4 mb-1 border-b border-gray-100">
              <div className="flex items-stretch relative">
                {/* 메뉴 이미지 */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-3 my-auto">
                  <ImageWithFallback
                    src={item.image || ''}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    fallback="https://source.unsplash.com/random/300x300/?food"
                  />
                </div>
                
                {/* 메뉴 정보 */}
                <div className="flex-grow flex flex-col justify-between py-1 pr-10">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1 text-left line-clamp-1">{item.name}</h3>
                  </div>
                  
                  {/* 가격, 수량 조절 */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      {/* 가격 */}
                      <div className="font-semibold text-base sm:text-lg flex flex-col">
                        {formatPrice(item.price)}
                        <span className="text-xs text-gray-500">(per 1 piece)</span>
                      </div>
                      
                      {/* 수량 조절 */}
                      <div className="flex items-center">
                        <button
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-700"
                          onClick={() => decreaseQuantity(item.id, item.quantity)}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <span className="text-lg sm:text-xl font-medium">−</span>
                        </button>
                        <span className="mx-2 sm:mx-3 text-base sm:text-lg font-medium min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border rounded-md bg-red-500 text-white border-red-500"
                          onClick={() => increaseQuantity(item.id, item.quantity)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <span className="text-lg sm:text-xl font-medium">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 삭제 버튼 */}
                <button
                  className="absolute right-0 top-0 p-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveItem(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
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
          Proceed to Checkout
        </button>
      </div>
      
      {/* 하단 네비게이션 바 */}
      <NavigationBar />
    </div>
  );
};

export default CartPage; 
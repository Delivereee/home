import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAddress } from '../contexts/AddressContext';
import BackHeader from '../components/BackHeader';
import NavigationBar from '../components/NavigationBar';
import EmptyState from '../components/EmptyState';
import ImageWithFallback from '../components/ImageWithFallback';
import { createCart, getCart, transformCartToRequest } from '../api/cartService';
import useTranslation from '../hooks/useTranslation';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { address, isAddressSet } = useAddress();
  const { 
    cart, 
    removeItem, 
    getTotalPrice,
    updateItemQuantity,
    getMinOrderAmount,
    isDeliveryAvailable,
    getAmountToMinOrder
  } = useCart();
  const { t } = useTranslation();
  
  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // 화폐 변환 상수
  const EXCHANGE_RATE = 0.00071; // 1원 = 0.00071달러
  
  // 배송비 및 수수료 (하드코딩된 값)
  const DELIVERY_FEE = 3000 * EXCHANGE_RATE; // 3,000원
  const PROXY_FEE = 1000 * EXCHANGE_RATE; // 1,000원
  
  // 소계 (카트 아이템 총액)
  const subtotal = getTotalPrice();
  
  // 총 주문 금액
  const total = subtotal + DELIVERY_FEE + PROXY_FEE;
  
  // 최소 주문 금액 (CartContext에서 제공)
  const minOrderAmount = getMinOrderAmount();
  
  // 최소 주문 금액 충족 여부
  const deliveryAvailable = isDeliveryAvailable(minOrderAmount);
  const amountToMinOrder = getAmountToMinOrder(minOrderAmount);
  
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
  
  // 레스토랑 브라우징 페이지로 이동
  const navigateToRestaurants = () => {
    navigate('/restaurants'); // 음식점 목록 페이지로 이동
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
  const handleCheckout = async () => {
    if (!cart || !deliveryAvailable) return;
    
    // 주소 설정 여부 확인
    if (!isAddressSet()) {
      // 주소 설정 페이지로 이동
      navigate('/address');
      return;
    }
    
    try {
      // 로딩 상태 설정
      setIsLoading(true);
      setErrorMsg(null);
      
      // 주소 ID 가져오기
      const addressId = address?.addressId || ''; // 저장된 주소 ID 또는 임시 ID 사용
      
      if (!addressId) {
        console.warn('Address ID is missing. Using temporary ID.');
      }
      
      // 1. 장바구니 생성 요청
      const cartRequest = transformCartToRequest(cart, addressId);
      const cartResponse = await createCart(cartRequest);
      
      if (!cartResponse || !cartResponse.id) {
        throw new Error(t('cart.failedToCreateCart'));
      }
      
      console.log('Cart created successfully:', cartResponse);
      
      // 2. 생성된 장바구니 정보로 주문 ID 조회
      const cartId = cartResponse.id;
      const cartDetail = await getCart(cartId);
      
      if (!cartDetail || !cartDetail.orderId) {
        throw new Error(t('cart.failedToGetOrderId'));
      }
      
      console.log('Order ID retrieved successfully:', cartDetail.orderId);
      
      // 주문 ID를 사용하여 결제 페이지로 이동
      navigate(`/checkout?orderId=${cartDetail.orderId}`);
    } catch (error) {
      // 에러 처리
      console.error('Checkout error:', error);
      setErrorMsg(error instanceof Error ? error.message : t('cart.checkoutFailed'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // 주소 설정 페이지로 이동
  const goToAddressSetup = () => {
    navigate('/address');
  };
  
  // 카트가 비어있을 때
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title={t('nav.cart')} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{t('cart.empty')}</h2>
          <p className="text-gray-500 mb-8">{t('cart.addItems')}</p>
          <button
            onClick={navigateToRestaurants}
            className="bg-red-500 text-white py-3 px-6 rounded-md font-medium hover:bg-red-600 transition-colors"
          >
            {t('cart.browseRestaurants')}
          </button>
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* GNB */}
      <BackHeader title={t('nav.cart')} />
      
      <main className="px-4 pb-36">
        {/* 가게 정보 */}
        <div 
          className="py-4 bg-white mb-4 border-b border-gray-200 cursor-pointer -mx-4 px-4"
          onClick={navigateToRestaurant}
        >
          <h2 className="text-lg font-medium text-left flex items-center text-gray-800">
            {cart.restaurantName}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1 text-gray-500">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </h2>
        </div>
        
        {/* 카트 아이템 목록 */}
        <div className="mb-6 space-y-3">
          {cart.items.map(item => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="flex items-start relative p-4 pb-4">
                {/* 메뉴 이미지 */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={item.image || ''}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    fallback="https://source.unsplash.com/random/300x300/?food"
                  />
                </div>
                
                {/* 메뉴 정보 - 간격 조정 */}
                <div className="flex-grow flex flex-col justify-between ml-4 py-1">
                  <div>
                    <h3 className="text-lg font-medium mb-1 text-left line-clamp-2 text-gray-800">{item.name}</h3>
                    <span className="text-base font-medium text-left text-gray-900 block">{formatPrice(item.price)}</span>
                    <span className="text-xs text-left text-gray-500 block">{t('cart.perPiece')}</span>
                  </div>
                </div>
                
                {/* 삭제 버튼 - 우측 상단 */}
                <button
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
                  onClick={() => handleRemoveItem(item.id)}
                  aria-label={`${t('cart.remove')} ${item.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
                
                {/* 수량 조절 - 우측 하단으로 이동 */}
                <div className="absolute bottom-4 right-4 flex items-center space-x-3">
                  <button
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full bg-white text-gray-700"
                    onClick={() => decreaseQuantity(item.id, item.quantity)}
                    aria-label={`${t('cart.decrease')} ${item.name}`}
                  >
                    <span className="text-xl font-medium">−</span>
                  </button>
                  <span className="text-lg font-medium min-w-[24px] text-center text-gray-800">{item.quantity}</span>
                  <button
                    className="w-10 h-10 flex items-center justify-center border rounded-full bg-red-500 text-white border-red-500"
                    onClick={() => increaseQuantity(item.id, item.quantity)}
                    aria-label={`${t('cart.increase')} ${item.name}`}
                  >
                    <span className="text-xl font-medium">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 주문 요약 */}
        <div className="bg-white p-5 mb-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4 text-left text-gray-800">{t('cart.orderSummary')}</h3>
          
          <div className="space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{t('cart.subtotal')}</p>
              <p className="font-medium text-gray-800">{formatPrice(subtotal)}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{t('cart.deliveryFee')}</p>
              <p className="font-medium text-gray-800">{formatPrice(DELIVERY_FEE)}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-gray-600">{t('cart.proxyFee')}</p>
              <p className="font-medium text-gray-800">{formatPrice(PROXY_FEE)}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <p className="font-medium text-lg text-gray-900">{t('cart.total')}</p>
            <p className="font-semibold text-lg text-gray-900">{formatPrice(total)}</p>
          </div>
        </div>
      </main>
      
      {/* 체크아웃 버튼 */}
      <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-white shadow-lg z-10">
        {!deliveryAvailable && (
          <div className="mb-2 text-center text-sm text-red-500 font-medium">
            {t('cart.addMore')} {formatPrice(amountToMinOrder)} {t('cart.toOrder')}
          </div>
        )}
        {errorMsg && (
          <div className="mb-2 text-center text-sm text-red-500 font-medium">
            {errorMsg}
          </div>
        )}
        {!isAddressSet() && (
          <div className="mb-3 flex flex-col items-center">
            <p className="mb-2 text-center text-sm text-red-500 font-medium">
              {t('address.requiredForCheckout')}
            </p>
            <button
              className="py-2 px-4 rounded-md bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition-colors"
              onClick={goToAddressSetup}
            >
              {t('address.setNow')}
            </button>
          </div>
        )}
        <button
          className={`w-full py-4 rounded-lg font-medium text-white text-base tracking-wide shadow-md transition-colors ${
            deliveryAvailable && !isLoading && isAddressSet()
              ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleCheckout}
          disabled={!deliveryAvailable || isLoading || !isAddressSet()}
        >
          {isLoading ? t('cart.processing') : t('cart.proceedToCheckout')}
        </button>
      </div>
      
      {/* 하단 네비게이션 바 */}
      <NavigationBar />
    </div>
  );
};

export default CartPage; 
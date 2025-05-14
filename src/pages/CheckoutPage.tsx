import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import BackHeader from '../components/BackHeader';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice } = useCart();
  
  // 이메일 상태 관리
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  
  // 배송 요청사항 상태 관리
  const [deliveryRequest, setDeliveryRequest] = useState<string | null>(null);
  
  // 약관 펼치기/접기 상태
  const [termsExpanded, setTermsExpanded] = useState(false);
  
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
  
  // 이메일 유효성 검사
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // 이메일 입력 변경 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailValid(validateEmail(newEmail));
  };
  
  // 배송 요청사항 변경 핸들러
  const handleDeliveryRequestChange = (request: string) => {
    setDeliveryRequest(request === deliveryRequest ? null : request);
  };
  
  // 카트가 비어있을 때
  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Checkout" />
      
      <main className="px-4 py-4 pb-32">
        <h1 className="text-xl font-bold text-gray-800 mb-4 text-left">Order Summary</h1>
        
        {/* 주문 정보 영역 */}
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          {/* 가게 정보 */}
          <h2 className="text-base text-gray-500 mb-3 text-left">{cart.restaurantName}</h2>
          
          {/* 메뉴 리스트 */}
          <div className="space-y-2 mb-2">
            {cart.items.map(item => (
              <div key={item.id} className="flex justify-between">
                <div className="flex items-start">
                  <span className="text-gray-600 mr-2">{item.quantity}×</span>
                  <span className="text-gray-800">{item.name}</span>
                </div>
                <span className="text-gray-800 font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 결제 요약 정보 */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="space-y-3 mb-3">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium text-gray-800">{formatPrice(subtotal)}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Delivery Fee</p>
              <p className="font-medium text-gray-800">{formatPrice(DELIVERY_FEE)}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Proxy Ordering Fee</p>
              <p className="font-medium text-gray-800">{formatPrice(PROXY_FEE)}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
            <p className="font-medium text-lg text-gray-900">Total</p>
            <p className="font-semibold text-lg text-gray-900">{formatPrice(total)}</p>
          </div>
        </div>
        
        {/* 이메일 입력 영역 */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-800 font-medium mb-2 text-left">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email address"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              email && !emailValid 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {email && !emailValid && (
            <p className="mt-1 text-sm text-red-500 text-left">Please enter a valid email address</p>
          )}
          <p className="mt-1 text-sm text-gray-500 text-left">Order confirmation will be sent to this email</p>
        </div>
        
        {/* 배송 요청사항 영역 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 text-left">Delivery Requests</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDeliveryRequestChange('Please do not ring the bell')}
              className={`p-3 border rounded-lg text-left ${
                deliveryRequest === 'Please do not ring the bell' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Please do not ring the bell
            </button>
            
            <button
              type="button"
              onClick={() => handleDeliveryRequestChange('Leave at the door')}
              className={`p-3 border rounded-lg text-left ${
                deliveryRequest === 'Leave at the door' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Leave at the door
            </button>
            
            <button
              type="button"
              onClick={() => handleDeliveryRequestChange('Call me if there\'s a problem')}
              className={`p-3 border rounded-lg text-left ${
                deliveryRequest === 'Call me if there\'s a problem' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Call me if there's a problem
            </button>
            
            <button
              type="button"
              onClick={() => handleDeliveryRequestChange('I\'m staying at Room [#]')}
              className={`p-3 border rounded-lg text-left ${
                deliveryRequest === 'I\'m staying at Room [#]' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              I'm staying at Room [#]
            </button>
            
            <button
              type="button"
              onClick={() => handleDeliveryRequestChange('Please add utensils')}
              className={`p-3 border rounded-lg text-left ${
                deliveryRequest === 'Please add utensils' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              Please add utensils
            </button>
          </div>
        </div>
        
        {/* 결제 방법 영역 (UI만) */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 text-left">Payment Method</h2>
          
          {/* 결제 수단 선택 탭 */}
          <div className="flex mb-4 border-b border-gray-300">
            <button
              type="button"
              className="flex-1 py-2 border-b-2 border-red-500 text-red-500 font-medium"
            >
              Credit Card
            </button>
            <button
              type="button"
              className="flex-1 py-2 text-gray-500"
              disabled
            >
              PayPal
            </button>
          </div>
          
          {/* 신용카드 폼 (비활성화된 UI만) */}
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="1234 5678 9012 3456"
                disabled
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="expiryDate" className="block text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="MM/YY"
                  disabled
                />
              </div>
              <div className="flex-1">
                <label htmlFor="cvv" className="block text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="123"
                  disabled
                />
              </div>
            </div>
            
            {/* 지원 카드 이미지 */}
            <div className="pt-2 flex items-center gap-2">
              <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-700 font-bold text-xs">VISA</div>
              <div className="w-12 h-8 bg-orange-100 rounded flex items-center justify-center text-orange-700 font-bold text-xs">MC</div>
              <div className="w-12 h-8 bg-green-100 rounded flex items-center justify-center text-green-700 font-bold text-xs">JCB</div>
            </div>
          </div>
        </div>
        
        {/* 결제 버튼 영역 */}
        <div className="mt-8">
          <button 
            type="button" 
            className={`w-full py-4 rounded-lg font-medium text-white text-lg tracking-wide shadow-md ${
              emailValid 
                ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!emailValid}
          >
            Pay {formatPrice(total)}
          </button>
          
          {/* 약관 영역 */}
          <div className="mt-4 text-center text-gray-500 text-sm">
            <p className="mb-2">
              By clicking Pay, 
              <button 
                type="button" 
                className="text-gray-700 font-medium inline-flex items-center ml-1"
                onClick={() => setTermsExpanded(!termsExpanded)}
              >
                you agree to our Privacy Policy and Terms
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className={`w-5 h-5 ml-1 transition-transform ${termsExpanded ? 'rotate-180' : ''}`}
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
            </p>
            
            {termsExpanded && (
              <div className="mt-3 text-left bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs leading-relaxed">
                <h3 className="font-bold mb-2 text-gray-700">Privacy Policy and Terms of Service</h3>
                <p className="mb-2">
                  <strong>1. Collection of Personal Information:</strong> We collect personal information such as your name, email address, phone number, and delivery address to process your order and provide you with a seamless food delivery experience.
                </p>
                <p className="mb-2">
                  <strong>2. Use of Information:</strong> The information we collect is used to process your orders, manage your account, provide customer support, and improve our services.
                </p>
                <p className="mb-2">
                  <strong>3. Payment Information:</strong> Your payment information is processed securely through our payment partners. We do not store your full credit card details on our servers.
                </p>
                <p className="mb-2">
                  <strong>4. Refund Policy:</strong> Refunds are processed according to our refund policy, which may vary depending on the restaurant and the circumstances of the refund request.
                </p>
                <p className="mb-2">
                  <strong>5. Delivery Terms:</strong> Delivery times are estimates and may vary depending on factors such as traffic, weather conditions, and restaurant preparation times.
                </p>
                <p>
                  By clicking "Pay," you acknowledge that you have read and agree to these terms and conditions.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage; 
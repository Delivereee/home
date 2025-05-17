import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../types/cart';
import { MenuItem as MenuItemType } from '../types/menu';
import { getMenuDetail } from '../api/menuService';
import BackHeader from '../components/BackHeader';
import NavigationBar from '../components/NavigationBar';
import CartBottomSheet from '../components/CartBottomSheet';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import ImageWithFallback from '../components/ImageWithFallback';
import { STATUS_MESSAGES } from '../config/constants';

const MenuDetail: React.FC = () => {
  const { restaurantId = '', menuId = '' } = useParams<{ restaurantId: string; menuId: string }>();
  const navigate = useNavigate();
  const { cart, addToCart, updateItemQuantity, canceledItemId } = useCart();
  
  // 메뉴 데이터 상태
  const [menuItem, setMenuItem] = useState<MenuItemType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 레스토랑 정보 상태
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [minOrderAmount, setMinOrderAmount] = useState<number | null>(null);
  
  // 수량 상태
  const [quantity, setQuantity] = useState<number>(0);
  
  // 화폐 변환 상수
  const EXCHANGE_RATE = 0.00071; // 1원 = 0.00071달러
  
  // 달러로 변환된 가격
  const priceInUSD = useMemo(() => {
    if (!menuItem) return 0;
    return menuItem.price * EXCHANGE_RATE;
  }, [menuItem]);
  
  // 표시할 이름과 설명
  const displayName = useMemo(() => {
    if (!menuItem) return '';
    return menuItem.nameEn || menuItem.name;
  }, [menuItem]);
  
  const displayDescription = useMemo(() => {
    if (!menuItem) return '';
    
    let description = menuItem.descriptionEn || menuItem.description || '';
    
    // 대괄호로 감싸진 형태인 경우 대괄호를 제거하고 안의 내용만 추출
    if (description.match(/^\[(.*)\]$/)) {
      description = description.replace(/^\[(.*)\]$/, '$1');
    }
    
    // 유효한 설명인지 확인 (빈 문자열이거나 [] 형태가 아닌 경우)
    if (!description || description.match(/^\[]$/)) {
      return '';
    }
    
    return description;
  }, [menuItem]);
  
  // 가격 포맷팅
  const displayPrice = useMemo(() => {
    return `$${priceInUSD.toFixed(2)}`;
  }, [priceInUSD]);
  
  // 총 가격 계산 (수량 × 가격)
  const totalPrice = useMemo(() => {
    return `$${(priceInUSD * quantity).toFixed(2)}`;
  }, [priceInUSD, quantity]);
  
  // 결제 페이지로 이동
  const handleCheckout = () => {
    console.log('Navigate to checkout page');
    // navigate('/checkout');
  };
  
  // 메뉴 데이터 가져오기
  useEffect(() => {
    const fetchMenuData = async () => {
      if (!restaurantId || !menuId) {
        setError('Invalid restaurant or menu ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const menuData = await getMenuDetail(restaurantId, menuId);
        
        if (!menuData) {
          setError('Menu not found');
          setLoading(false);
          return;
        }
        
        setMenuItem(menuData);
        setRestaurantName(menuData.name);
        // TODO: 레스토랑 정보에서 최소 주문 금액을 가져와야 함
        setMinOrderAmount(10000 * EXCHANGE_RATE); // 예시: 최소 주문 금액 10,000원
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu details:', err);
        setError(STATUS_MESSAGES.error.menus || 'Failed to load menu details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, [restaurantId, menuId]);
  
  // 카트에서 현재 아이템의 수량 가져오기
  useEffect(() => {
    if (!menuItem || !cart) {
      setQuantity(0);
      return;
    }
    
    if (cart.restaurantId !== restaurantId) {
      setQuantity(0);
      return;
    }
    
    const cartItem = cart.items.find(item => item.id === menuId);
    setQuantity(cartItem ? cartItem.quantity : 0);
  }, [cart, menuItem, menuId, restaurantId]);
  
  // 취소된 아이템 감지하여 수량 초기화
  useEffect(() => {
    if (canceledItemId && canceledItemId === menuId) {
      if (!cart) {
        setQuantity(0);
        return;
      }
      
      if (cart.restaurantId !== restaurantId) {
        setQuantity(0);
        return;
      }
      
      const cartItem = cart.items.find(item => item.id === menuId);
      setQuantity(cartItem ? cartItem.quantity : 0);
    }
  }, [canceledItemId, menuId, cart, restaurantId]);
  
  // 수량 증가
  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartItem(newQuantity);
  };
  
  // 수량 감소
  const decreaseQuantity = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateCartItem(newQuantity);
    }
  };
  
  // 장바구니 업데이트
  const updateCartItem = (newQuantity: number) => {
    if (!menuItem) return;
    
    if (newQuantity === 0) {
      // 수량이 0이면 아이템 제거
      updateItemQuantity(menuId, 0);
    } else if (quantity === 0 && newQuantity > 0) {
      // 처음 추가하는 경우
      const cartItem: CartItem = {
        id: menuId,
        name: displayName,
        price: priceInUSD,
        quantity: newQuantity,
        options: [],
        image: menuItem.image
      };
      
      addToCart(restaurantId, restaurantName, cartItem);
    } else {
      // 수량 업데이트
      updateItemQuantity(menuId, newQuantity);
    }
  };
  
  // 카트에 추가
  const addToCartHandler = () => {
    if (quantity === 0) {
      increaseQuantity();
    } else {
      // 카트에 추가하고 가게 상세 페이지로 이동
      updateCartItem(quantity);
      navigate(`/restaurant/${restaurantId}`);
    }
  };
  
  // 로딩 중 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Menu Item" />
        <div className="p-4">
          <LoadingState message={STATUS_MESSAGES.loading.menus} />
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  // 에러 표시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Error" />
        <div className="p-4">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  // 메뉴 정보가 없을 때
  if (!menuItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title="Not Found" />
        <div className="p-4">
          <ErrorState message="Menu item not found" onRetry={() => navigate(-1)} />
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* GNB */}
      <BackHeader title="Menu Item" />
      
      <main className="pb-24">
        {/* 메뉴 이미지 */}
        <div className="w-full aspect-video bg-gray-200 overflow-hidden">
          <ImageWithFallback
            src={menuItem.image || ''}
            alt={displayName}
            className="w-full h-full object-cover"
            fallback="https://source.unsplash.com/random/800x600/?food"
          />
        </div>
        
        {/* 메뉴 정보 */}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2 text-left">{displayName}</h1>
          <p className="text-gray-700 mb-6 text-left whitespace-pre-line">{displayDescription}</p>
          
          {/* 가격 정보 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-left mb-1">{displayPrice}</h2>
            <p className="text-sm text-gray-500 text-left">(per 1 piece)</p>
          </div>
          
          {/* 구분선 */}
          <div className="border-t border-gray-200 mb-6"></div>
          
          {/* 수량 조절 */}
          <div className="mb-8">
            <div className="flex items-center">
              <h3 className="text-lg font-medium mr-auto">Quantity</h3>
              <div className="flex items-center">
                <button
                  className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-md bg-white"
                  onClick={decreaseQuantity}
                  disabled={quantity === 0}
                  aria-label="Decrease quantity"
                >
                  <span className="text-2xl font-medium text-gray-700">−</span>
                </button>
                <span className="mx-6 text-xl font-medium min-w-[20px] text-center">{quantity}</span>
                <button
                  className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-md bg-white"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                >
                  <span className="text-2xl font-medium text-gray-700">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 주문 버튼 */}
        <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-white shadow-md">
          <button
            className="w-full py-4 rounded-lg font-bold text-white bg-red-500"
            onClick={addToCartHandler}
          >
            {quantity > 0 ? `Add to Cart - ${totalPrice}` : `Add to Cart - ${displayPrice}`}
          </button>
        </div>
      </main>
      
      {/* 바텀시트를 메뉴 상세 페이지에서는 제거 */}
      
      {/* 하단 네비게이션 바 */}
      <NavigationBar />
    </div>
  );
};

export default MenuDetail; 
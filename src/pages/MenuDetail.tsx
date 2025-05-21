import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MenuItem as MenuItemType, MenuOption } from '../types/menu';
import { CartItem, CartOption, CartOptionItem } from '../types/cart';
import { getMenuDetail } from '../api/menuService';
import { useCart } from '../contexts/CartContext';
import BackHeader from '../components/BackHeader';
import NavigationBar from '../components/NavigationBar';
import ImageWithFallback from '../components/ImageWithFallback';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getStatusMessages } from '../config/constants';
import useTranslation from '../hooks/useTranslation';
import { formatCurrency } from '../utils/currencyUtils';

// 메뉴 옵션을 장바구니 옵션으로 변환하는 함수
const convertMenuOptionToCartOption = (menuOption: MenuOption): CartOption => {
  const optionItems: CartOptionItem[] = menuOption.menuOptionItems.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price // 서버에서 환율 계산된 금액
  }));

  return {
    id: menuOption.id,
    name: menuOption.name,
    price: 0, // 옵션 자체 가격은 0으로 설정
    optionItems: optionItems
  };
};

const MenuDetail: React.FC = () => {
  const { restaurantId = '', menuId = '' } = useParams<{ restaurantId: string; menuId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { 
    cart, 
    addToCart, 
    updateItemQuantity, 
    canceledItemId
  } = useCart();
  
  // 다국어 상태 메시지 가져오기
  const STATUS_MESSAGES = getStatusMessages();
  
  // 메뉴 데이터 상태
  const [menuItem, setMenuItem] = useState<MenuItemType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 레스토랑 정보 상태
  const [restaurantName, setRestaurantName] = useState<string>('');
  const [minOrderAmount, setMinOrderAmount] = useState<number | null>(null);
  
  // 수량 상태
  const [quantity, setQuantity] = useState<number>(0);
  
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
  
  // 총 가격 계산 (수량 × 가격)
  const totalPrice = useMemo(() => {
    if (!menuItem) return formatCurrency(0);
    return formatCurrency(menuItem.price * quantity);
  }, [menuItem, quantity]);
  
  // 결제 페이지로 이동
  const handleCheckout = () => {
    console.log('Navigate to checkout page');
    // navigate('/checkout');
  };
  
  // 메뉴 데이터 가져오기
  useEffect(() => {
    const fetchMenuData = async () => {
      if (!restaurantId || !menuId) {
        setError(t('menu.invalidId'));
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const menuData = await getMenuDetail(restaurantId, menuId);
        
        if (!menuData) {
          setError(t('menu.notFound'));
          setLoading(false);
          return;
        }
        
        setMenuItem(menuData);
        setRestaurantName(menuData.name);
        // TODO: 레스토랑 정보에서 최소 주문 금액을 가져와야 함
        setMinOrderAmount(10000); // 예시: 최소 주문 금액 10,000원
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu details:', err);
        setError(STATUS_MESSAGES.error.menus || t('menu.fetchFailed'));
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, [restaurantId, menuId, t]);
  
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
      
      // 메뉴 옵션을 장바구니 옵션으로 변환
      const cartOptions: CartOption[] = menuItem.menuOptions.map(option => 
        convertMenuOptionToCartOption(option)
      );
      
      const cartItem: CartItem = {
        id: menuId,
        name: displayName,
        price: menuItem.price,
        quantity: newQuantity,
        options: cartOptions,
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
        <BackHeader title={t('menu.item')} />
        <div className="p-4">
          <LoadingState message={STATUS_MESSAGES.loading.menus} />
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  // 에러 표시
  if (error || !menuItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BackHeader title={t('error.title')} />
        <div className="p-4">
          <ErrorState 
            message={error || t('menu.notFound')} 
            onRetry={() => navigate(`/restaurant/${restaurantId}`)}
          />
        </div>
        <NavigationBar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* GNB */}
      <BackHeader title={t('menu.item')} />
      
      <main className="bg-white pb-28">
        {/* 메뉴 이미지 */}
        <div className="w-full h-64 bg-gray-200 overflow-hidden">
          <ImageWithFallback
            src={menuItem.image || ''}
            alt={displayName}
            className="w-full h-full object-cover"
            fallback="https://source.unsplash.com/random/800x600/?food"
          />
        </div>
        
        {/* 메뉴 정보 */}
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-2 text-left">{displayName}</h1>
          
          {displayDescription && (
            <p className="text-gray-600 mb-6 text-left text-base">{displayDescription}</p>
          )}
          
          <div className="text-left mb-4">
            <span className="text-xl font-bold text-gray-900">{formatCurrency(menuItem.price)}</span>
          </div>
          
          {/* 수량 조절 */}
          <div className="flex items-center justify-between my-6">
            <span className="text-lg font-medium text-gray-800">{t('menu.quantity')}</span>
            <div className="flex items-center">
              <button
                className={`w-10 h-10 flex items-center justify-center border rounded-md ${
                  quantity > 0 ? 'text-gray-700 border-gray-300' : 'text-gray-400 border-gray-200'
                }`}
                onClick={decreaseQuantity}
                disabled={quantity === 0}
                aria-label={t('menu.decrease')}
              >
                <span className="text-2xl">−</span>
              </button>
              <span className="mx-4 text-xl font-medium min-w-[30px] text-center">{quantity}</span>
              <button
                className="w-10 h-10 flex items-center justify-center border rounded-md bg-red-500 text-white border-red-500"
                onClick={increaseQuantity}
                aria-label={t('menu.increase')}
              >
                <span className="text-2xl">+</span>
              </button>
            </div>
          </div>
          
          {/* 총 가격 */}
          <div className="flex justify-between items-center my-6 pt-4 border-t border-gray-100">
            <span className="text-lg font-semibold text-gray-800">{t('menu.total')}</span>
            <span className="text-2xl font-bold text-red-500">{totalPrice}</span>
          </div>
        </div>
      </main>
      
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex shadow-lg">
        <button 
          className={`w-full py-3 rounded-md font-semibold text-base ${
            quantity > 0 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={addToCartHandler}
        >
          {quantity > 0 
            ? `${t('menu.addToCart')} (${totalPrice})`
            : t('menu.addToCart')
          }
        </button>
      </div>
      
      <NavigationBar />
    </div>
  );
};

export default MenuDetail; 
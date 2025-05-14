import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { Cart, CartItem } from '../types/cart';

// 카트 액션 타입 정의
type CartAction = 
  | { type: 'ADD_ITEM'; payload: { restaurantId: string; restaurantName: string; item: CartItem } }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'REPLACE_CART'; payload: { restaurantId: string; restaurantName: string; item: CartItem } };

// 카트 컨텍스트 타입 정의
interface CartContextType {
  cart: Cart | null;
  currentRestaurantId: string | null;
  setCurrentRestaurantId: (id: string | null) => void;
  showCartReplaceConfirm: boolean;
  pendingCartItem: { restaurantId: string; restaurantName: string; item: CartItem } | null;
  canceledItemId: string | null;
  restaurantMinOrderAmount: number | null;
  setRestaurantMinOrderAmount: (amount: number | null) => void;
  addToCart: (restaurantId: string, restaurantName: string, item: CartItem) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getMinOrderAmount: () => number | null;
  isDeliveryAvailable: (minOrderAmount: number | null) => boolean;
  getAmountToMinOrder: (minOrderAmount: number | null) => number;
  switchMessage: string | null;
  clearSwitchMessage: () => void;
  confirmReplaceCart: () => void;
  cancelReplaceCart: () => void;
  clearCanceledItem: () => void;
}

// 초기 카트 상태
const initialCart: Cart | null = null;

// 로컬 스토리지에서 카트 데이터 로드
const loadCartFromStorage = (): Cart | null => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : null;
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return null;
  }
};

// 카트 리듀서 함수
const cartReducer = (state: Cart | null, action: CartAction): Cart | null => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { restaurantId, restaurantName, item } = action.payload;
      
      // 카트가 비어있는 경우 - 새 카트 생성
      if (!state) {
        return {
          restaurantId,
          restaurantName,
          items: [item],
        };
      }
      
      // 다른 레스토랑의 메뉴를 추가하려는 경우는 컨텍스트에서 처리하므로 여기서는 무시
      if (state.restaurantId !== restaurantId) {
        return state;
      }
      
      // 이미 카트에 있는 아이템인지 확인
      const existingItemIndex = state.items.findIndex(
        existingItem => existingItem.id === item.id
      );
      
      if (existingItemIndex >= 0) {
        // 이미 있는 아이템이면 수량만 업데이트
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };
        
        return {
          ...state,
          items: updatedItems,
        };
      }
      
      // 새 아이템 추가
      return {
        ...state,
        items: [...state.items, item],
      };
    }
    
    case 'REPLACE_CART': {
      const { restaurantId, restaurantName, item } = action.payload;
      
      // 새 카트로 완전히 교체
      return {
        restaurantId,
        restaurantName,
        items: [item],
      };
    }
    
    case 'UPDATE_ITEM_QUANTITY': {
      if (!state) return null;
      
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // 수량이 0 이하면 아이템 제거
        const updatedItems = state.items.filter(item => item.id !== itemId);
        
        // 카트에 아이템이 없으면 null 반환
        if (updatedItems.length === 0) {
          return null;
        }
        
        return {
          ...state,
          items: updatedItems,
        };
      }
      
      // 수량 업데이트
      const updatedItems = state.items.map(item => 
        item.id === itemId
          ? { ...item, quantity }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
      };
    }
    
    case 'REMOVE_ITEM': {
      if (!state) return null;
      
      const { itemId } = action.payload;
      
      const updatedItems = state.items.filter(item => item.id !== itemId);
      
      // 카트에 아이템이 없으면 null 반환
      if (updatedItems.length === 0) {
        return null;
      }
      
      return {
        ...state,
        items: updatedItems,
      };
    }
    
    case 'CLEAR_CART':
      return null;
      
    default:
      return state;
  }
};

// 카트 컨텍스트 생성
const CartContext = createContext<CartContextType | undefined>(undefined);

// 카트 프로바이더 컴포넌트
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, null, loadCartFromStorage);
  const [switchMessage, setSwitchMessage] = useState<string | null>(null);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);
  const [showCartReplaceConfirm, setShowCartReplaceConfirm] = useState<boolean>(false);
  const [pendingCartItem, setPendingCartItem] = useState<{ restaurantId: string; restaurantName: string; item: CartItem } | null>(null);
  const [canceledItemId, setCanceledItemId] = useState<string | null>(null);
  const [restaurantMinOrderAmount, setRestaurantMinOrderAmount] = useState<number | null>(null);
  
  // 초기 마운트 시에 로컬 스토리지에서 불러온 cart와 currentRestaurantId를 동기화
  useEffect(() => {
    if (cart) {
      setCurrentRestaurantId(cart.restaurantId);
    } else {
      setCurrentRestaurantId(null);
    }
  }, []); // 최초 마운트 시에만 실행
  
  // 카트 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
      // 카트가 비어있을 때 관련 상태 초기화
      setCurrentRestaurantId(null);
      setRestaurantMinOrderAmount(null);
    }
  }, [cart]);
  
  // 카트에 아이템 추가
  const addToCart = (restaurantId: string, restaurantName: string, item: CartItem) => {
    // 카트가 명확히 비어있거나, 같은 레스토랑의 아이템인 경우
    if (cart === null || (cart && cart.restaurantId === restaurantId)) {
      dispatch({
        type: 'ADD_ITEM',
        payload: { restaurantId, restaurantName, item },
      });
    } else {
      // 다른 레스토랑의 메뉴를 추가하려는 경우 - 확인 팝업 표시
      setPendingCartItem({ restaurantId, restaurantName, item });
      setShowCartReplaceConfirm(true);
    }
  };
  
  // 카트 교체 확인
  const confirmReplaceCart = () => {
    if (pendingCartItem) {
      const { restaurantId, restaurantName, item } = pendingCartItem;
      dispatch({
        type: 'REPLACE_CART',
        payload: { restaurantId, restaurantName, item },
      });
      
      // 교체 확인 후 메시지 설정
      setSwitchMessage(`Switched to ${restaurantName}. Your previous cart has been replaced.`);
      
      // 상태 초기화
      setShowCartReplaceConfirm(false);
      setPendingCartItem(null);
    }
  };
  
  // 카트 교체 취소
  const cancelReplaceCart = () => {
    // 취소된 아이템 ID 설정
    if (pendingCartItem) {
      setCanceledItemId(pendingCartItem.item.id);

      // 잠시 후 취소된 아이템 ID 초기화 (컴포넌트가 반응할 시간 제공)
      setTimeout(() => {
        setCanceledItemId(null);
      }, 100);
    }
    
    setShowCartReplaceConfirm(false);
    setPendingCartItem(null);
  };
  
  // 취소된 아이템 초기화
  const clearCanceledItem = () => {
    setCanceledItemId(null);
  };
  
  // 전환 메시지 초기화
  const clearSwitchMessage = () => {
    setSwitchMessage(null);
  };
  
  // 아이템 수량 업데이트
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      // 수량이 0 이하면 아이템 제거 처리
      removeItem(itemId);
      return;
    }
    
    dispatch({
      type: 'UPDATE_ITEM_QUANTITY',
      payload: { itemId, quantity },
    });
  };
  
  // 아이템 제거
  const removeItem = (itemId: string) => {
    // 마지막 아이템을 제거하는 경우 현재 레스토랑 ID도 초기화하기 위해
    // cart 아이템 수 확인
    if (cart && cart.items.length === 1) {
      setCurrentRestaurantId(null);
    }
    
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { itemId },
    });
  };
  
  // 카트 비우기
  const clearCart = () => {
    setSwitchMessage(null);
    setCurrentRestaurantId(null); // 카트를 비울 때 현재 레스토랑 ID도 초기화
    setRestaurantMinOrderAmount(null); // 카트를 비울 때 최소 주문 금액도 초기화
    dispatch({ type: 'CLEAR_CART' });
  };
  
  // 총 가격 계산
  const getTotalPrice = (): number => {
    if (!cart) return 0;
    
    return cart.items.reduce((total, item) => {
      // 아이템 기본 가격
      const itemTotal = item.price * item.quantity;
      
      // 옵션 가격 계산
      const optionsTotal = item.options.reduce((optTotal, option) => {
        const optionItemsTotal = option.optionItems.reduce(
          (itemTotal, optItem) => itemTotal + optItem.price,
          0
        );
        return optTotal + option.price + optionItemsTotal;
      }, 0) * item.quantity;
      
      return total + itemTotal + optionsTotal;
    }, 0);
  };
  
  // 총 아이템 수량 계산
  const getTotalItems = (): number => {
    if (!cart) return 0;
    
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };
  
  // 최소 주문 금액 가져오기 (USD로 변환)
  const getMinOrderAmount = (): number | null => {
    // 저장된 레스토랑의 최소 주문 금액 반환
    return restaurantMinOrderAmount;
  };
  
  // 배달 가능 여부 확인
  const isDeliveryAvailable = (minOrderAmount: number | null): boolean => {
    if (minOrderAmount === null) return true; // 최소 주문 금액이 없으면 배달 가능
    
    // 부동소수점 비교를 위한 작은 오차(epsilon) 허용 - 반올림 오류 방지
    const epsilon = 0.01; // 1센트 이내의 차이는 허용
    const totalPrice = getTotalPrice();
    
    return totalPrice + epsilon >= minOrderAmount;
  };
  
  // 최소 주문 금액까지 남은 금액 계산
  const getAmountToMinOrder = (minOrderAmount: number | null): number => {
    if (minOrderAmount === null) return 0;
    
    const totalPrice = getTotalPrice();
    // 반올림 오류 방지를 위한 작은 오차(epsilon) 허용
    const epsilon = 0.01; // 1센트 이내의 차이는 허용
    
    // 이미 최소 주문 금액에 도달했거나 매우 근접한 경우
    if (totalPrice + epsilon >= minOrderAmount) {
      return 0;
    }
    
    return minOrderAmount - totalPrice;
  };
  
  // 컨텍스트 값
  const contextValue: CartContextType = {
    cart,
    currentRestaurantId,
    setCurrentRestaurantId,
    showCartReplaceConfirm,
    pendingCartItem,
    canceledItemId,
    restaurantMinOrderAmount,
    setRestaurantMinOrderAmount,
    addToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getMinOrderAmount,
    isDeliveryAvailable,
    getAmountToMinOrder,
    switchMessage,
    clearSwitchMessage,
    confirmReplaceCart,
    cancelReplaceCart,
    clearCanceledItem
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// 카트 컨텍스트 훅
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '../types/cart';

// 카트 액션 타입 정의
type CartAction = 
  | { type: 'ADD_ITEM'; payload: { restaurantId: string; restaurantName: string; item: CartItem } }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'CLEAR_CART' };

// 카트 컨텍스트 타입 정의
interface CartContextType {
  cart: Cart | null;
  addToCart: (restaurantId: string, restaurantName: string, item: CartItem) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getMinOrderAmount: () => number | null;
  isDeliveryAvailable: (minOrderAmount: number | null) => boolean;
  getAmountToMinOrder: (minOrderAmount: number | null) => number;
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
      
      // 카트가 비어있거나 다른 레스토랑의 메뉴를 추가하려는 경우 새 카트 생성
      if (!state || state.restaurantId !== restaurantId) {
        return {
          restaurantId,
          restaurantName,
          items: [item],
        };
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
    
    case 'UPDATE_ITEM_QUANTITY': {
      if (!state) return null;
      
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // 수량이 0 이하면 아이템 제거
        return {
          ...state,
          items: state.items.filter(item => item.id !== itemId),
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
  
  // 카트 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);
  
  // 카트에 아이템 추가
  const addToCart = (restaurantId: string, restaurantName: string, item: CartItem) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { restaurantId, restaurantName, item },
    });
  };
  
  // 아이템 수량 업데이트
  const updateItemQuantity = (itemId: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_ITEM_QUANTITY',
      payload: { itemId, quantity },
    });
  };
  
  // 아이템 제거
  const removeItem = (itemId: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { itemId },
    });
  };
  
  // 카트 비우기
  const clearCart = () => {
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
    // 실제로는 레스토랑 API에서 가져오거나 전달받아야 함
    // 임시 로직: null 반환 (최소 주문 금액 없음)
    return null;
  };
  
  // 배달 가능 여부 확인
  const isDeliveryAvailable = (minOrderAmount: number | null): boolean => {
    if (minOrderAmount === null) return true; // 최소 주문 금액이 없으면 배달 가능
    return getTotalPrice() >= minOrderAmount;
  };
  
  // 최소 주문 금액까지 남은 금액 계산
  const getAmountToMinOrder = (minOrderAmount: number | null): number => {
    if (minOrderAmount === null) return 0;
    const totalPrice = getTotalPrice();
    return totalPrice >= minOrderAmount ? 0 : minOrderAmount - totalPrice;
  };
  
  // 컨텍스트 값
  const contextValue: CartContextType = {
    cart,
    addToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getMinOrderAmount,
    isDeliveryAvailable,
    getAmountToMinOrder,
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
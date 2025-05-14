/**
 * 장바구니 옵션 아이템 인터페이스
 */
export interface CartOptionItem {
  id: string;
  name: string;
  price: number;
}

/**
 * 장바구니 옵션 인터페이스
 */
export interface CartOption {
  id: string;
  name: string;
  price: number;
  optionItems: CartOptionItem[];
}

/**
 * 장바구니 아이템 인터페이스
 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options: CartOption[];
  image?: string | null;
}

/**
 * 장바구니 인터페이스
 */
export interface Cart {
  memberId?: string;
  addressId?: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
} 
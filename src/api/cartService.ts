import apiClient from './config';
import { handleApiError, logApiResponse } from './utils';
import { Cart } from '../types/cart';

// 장바구니 생성 인터페이스
export interface CreateCartRequest {
  addressId: string;
  deeFranchiseStoreId: string;
  restaurantName: string;
  languageCode: string;
  items: {
    franchiseMenuId: string;
    name: string;
    price: number;
    quantity: number;
    options?: {
      franchiseMenuOptionId: string;
      name: string;
      price: number;
    }[];
  }[];
}

// 장바구니 응답 인터페이스
export interface CartResponse {
  id: string;
  memberId: string | null;
  addressId: string;
  orderNote: string | null;
  restaurant: {
    id: number;
    name: string;
  };
  items: {
    id?: number;
    menuId: number;
    name: string;
    price: number;
    quantity: number;
    options: {
      id?: number;
      optionId: number;
      name: string;
      price: number;
      optionItems: {
        id?: number;
        optionItemId: number;
        name: string;
        price: number;
      }[];
    }[];
    itemTotalPrice: number;
  }[];
  totalPrice: number;
  orderId: string | null;
  createdDate: string;
  updatedDate: string;
}

/**
 * 로컬 장바구니 아이템을 API 요청 형식으로 변환
 */
export const transformCartToRequest = (
  cart: Cart,
  addressId: string,
  languageCode: string = 'KO'
): CreateCartRequest => {
  return {
    addressId,
    deeFranchiseStoreId: cart.restaurantId,
    restaurantName: cart.restaurantName,
    languageCode,
    items: cart.items.map(item => ({
      franchiseMenuId: item.id,
      name: item.name,
      price: Math.round(item.price / 0.00071), // USD에서 원화로 변환 (1원 = 0.00071달러)
      quantity: item.quantity,
      options: item.options.map(option => ({
        franchiseMenuOptionId: option.id,
        name: option.name,
        price: Math.round(option.price / 0.00071), // USD에서 원화로 변환
      }))
    }))
  };
};

/**
 * 장바구니 생성 API
 * @param cartData 장바구니 생성 요청 데이터
 * @returns 생성된 장바구니 정보
 */
export const createCart = async (cartData: CreateCartRequest): Promise<CartResponse> => {
  try {
    const response = await apiClient.post<CartResponse>('/api/carts', cartData);
    logApiResponse('createCart', response.data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * 장바구니 조회 API
 * @param cartId 장바구니 ID
 * @returns 장바구니 정보
 */
export const getCart = async (cartId: string): Promise<CartResponse> => {
  try {
    const response = await apiClient.get<CartResponse>(`/api/carts/${cartId}`);
    logApiResponse('getCart', response.data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 
import apiClient from './config';
import { handleApiError, logApiResponse } from './utils';

// 배송 주소 생성 요청 인터페이스
export interface CreateAddressRequest {
  address: string;
  detail_address: string;
  lat: string;
  lng: string;
}

// 배송 주소 응답 인터페이스
export interface AddressResponse {
  id: string;
  address: string;
  detailAddress: string;
  lat: number;
  lng: number;
  addressKr?: string;
  detailAddressKr?: string;
  createdDate: string;
  updatedDate: string;
}

/**
 * 배송 주소 생성 API
 * @param addressData 배송 주소 생성 요청 데이터
 * @returns 생성된 배송 주소 정보
 */
export const createAddress = async (addressData: CreateAddressRequest): Promise<AddressResponse> => {
  try {
    const response = await apiClient.post<AddressResponse>('/api/delivery-addresses', addressData);
    logApiResponse('createAddress', response.data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * 배송 주소 조회 API
 * @param addressId 배송 주소 ID
 * @returns 배송 주소 정보
 */
export const getAddress = async (addressId: string): Promise<AddressResponse> => {
  try {
    const response = await apiClient.get<AddressResponse>(`/api/delivery-addresses/${addressId}`);
    logApiResponse('getAddress', response.data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * 배송 주소 목록 조회 API
 * @returns 배송 주소 목록
 */
export const getAddresses = async (): Promise<AddressResponse[]> => {
  try {
    const response = await apiClient.get<AddressResponse[]>('/api/delivery-addresses');
    logApiResponse('getAddresses', response.data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 
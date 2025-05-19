import apiClient from './config';
import { handleApiError, logApiResponse, buildQueryString } from './utils';
import { getCurrentLanguage, SupportedLanguage } from '../config/languageConfig';
import { createCacheKey, getCacheData, setCacheData } from './cacheUtils';

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
  detail_address: string;
  lat: string;
  lng: string;
  created_at: string;
  updated_at: string;
}

/**
 * 배송 주소 생성 API
 * @param data 배송 주소 생성 요청 데이터
 * @returns 생성된 배송 주소 정보
 */
export const createAddress = async (data: CreateAddressRequest): Promise<AddressResponse> => {
  try {
    // 현재 설정된 언어 추가
    const currentLang = getCurrentLanguage();
    const queryString = buildQueryString({ lang: currentLang });
    
    const response = await apiClient.post<AddressResponse>(`/api/delivery-addresses${queryString}`, data);
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
    // 현재 설정된 언어 가져오기
    const currentLang = getCurrentLanguage();
    
    // 엔드포인트 및 파라미터
    const endpoint = `/api/delivery-addresses/${addressId}`;
    const params = { lang: currentLang };
    
    // 캐시 키 생성
    const cacheKey = createCacheKey(endpoint, params);
    
    // 캐시된 데이터 확인
    const cachedData = getCacheData<AddressResponse>(cacheKey, currentLang);
    if (cachedData) {
      return cachedData;
    }
    
    // 쿼리 파라미터 생성
    const queryString = buildQueryString(params);
    
    const response = await apiClient.get<AddressResponse>(`${endpoint}${queryString}`);
    logApiResponse('getAddress', response.data);
    
    // 응답 데이터 캐싱
    setCacheData(cacheKey, response.data, currentLang);
    
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
    // 현재 설정된 언어 가져오기
    const currentLang = getCurrentLanguage();
    
    // 엔드포인트 및 파라미터
    const endpoint = '/api/delivery-addresses';
    const params = { lang: currentLang };
    
    // 캐시 키 생성
    const cacheKey = createCacheKey(endpoint, params);
    
    // 캐시된 데이터 확인
    const cachedData = getCacheData<AddressResponse[]>(cacheKey, currentLang);
    if (cachedData) {
      return cachedData;
    }
    
    // 쿼리 파라미터 생성
    const queryString = buildQueryString(params);
    
    const response = await apiClient.get<AddressResponse[]>(`${endpoint}${queryString}`);
    logApiResponse('getAddresses', response.data);
    
    // 응답 데이터 캐싱
    setCacheData(cacheKey, response.data, currentLang);
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 
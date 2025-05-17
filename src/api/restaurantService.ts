import apiClient from './config';
import { Restaurant, RestaurantSearchParams } from '../types/restaurant';
import { buildQueryString, handleApiError, logApiResponse } from './utils';

/**
 * 근처 음식점 조회
 * @param params 검색 파라미터 (위도, 경도, 카테고리, 체인점ID 등)
 * @returns 음식점 목록
 */
export const getNearbyRestaurants = async (params: RestaurantSearchParams): Promise<Restaurant[]> => {
  const endpoint = '/api/v1/stores';
  
  try {
    const queryString = buildQueryString({
      lat: params.lat,
      lng: params.lng,
      category: params.category,
      franchiseId: params.franchiseId,
      lang: params.lang || 'en'
    });
    
    console.log(`API 요청: ${endpoint}${queryString}`);
    const response = await apiClient.get(`${endpoint}${queryString}`);
    console.log('API 응답 원본 데이터:', response.data);
    
    // 응답이 빈 배열인 경우에도 그대로 반환
    if (Array.isArray(response.data) && response.data.length === 0) {
      console.log('API에서 빈 배열 응답을 받았습니다. 빈 목록을 반환합니다.');
      return [];
    }
    
    logApiResponse(endpoint, response.data);
    
    // API 응답을 Restaurant 인터페이스에 맞게 변환
    return convertApiResponseToRestaurants(response.data);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error fetching nearby restaurants: ${apiError.message}`, apiError);
    
    // 에러 발생 시 빈 배열 반환 (샘플 데이터 대신)
    console.error('API 요청 실패. 빈 배열을 반환합니다.');
    return [];
  }
};

/**
 * API 응답을 Restaurant 인터페이스에 맞게 변환
 * @param apiResponse API 응답 데이터
 * @returns Restaurant 배열
 */
const convertApiResponseToRestaurants = (apiResponse: any[]): Restaurant[] => {
  console.log('Converting API response to Restaurant objects:', apiResponse);
  
  if (!Array.isArray(apiResponse)) {
    console.error('API 응답이 배열 형식이 아닙니다:', apiResponse);
    throw new Error('API 응답이 배열 형식이 아닙니다');
  }
  
  try {
    return apiResponse.map(item => {
      // 필수 필드 검증
      if (!item.id) {
        console.warn('아이템에 id 필드가 없습니다:', item);
      }
      
      return {
        id: item.id || '',
        restaurantId: parseInt(item.id) || 0,
        name: item.name || '',
        nameEn: item.name || null,
        nameJa: null,
        nameZhCn: null,
        nameZhTw: null,
        phone: item.phone || '',
        serviceCenterNumber: item.phone || '',
        address: item.address || '',
        addressEn: item.address || null,
        addressJa: null,
        addressZhCn: null,
        addressZhTw: null,
        lat: item.lat || 0,
        lng: item.lng || 0,
        logoUrl: item.logoUrl || '',
        backgroundUrl: item.backgroundUrl || '',
        introductionTitle: item.description || '',
        introductionTitleEn: item.description || null,
        introductionTitleJa: null,
        introductionTitleZhCn: null,
        introductionTitleZhTw: null,
        reviewAvg: 0,
        reviewCount: 0,
        distance: item.distance || 0,
        isOpen: item.isOpen !== undefined ? item.isOpen : true,
        minOrderAmount: item.minOrderAmount || 0,
        categories: item.categories || [],
        servingType: 'delivery',
        hasTranslation: false
      };
    });
  } catch (error) {
    console.error('Error converting API response:', error);
    throw error;
  }
};

/**
 * 음식점 상세 정보 조회
 * @param id 음식점 ID
 * @returns 음식점 상세 정보
 */
export const getRestaurantDetails = async (id: string): Promise<Restaurant> => {
  const endpoint = `/api/v1/stores/${id}`;
  
  try {
    const response = await apiClient.get(endpoint);
    logApiResponse(endpoint, response.data);
    
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error fetching restaurant details: ${apiError.message}`, apiError);
    
    // 에러를 던져서 상위 컴포넌트에서 처리하도록 함
    throw new Error(`Failed to load restaurant details: ${apiError.message}`);
  }
}; 
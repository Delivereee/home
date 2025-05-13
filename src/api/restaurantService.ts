import apiClient from './config';
import { Restaurant, RestaurantSearchParams } from '../types/restaurant';
import { buildQueryString, handleApiError, logApiResponse } from './utils';

/**
 * 카테고리별 근처 음식점 조회
 * @param params 검색 파라미터 (카테고리, 위도, 경도)
 * @returns 음식점 목록
 */
export const getNearbyRestaurants = async (params: RestaurantSearchParams): Promise<Restaurant[]> => {
  // 배포 환경에서는 즉시 샘플 데이터 반환
  if (process.env.NODE_ENV !== 'development') {
    console.info('Production environment: using sample restaurant data');
    return getSampleRestaurants();
  }

  const endpoint = '/api/restaurant-details/nearby';
  
  try {
    const queryString = buildQueryString({
      lat: params.lat,
      lng: params.lng,
      category: params.category,
      lang: params.lang || 'en'
    });
    
    const response = await apiClient.get(`${endpoint}${queryString}`);
    logApiResponse(endpoint, response.data);
    
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error fetching nearby restaurants: ${apiError.message}`, apiError);
    
    // 에러 발생 시 샘플 데이터 반환
    console.info('Using sample restaurant data');
    return getSampleRestaurants();
  }
};

/**
 * 음식점 상세 정보 조회
 * @param id 음식점 ID
 * @returns 음식점 상세 정보
 */
export const getRestaurantDetails = async (id: string): Promise<Restaurant> => {
  // 배포 환경에서는 즉시 샘플 데이터 반환
  if (process.env.NODE_ENV !== 'development') {
    console.info('Production environment: using sample restaurant data');
    const samples = getSampleRestaurants();
    return samples.find(r => r.id === id) || samples[0];
  }

  const endpoint = `/api/restaurant-details/${id}`;
  
  try {
    const response = await apiClient.get(endpoint);
    logApiResponse(endpoint, response.data);
    
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error fetching restaurant details: ${apiError.message}`, apiError);
    
    // 에러 발생 시 샘플 데이터 반환
    console.info('Using sample restaurant data');
    const samples = getSampleRestaurants();
    return samples.find(r => r.id === id) || samples[0];
  }
};

/**
 * 샘플 음식점 데이터 (API 호출 실패 시 사용)
 */
const getSampleRestaurants = (): Restaurant[] => {
  return [
    {
      "id": "WIySQB3n",
      "restaurantId": 1082519,
      "name": "번쩍피자-강남점",
      "nameEn": null,
      "nameJa": null,
      "nameZhCn": null,
      "nameZhTw": null,
      "phone": "050372623793",
      "serviceCenterNumber": "1661-5270",
      "address": "서울특별시 강남구 역삼동 730-4 지상1층 102호",
      "addressEn": null,
      "addressJa": null,
      "addressZhCn": null,
      "addressZhTw": null,
      "lat": 37.4994325486862,
      "lng": 127.043914450039,
      "logoUrl": "https://rev-static.yogiyo.co.kr/restaurant_logos/20230524171053185852_20220412153032589854_업체자체_20220412_1082519_번쩍피자-강남점_대표사진_300x300.jpg",
      "backgroundUrl": "https://rev-static.yogiyo.co.kr/public/franchise/background/20240424101206_13bc178e12adda2f03bc717e0e65292b_tn.jpg",
      "introductionTitle": "📢리뷰이벤트 참여 방법📢",
      "introductionTitleEn": null,
      "introductionTitleJa": null,
      "introductionTitleZhCn": null,
      "introductionTitleZhTw": null,
      "reviewAvg": 4.91920238249385,
      "reviewCount": 7723,
      "distance": 5.0E-5,
      "isOpen": false,
      "minOrderAmount": 0,
      "categories": [
        "치킨",
        "피자양식",
        "테이크아웃",
        "프랜차이즈",
        "야식"
      ],
      "servingType": null,
      "hasTranslation": false
    },
    {
      "id": "KJhTdR4m",
      "restaurantId": 1082523,
      "name": "김스키친-강남점",
      "nameEn": "Kim's Kitchen",
      "nameJa": null,
      "nameZhCn": null,
      "nameZhTw": null,
      "phone": "050372635793",
      "serviceCenterNumber": "1661-5271",
      "address": "서울특별시 강남구 역삼동 825-4 지상1층",
      "addressEn": null,
      "addressJa": null,
      "addressZhCn": null,
      "addressZhTw": null,
      "lat": 37.4995325486862,
      "lng": 127.043914450039,
      "logoUrl": "https://source.unsplash.com/random/300x300/?korean-food",
      "backgroundUrl": "https://source.unsplash.com/random/800x400/?korean-restaurant",
      "introductionTitle": "정통 한식의 맛을 느껴보세요",
      "introductionTitleEn": "Experience authentic Korean taste",
      "introductionTitleJa": null,
      "introductionTitleZhCn": null,
      "introductionTitleZhTw": null,
      "reviewAvg": 4.8,
      "reviewCount": 5280,
      "distance": 1.2E-4,
      "isOpen": true,
      "minOrderAmount": 10000,
      "categories": [
        "한식",
        "비빔밥",
        "김치찌개",
        "프랜차이즈"
      ],
      "servingType": "delivery",
      "hasTranslation": true
    }
  ];
}; 
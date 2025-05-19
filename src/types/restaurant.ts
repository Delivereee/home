/**
 * 음식점 정보 인터페이스
 */
export interface Restaurant {
  // 기본 식별 정보
  id: string;
  restaurantId: number;
  
  // 기본 정보
  name: string;
  address: string;
  phone: string;
  serviceCenterNumber: string;
  lat: number;
  lng: number;
  logoUrl: string;
  backgroundUrl: string;
  introductionTitle: string;
  
  // 평가 정보
  reviewAvg: number;
  reviewCount: number;
  
  // 운영 정보
  distance: number;
  isOpen: boolean;
  minOrderAmount: number;
  categories: string[];
  servingType: string | null;
  
  // 다국어 정보
  nameEn: string | null;
  nameJa: string | null;
  nameZhCn: string | null;
  nameZhTw: string | null;
  addressEn: string | null;
  addressJa: string | null;
  addressZhCn: string | null;
  addressZhTw: string | null;
  introductionTitleEn: string | null;
  introductionTitleJa: string | null;
  introductionTitleZhCn: string | null;
  introductionTitleZhTw: string | null;
  
  // 기타
  hasTranslation: boolean;
}

/**
 * 레스토랑 조회 파라미터
 */
export interface RestaurantSearchParams {
  // 검색 조건 (카테고리, 체인점 ID)
  category?: string;  // 이전 버전 호환성을 위해 유지
  categoryId?: string; // 새로운 API 파라미터
  franchiseId?: string;
  
  // 위치 정보 (필수)
  lat: number;
  lng: number;
  
  // 언어 설정 (선택)
  lang?: string;
}

/**
 * 레스토랑 검색 결과
 */
export interface RestaurantSearchResult {
  items: Restaurant[];
  totalCount: number;
  hasMore: boolean;
} 
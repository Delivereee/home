// 기본 음식점 정보 인터페이스 (필수 필드만 포함)
export interface RestaurantBase {
  id: string;
  restaurantId: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  logoUrl: string;
  reviewAvg: number;
  reviewCount: number;
  isOpen: boolean;
  minOrderAmount: number;
  categories: string[];
}

// 다국어 지원 필드
export interface Translatable {
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
}

// 추가 상세 정보 필드
export interface RestaurantDetails {
  phone: string;
  serviceCenterNumber: string;
  backgroundUrl: string;
  introductionTitle: string;
  distance: number;
  servingType: string | null;
  hasTranslation: boolean;
}

// 전체 Restaurant 타입 (구성 요소를 조합)
export type Restaurant = RestaurantBase & Translatable & RestaurantDetails;

// 카테고리별 레스토랑 조회 파라미터
export interface RestaurantSearchParams {
  category: string;
  lat: number;
  lng: number;
  lang?: string;
}

// 레스토랑 검색 결과
export interface RestaurantSearchResult {
  items: Restaurant[];
  totalCount: number;
  hasMore: boolean;
} 
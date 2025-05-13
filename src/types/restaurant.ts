// 음식점 정보 인터페이스
export interface Restaurant {
  id: string;
  restaurantId: number;
  name: string;
  nameEn: string | null;
  nameJa: string | null;
  nameZhCn: string | null;
  nameZhTw: string | null;
  phone: string;
  serviceCenterNumber: string;
  address: string;
  addressEn: string | null;
  addressJa: string | null;
  addressZhCn: string | null;
  addressZhTw: string | null;
  lat: number;
  lng: number;
  logoUrl: string;
  backgroundUrl: string;
  introductionTitle: string;
  introductionTitleEn: string | null;
  introductionTitleJa: string | null;
  introductionTitleZhCn: string | null;
  introductionTitleZhTw: string | null;
  reviewAvg: number;
  reviewCount: number;
  distance: number;
  isOpen: boolean;
  minOrderAmount: number;
  categories: string[];
  servingType: string | null;
  hasTranslation: boolean;
}

// 카테고리별 레스토랑 조회 파라미터
export interface RestaurantSearchParams {
  category: string;
  lat: number;
  lng: number;
  lang?: string;
} 
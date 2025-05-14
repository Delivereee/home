/**
 * 메뉴 옵션 아이템 인터페이스
 */
export interface MenuOptionItem {
  id: string;
  name: string;
  slug: string;
  sourceId: number;
  price: number;
  description: string;
  soldout: boolean;
  isDeposit: boolean;
  depositPrice: number;
  depositDescription: string;
}

/**
 * 메뉴 옵션 인터페이스
 */
export interface MenuOption {
  id: string;
  name: string;
  slug: string;
  sourceId: number;
  mandatory: boolean;
  multiple: boolean;
  multipleCount: number;
  isAvailableQuantity: boolean;
  menuOptionItems: MenuOptionItem[];
}

/**
 * 메뉴 아이템 인터페이스
 */
export interface MenuItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  description: string;
  image: string | null;
  originalImage: string | null;
  slug: string;
  sourceId: number;
  reviewCount: number;
  soldout: boolean;
  oneDish: boolean;
  menuOptions: MenuOption[];
  
  // 다국어 지원을 위한 필드
  nameEn?: string | null;
  descriptionEn?: string | null;
}

/**
 * 메뉴 섹션 인터페이스
 */
export interface MenuSection {
  id: string;
  name: string;
  image: string | null;
  msType: string | null;
  slug: string;
  sourceId: number;
  menuItems: MenuItem[];
  
  // 다국어 지원을 위한 필드
  nameEn?: string | null;
}

/**
 * 메뉴 검색 응답 인터페이스
 */
export interface MenuResponse {
  sections: MenuSection[];
} 
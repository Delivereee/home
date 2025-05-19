import apiClient from './config';
import { MenuSection, MenuResponse, MenuItem } from '../types/menu';
import { buildQueryString, handleApiError, logApiResponse } from './utils';
import { getCurrentLanguage } from '../config/languageConfig';

/**
 * 가게의 메뉴 목록 조회
 * @param restaurantId 가게 ID
 * @param lang 언어 설정 (기본값: 현재 설정된 언어)
 * @returns 메뉴 섹션 목록
 */
export const getRestaurantMenus = async (
  restaurantId: string | number,
  lang?: string
): Promise<MenuSection[]> => {
  const endpoint = `/api/v1/stores/${restaurantId}/menus`;
  const currentLang = lang || getCurrentLanguage();
  
  try {
    // 언어 설정 쿼리 파라미터 추가
    const queryString = buildQueryString({ lang: currentLang });
    const response = await apiClient.get(`${endpoint}${queryString}`);
    logApiResponse(endpoint, response.data);
    
    // API 응답을 애플리케이션 데이터 구조로 변환
    return transformMenuData(response.data);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error fetching restaurant menus: ${apiError.message}`, apiError);
    
    // 에러 발생 시 빈 배열 반환
    return [];
  }
};

/**
 * 메뉴 상세 정보 조회
 * @param restaurantId 가게 ID
 * @param menuId 메뉴 ID
 * @param lang 언어 설정 (기본값: 현재 설정된 언어)
 * @returns 메뉴 상세 정보
 */
export const getMenuDetail = async (
  restaurantId: string | number,
  menuId: string | number,
  lang?: string
): Promise<MenuItem | null> => {
  const endpoint = `/api/v1/stores/${restaurantId}/menus/${menuId}`;
  const currentLang = lang || getCurrentLanguage();
  
  try {
    // 언어 설정 쿼리 파라미터 추가
    const queryString = buildQueryString({ lang: currentLang });
    const response = await apiClient.get(`${endpoint}${queryString}`);
    logApiResponse(endpoint, response.data);
    
    // API 응답을 애플리케이션 데이터 구조로 변환
    return transformMenuItemData(response.data);
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error fetching menu detail: ${apiError.message}`, apiError);
    
    // 에러 발생 시 null 반환
    return null;
  }
};

/**
 * API 응답 데이터를 애플리케이션에서 사용하는 MenuItem 형식으로 변환
 * @param apiMenuItem API에서 반환된 메뉴 아이템 데이터
 * @returns 변환된 MenuItem 객체
 */
function transformMenuItemData(apiMenuItem: any): MenuItem {
  if (!apiMenuItem || typeof apiMenuItem !== 'object') {
    throw new Error('Invalid menu item data');
  }
  
  // 옵션 변환
  const options = Array.isArray(apiMenuItem.options) ? apiMenuItem.options.map((opt: { id: string; name: string; description?: string }) => ({
    id: opt.id,
    name: opt.name,
    slug: opt.id,
    sourceId: 0,
    mandatory: false,
    multiple: false,
    multipleCount: 1,
    isAvailableQuantity: false,
    menuOptionItems: [{
      id: opt.id,
      name: opt.name,
      slug: opt.id,
      sourceId: 0,
      price: 0,
      description: opt.description || '',
      soldout: false,
      isDeposit: false,
      depositPrice: 0,
      depositDescription: ''
    }]
  })) : [];
  
  // 메뉴 아이템 변환
  return {
    id: apiMenuItem.id,
    name: apiMenuItem.name,
    subtitle: "",
    price: apiMenuItem.price || 0,
    description: apiMenuItem.description || "",
    image: apiMenuItem.image || null,
    originalImage: apiMenuItem.image || null,
    slug: apiMenuItem.id,
    sourceId: 0,
    reviewCount: 0,
    soldout: false,
    oneDish: false,
    menuOptions: options,
    nameEn: apiMenuItem.nameEn || apiMenuItem.name, // 영문 이름이 없는 경우 기본 이름 사용
    descriptionEn: apiMenuItem.descriptionEn || apiMenuItem.description // 영문 설명이 없는 경우 기본 설명 사용
  };
}

/**
 * API 응답 데이터를 애플리케이션에서 사용하는 MenuSection 형식으로 변환
 * @param apiMenus API에서 반환된 메뉴 데이터
 * @returns 변환된 MenuSection 배열
 */
function transformMenuData(apiMenus: any[]): MenuSection[] {
  if (!Array.isArray(apiMenus) || apiMenus.length === 0) {
    return [];
  }
  
  // 메뉴 타입별로 그룹화
  const menusByType: Record<string, MenuItem[]> = {};
  
  // API 응답의 각 메뉴 아이템을 변환하여 타입별로 그룹화
  apiMenus.forEach(item => {
    const menuType = item.type || 'Other';
    
    if (!menusByType[menuType]) {
      menusByType[menuType] = [];
    }
    
    // 옵션 변환
    const options = Array.isArray(item.options) ? item.options.map((opt: { id: string; name: string; description?: string }) => ({
      id: opt.id,
      name: opt.name,
      slug: opt.id,
      sourceId: 0,
      mandatory: false,
      multiple: false,
      multipleCount: 1,
      isAvailableQuantity: false,
      menuOptionItems: [{
        id: opt.id,
        name: opt.name,
        slug: opt.id,
        sourceId: 0,
        price: 0,
        description: opt.description || '',
        soldout: false,
        isDeposit: false,
        depositPrice: 0,
        depositDescription: ''
      }]
    })) : [];
    
    // 메뉴 아이템 변환
    const menuItem: MenuItem = {
      id: item.id,
      name: item.name,
      subtitle: "",
      price: item.price || 0,
      description: item.description || "",
      image: item.image || null,
      originalImage: item.image || null,
      slug: item.id,
      sourceId: 0,
      reviewCount: 0,
      soldout: false,
      oneDish: false,
      menuOptions: options,
      nameEn: item.nameEn || item.name, // 영문 이름이 없는 경우 기본 이름 사용
      descriptionEn: item.descriptionEn || item.description // 영문 설명이 없는 경우 기본 설명 사용
    };
    
    menusByType[menuType].push(menuItem);
  });
  
  // 그룹화된 메뉴를 MenuSection 배열로 변환
  const menuSections: MenuSection[] = Object.entries(menusByType).map(([type, items], index) => ({
    id: `section-${index}`,
    name: type,
    nameEn: type,
    image: null,
    msType: null,
    slug: type.toLowerCase().replace(/\s+/g, '-'),
    sourceId: index,
    menuItems: items
  }));
  
  return menuSections;
} 
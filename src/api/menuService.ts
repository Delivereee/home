import apiClient from './config';
import { MenuSection, MenuResponse, MenuItem } from '../types/menu';
import { buildQueryString, handleApiError, logApiResponse } from './utils';

/**
 * 가게의 메뉴 목록 조회
 * @param restaurantId 가게 ID
 * @param lang 언어 설정 (기본값: 'en')
 * @returns 메뉴 섹션 목록
 */
export const getRestaurantMenus = async (
  restaurantId: string | number,
  lang: string = 'en'
): Promise<MenuSection[]> => {
  const endpoint = `/api/v1/stores/${restaurantId}/menus`;
  
  try {
    const response = await apiClient.get(endpoint);
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
      nameEn: item.name, // API에 영문 이름이 없는 경우 기본 이름 사용
      descriptionEn: item.description // API에 영문 설명이 없는 경우 기본 설명 사용
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

/**
 * 샘플 메뉴 데이터 (API 호출 실패 시 사용)
 */
const getSampleMenus = (): MenuSection[] => {
  return [
    {
      id: "3ajLAXZJ",
      name: "인기 메뉴",
      nameEn: "Top 10",
      image: null,
      msType: null,
      slug: "top_items",
      sourceId: 0,
      menuItems: [
        {
          id: "chmKL5mi",
          name: "리얼페페로니",
          nameEn: "Real Pepperoni",
          subtitle: "",
          price: 18900,
          description: "고메밀크도우와 짭조름한 페페로니의 만남. 매일 맥주와 함께 생각나는 피자",
          descriptionEn: "Gourmet milk dough with savory pepperoni. Pizza that goes perfectly with beer.",
          image: "https://images.yogiyo.co.kr/image/yogiyo/PARTNER_FR_IMG/%EC%B2%AD%EB%85%84%ED%94%BC%EC%9E%90/2024-07-09/%EC%A0%9C%ED%9C%B4FR_20240709_%EC%B2%AD%EB%85%84%ED%94%BC%EC%9E%90_%EB%A6%AC%EC%96%BC%ED%8E%98%ED%8E%98%EB%A1%9C%EB%8B%88_1080x640.jpg?width=384&height=273&quality=100",
          originalImage: "https://images.yogiyo.co.kr/image/yogiyo/PARTNER_FR_IMG/%EC%B2%AD%EB%85%84%ED%94%BC%EC%9E%90/2024-07-09/%EC%A0%9C%ED%9C%B4FR_20240709_%EC%B2%AD%EB%85%84%ED%94%BC%EC%9E%90_%EB%A6%AC%EC%96%BC%ED%8E%98%ED%8E%98%EB%A1%9C%EB%8B%88_1080x640.jpg?width=1080&height=640&quality=70",
          slug: "catalogyo_menu_item-11598550-1112282824",
          sourceId: 1112282824,
          reviewCount: 7,
          soldout: false,
          oneDish: false,
          menuOptions: []
        },
        {
          id: "chmKL5m2",
          name: "하와이안 피자",
          nameEn: "Hawaiian Pizza",
          subtitle: "",
          price: 19900,
          description: "달콤한 파인애플과 짭조름한 햄의 환상적인 조합",
          descriptionEn: "Sweet pineapple and savory ham in a perfect combination",
          image: "https://source.unsplash.com/random/384x273/?hawaiian-pizza",
          originalImage: "https://source.unsplash.com/random/1080x640/?hawaiian-pizza",
          slug: "catalogyo_menu_item-11598550-1112282825",
          sourceId: 1112282825,
          reviewCount: 12,
          soldout: false,
          oneDish: false,
          menuOptions: []
        }
      ]
    },
    {
      id: "3ajLAXZ2",
      name: "사이드 메뉴",
      nameEn: "Side Dishes",
      image: null,
      msType: null,
      slug: "side_dishes",
      sourceId: 1,
      menuItems: [
        {
          id: "chmKL5m3",
          name: "갈릭 브레드",
          nameEn: "Garlic Bread",
          subtitle: "",
          price: 5900,
          description: "바삭한 빵에 마늘 버터를 발라 구운 갈릭 브레드",
          descriptionEn: "Crispy bread with garlic butter",
          image: "https://source.unsplash.com/random/384x273/?garlic-bread",
          originalImage: "https://source.unsplash.com/random/1080x640/?garlic-bread",
          slug: "catalogyo_menu_item-11598550-1112282826",
          sourceId: 1112282826,
          reviewCount: 5,
          soldout: false,
          oneDish: false,
          menuOptions: []
        },
        {
          id: "chmKL5m4",
          name: "콜라",
          nameEn: "Cola",
          subtitle: "",
          price: 2000,
          description: "시원한 콜라",
          descriptionEn: "Refreshing Cola",
          image: "https://source.unsplash.com/random/384x273/?cola",
          originalImage: "https://source.unsplash.com/random/1080x640/?cola",
          slug: "catalogyo_menu_item-11598550-1112282827",
          sourceId: 1112282827,
          reviewCount: 3,
          soldout: false,
          oneDish: false,
          menuOptions: []
        }
      ]
    }
  ];
}; 
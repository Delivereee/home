import apiClient from './config';
import { MenuSection, MenuResponse } from '../types/menu';
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
  // 개발 환경이 아니면 샘플 데이터 반환
  if (process.env.NODE_ENV !== 'development') {
    console.info('Production environment: using sample menu data');
    return getSampleMenus();
  }

  const endpoint = `/api/restaurants/${restaurantId}/menu`;
  
  try {
    const queryString = buildQueryString({ lang });
    const response = await apiClient.get(`${endpoint}${queryString}`);
    logApiResponse(endpoint, response.data);
    
    // API 응답에서 섹션 배열 반환
    return response.data.sections || response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error fetching restaurant menus: ${apiError.message}`, apiError);
    
    // 에러 발생 시 샘플 데이터 반환
    console.info('Using sample menu data');
    return getSampleMenus();
  }
};

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
// 애플리케이션 전반에서 사용되는 상수 값들

// 기본 위치 좌표 (서울 강남)
export const DEFAULT_COORDINATES = {
  lat: 37.4994321012109,
  lng: 127.043914628076
};

// API 요청 시 사용되는 기본 값
export const API_DEFAULTS = {
  language: 'en',
  resultsPerPage: 20
};

// 상태 메시지
export const STATUS_MESSAGES = {
  loading: {
    categories: 'Loading categories...',
    restaurants: 'Loading restaurants...',
    chains: 'Loading popular chains...',
    menus: 'Loading menus...'
  },
  error: {
    categories: 'Failed to load categories. Please try again later.',
    restaurants: 'Failed to load restaurants. Please try again later.',
    chains: 'Failed to load popular chains. Please try again later.',
    menus: 'Failed to load menus. Please try again later.',
    default: 'Something went wrong. Please try again later.'
  },
  empty: {
    restaurants: 'No restaurants found for this category.',
    chains: 'No popular chains found.',
    menus: 'No menus available for this restaurant.'
  }
}; 
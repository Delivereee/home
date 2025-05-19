// 애플리케이션 전반에서 사용되는 상수 값들

// 기본 위치 좌표 (서울 강남)
export const DEFAULT_COORDINATES = {
  lat: 37.5766360049561,
  lng: 126.972771931513
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
    restaurants: 'Finding restaurants near you...',
    chains: 'Loading popular restaurants...',
    menus: 'Loading menu options...'
  },
  error: {
    categories: 'We had trouble loading categories. Please try again.',
    restaurants: 'We couldn\'t load restaurants at this time. Please try again.',
    chains: 'We couldn\'t load popular restaurants at this time. Please try again.',
    menus: 'We couldn\'t load the menu at this time. Please try again.',
    default: 'Something went wrong. Please try again.',
    network: 'Network connection issue. Please check your internet connection.'
  },
  empty: {
    restaurants: 'No restaurants found in this area.',
    chains: 'No popular restaurants available at this time.',
    menus: 'This restaurant has no available menu items.'
  }
}; 
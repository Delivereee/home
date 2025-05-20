// 애플리케이션 전반에서 사용되는 상수 값들
import { t } from './translations';

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

/**
 * 다국어 상태 메시지를 반환하는 함수
 * 현재 설정된 언어에 맞는 상태 메시지를 반환합니다.
 * @returns 다국어 상태 메시지 객체
 */
export const getStatusMessages = () => ({
  loading: {
    categories: t('status.loading.categories'),
    restaurants: t('status.loading.restaurants'),
    chains: t('status.loading.chains'),
    menus: t('status.loading.menus')
  },
  error: {
    categories: t('status.error.categories'),
    restaurants: t('status.error.restaurants'),
    chains: t('status.error.chains'),
    menus: t('status.error.menus'),
    default: t('status.error.default'),
    network: t('status.error.network')
  },
  empty: {
    restaurants: t('status.empty.restaurants'),
    chains: t('status.empty.chains'),
    menus: t('status.empty.menus'),
    categories: t('status.empty.categories')
  }
}); 
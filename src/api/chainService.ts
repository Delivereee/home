import { Chain, SAMPLE_CHAINS } from '../types/chain';
import apiClient from './config';
import { getCurrentLanguage } from '../config/languageConfig';
import { buildQueryString } from './utils';
import { createCacheKey, getCacheData, setCacheData } from './cacheUtils';

/**
 * 인기 체인점 목록 가져오기
 * @returns 체인점 목록
 */
export const getPopularChains = async (): Promise<Chain[]> => {
  try {
    // 현재 설정된 언어 가져오기
    const currentLang = getCurrentLanguage();
    
    // 쿼리 파라미터와 엔드포인트
    const endpoint = '/api/dee-franchises/popular';
    const params = { lang: currentLang };
    
    // 캐시 키 생성
    const cacheKey = createCacheKey(endpoint, params);
    
    // 캐시된 데이터 확인
    const cachedData = getCacheData<Chain[]>(cacheKey, currentLang);
    if (cachedData) {
      return cachedData;
    }
    
    // 쿼리 파라미터 생성
    const queryString = buildQueryString(params);
    
    // API 요청에 언어 파라미터 추가
    const response = await apiClient.get(`${endpoint}${queryString}`);
    console.log(`인기 체인점 요청: ${endpoint}${queryString}`);
    
    // 응답 데이터 캐싱
    const chains = response.data;
    setCacheData(cacheKey, chains, currentLang);
    
    return chains;
  } catch (error) {
    console.error('인기 체인점 가져오기 실패:', error);
    // API 실패 시 샘플 데이터로 폴백
    return SAMPLE_CHAINS;
  }
}; 
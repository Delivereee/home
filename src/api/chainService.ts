import { Chain, SAMPLE_CHAINS } from '../types/chain';
import apiClient from './config';
import { getCurrentLanguage } from '../config/languageConfig';
import { buildQueryString } from './utils';

/**
 * 인기 체인점 목록 가져오기
 * @returns 체인점 목록
 */
export const getPopularChains = async (): Promise<Chain[]> => {
  try {
    // 현재 설정된 언어 가져오기
    const currentLang = getCurrentLanguage();
    
    // 쿼리 파라미터 생성
    const queryString = buildQueryString({ lang: currentLang });
    
    // API 요청에 언어 파라미터 추가
    const response = await apiClient.get(`/api/dee-franchises/popular${queryString}`);
    console.log(`인기 체인점 요청: /api/dee-franchises/popular${queryString}`);
    return response.data;
  } catch (error) {
    console.error('인기 체인점 가져오기 실패:', error);
    // API 실패 시 샘플 데이터로 폴백
    return SAMPLE_CHAINS;
  }
}; 
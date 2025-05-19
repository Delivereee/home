import { Chain, SAMPLE_CHAINS } from '../types/chain';
import apiClient from './config';

/**
 * 인기 체인점 목록 가져오기
 * @returns 체인점 목록
 */
export const getPopularChains = async (): Promise<Chain[]> => {
  try {
    const response = await apiClient.get('/api/dee-franchises/popular');
    return response.data;
  } catch (error) {
    console.error('인기 체인점 가져오기 실패:', error);
    // API 실패 시 샘플 데이터로 폴백
    return SAMPLE_CHAINS;
  }
}; 
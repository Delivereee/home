import apiClient from './config';
import { Chain, SAMPLE_CHAINS } from '../types/chain';
import { handleApiError, logApiResponse } from './utils';

/**
 * 인기 체인점 목록 가져오기
 * @returns 체인점 목록
 */
export const getPopularChains = async (): Promise<Chain[]> => {
  const endpoint = '/chains/popular';
  
  try {
    const response = await apiClient.get(endpoint);
    logApiResponse(endpoint, response.data);
    
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    console.error(`Error fetching popular chains: ${apiError.message}`, apiError);
    
    // 개발 환경에서는 샘플 데이터 반환
    if (process.env.NODE_ENV === 'development') {
      console.info('Using sample data for popular chains');
      return SAMPLE_CHAINS;
    }
    
    throw apiError;
  }
}; 
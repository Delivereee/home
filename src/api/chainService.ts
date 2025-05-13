import { Chain, SAMPLE_CHAINS } from '../types/chain';

/**
 * 인기 체인점 목록 가져오기
 * @returns 체인점 목록
 */
export const getPopularChains = async (): Promise<Chain[]> => {
  // 항상 미리 정의된 체인점 데이터 사용
  return SAMPLE_CHAINS;
}; 
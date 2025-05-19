import apiClient from './config';
import { Category } from '../types/category';

/**
 * 이미지 경로를 환경에 맞게 변환하는 함수
 * @param relativePath 상대 경로
 * @returns 완전한 이미지 URL
 */
const getCategoryImageUrl = (relativePath: string): string => {
  if (process.env.NODE_ENV === 'development') {
    return `${process.env.PUBLIC_URL}${relativePath}`;
  }
  // GitHub Pages 배포 경로
  return `https://delivereee.github.io/home${relativePath}`;
};

/**
 * 모든 카테고리 가져오기
 * @returns 카테고리 목록
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    // API에서 카테고리 데이터 가져오기
    const response = await apiClient.get('/api/dee-categories');
    
    if (response.data && Array.isArray(response.data)) {
      // API 응답 데이터를 Category 인터페이스에 맞게 변환
      return response.data.map((item: any) => ({
        id: item.id,
        name: item.nameKo || item.name, // 한국어 이름을 우선 사용
        nameKo: item.nameKo,
        nameEn: item.nameEn,
        imageUrl: getCategoryImageUrl(item.imageUrl) // 환경에 맞게 이미지 경로 변환
      }));
    }
    
    // 응답이 배열이 아니거나 비어있으면 빈 배열 반환
    console.warn('API가 유효하지 않은 카테고리 데이터를 반환했습니다.');
    return [];
  } catch (error) {
    console.error('API에서 카테고리 데이터를 가져오는데 실패했습니다:', error);
    // API 호출 실패 시 빈 배열 반환
    return [];
  }
};
// 카테고리 타입 정의 (API 응답 구조와 일치)
export interface Category {
  id: string;
  name: string;     // 기본 표시 이름
  nameEn?: string;  // 영어 이름
  nameKo?: string;  // 한국어 이름
  nameJa?: string;  // 일본어 이름
  nameZhCn?: string; // 중국어 간체 이름
  nameZhTw?: string; // 중국어 번체 이름
  imageUrl: string; // 이미지 URL
}

// 빈 배열 - API에서 데이터를 가져오므로 더 이상 하드코딩된 값이 필요하지 않음
export const CATEGORIES: Category[] = [];

// korean-bbq

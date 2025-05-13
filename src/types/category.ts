// 카테고리 열거형
export enum FoodCategory {
  KOREAN_BBQ = '한식',
  STREET_FOOD = '길거리음식',
  BIBIMBAP = '비빔밥',
  FRIED_CHICKEN = '치킨',
  TTEOKBOKKI = '떡볶이',
  DESSERTS = '디저트',
  CHINESE = '중식',
  JAPANESE = '일식',
  WESTERN = '양식',
  CAFE = '카페',
  FAST_FOOD = '패스트푸드'
}

// 카테고리 타입 정의
export interface Category {
  id: string;
  name: string;
  nameEn: string;
  image: string;
}

// 이미지 경로를 만드는 함수
const getImagePath = (imageName: string): string => {
  // 개발 환경에서는 상대 경로 사용, 배포 환경에서는 절대 경로 사용
  if (process.env.NODE_ENV === 'development') {
    return `/images/categories/${imageName}`;
  }
  // GitHub Pages 배포 경로
  return `https://delivereee.github.io/home/images/categories/${imageName}`;
}

// 기본 카테고리 데이터 (PUBLIC_URL을 이용한 경로 사용)
export const CATEGORIES: Category[] = [
  { id: 'korean-bbq', name: FoodCategory.KOREAN_BBQ, nameEn: 'Korean BBQ', image: getImagePath('korean-bbq.jpg') },
  { id: 'street-food', name: FoodCategory.STREET_FOOD, nameEn: 'Street Food', image: getImagePath('street-food.jpg') },
  { id: 'bibimbap', name: FoodCategory.BIBIMBAP, nameEn: 'Bibimbap', image: getImagePath('bibimbap.jpg') },
  { id: 'fried-chicken', name: FoodCategory.FRIED_CHICKEN, nameEn: 'Fried Chicken', image: getImagePath('fried-chicken.jpg') },
  { id: 'tteokbokki', name: FoodCategory.TTEOKBOKKI, nameEn: 'Tteokbokki', image: getImagePath('tteokbokki.jpg') },
  { id: 'desserts', name: FoodCategory.DESSERTS, nameEn: 'Desserts', image: getImagePath('desserts.jpg') },
]; 
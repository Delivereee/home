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

// 기본 카테고리 데이터 (로컬 이미지 경로 사용)
export const CATEGORIES: Category[] = [
  { id: 'korean-bbq', name: FoodCategory.KOREAN_BBQ, nameEn: 'Korean BBQ', image: '/images/categories/korean-bbq.jpg' },
  { id: 'street-food', name: FoodCategory.STREET_FOOD, nameEn: 'Street Food', image: '/images/categories/street-food.jpg' },
  { id: 'bibimbap', name: FoodCategory.BIBIMBAP, nameEn: 'Bibimbap', image: '/images/categories/bibimbap.jpg' },
  { id: 'fried-chicken', name: FoodCategory.FRIED_CHICKEN, nameEn: 'Fried Chicken', image: '/images/categories/fried-chicken.jpg' },
  { id: 'tteokbokki', name: FoodCategory.TTEOKBOKKI, nameEn: 'Tteokbokki', image: '/images/categories/tteokbokki.jpg' },
  { id: 'desserts', name: FoodCategory.DESSERTS, nameEn: 'Desserts', image: '/images/categories/desserts.jpg' },
]; 
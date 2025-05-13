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

// 기본 카테고리 데이터
export const CATEGORIES: Category[] = [
  { id: 'korean-bbq', name: FoodCategory.KOREAN_BBQ, nameEn: 'Korean BBQ', image: 'https://source.unsplash.com/random/300x200/?korean-bbq' },
  { id: 'street-food', name: FoodCategory.STREET_FOOD, nameEn: 'Street Food', image: 'https://source.unsplash.com/random/300x200/?street-food' },
  { id: 'bibimbap', name: FoodCategory.BIBIMBAP, nameEn: 'Bibimbap', image: 'https://source.unsplash.com/random/300x200/?bibimbap' },
  { id: 'fried-chicken', name: FoodCategory.FRIED_CHICKEN, nameEn: 'Fried Chicken', image: 'https://source.unsplash.com/random/300x200/?fried-chicken' },
  { id: 'tteokbokki', name: FoodCategory.TTEOKBOKKI, nameEn: 'Tteokbokki', image: 'https://source.unsplash.com/random/300x200/?tteokbokki' },
  { id: 'desserts', name: FoodCategory.DESSERTS, nameEn: 'Desserts', image: 'https://source.unsplash.com/random/300x200/?desserts' },
]; 
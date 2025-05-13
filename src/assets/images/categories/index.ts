// 카테고리 이미지 URL 모음
export const CATEGORY_IMAGES = {
  'korean-bbq': 'https://images.unsplash.com/photo-1590301157890-4810ed352733',
  'street-food': 'https://images.unsplash.com/photo-1555780606-123993fc2e3e',
  'bibimbap': 'https://images.unsplash.com/photo-1553163147-622ab57be1c7',
  'fried-chicken': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58',
  'tteokbokki': 'https://images.unsplash.com/photo-1635363638580-c2809d049eee',
  'desserts': 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
  'chinese': 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
  'japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
  'western': 'https://images.unsplash.com/photo-1544025162-d76694265947',
  'cafe': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
  'fast-food': 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5'
};

// 이미지 접근을 위한 getter 함수
export const getCategoryImageUrl = (categoryId: string): string => {
  return CATEGORY_IMAGES[categoryId as keyof typeof CATEGORY_IMAGES] || 
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836'; // 기본 이미지
}; 
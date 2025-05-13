// 체인점 로고 URL 모음
export const CHAIN_LOGO_IMAGES = {
  'mcdonalds': 'https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg',
  'kfc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/KFC_logo.svg/1200px-KFC_logo.svg.png',
  'burger-king': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/2024px-Burger_King_logo_%281999%29.svg.png',
  'starbucks': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png',
  'pizza-hut': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Pizza_Hut_1967-1999_logo.svg/1200px-Pizza_Hut_1967-1999_logo.svg.png',
  'subway': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Subway_2016_logo.svg/2560px-Subway_2016_logo.svg.png',
  'dominos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/1200px-Domino%27s_pizza_logo.svg.png',
  'dunkin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Dunkin%27_Logo.svg/2560px-Dunkin%27_Logo.svg.png',
  'taco-bell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Taco_Bell_logo.svg/2560px-Taco_Bell_logo.svg.png',
  'chipotle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Chipotle_Mexican_Grill_logo.svg/1024px-Chipotle_Mexican_Grill_logo.svg.png'
};

// 체인점 메뉴/음식 이미지 URL 모음
export const CHAIN_FOOD_IMAGES = {
  'mcdonalds': 'https://images.unsplash.com/photo-1619881585363-5c113671b327',
  'kfc': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58',
  'burger-king': 'https://images.unsplash.com/photo-1550950158-d0d960dff51b',
  'starbucks': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
  'pizza-hut': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  'subway': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
  'dominos': 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3',
  'dunkin': 'https://images.unsplash.com/photo-1619921711256-e9760b831c3c',
  'taco-bell': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f',
  'chipotle': 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd'
};

// 이미지 접근을 위한 getter 함수
export const getChainLogoUrl = (chainId: string): string => {
  return CHAIN_LOGO_IMAGES[chainId as keyof typeof CHAIN_LOGO_IMAGES] || 
    'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7'; // 기본 이미지
};

export const getChainFoodImageUrl = (chainId: string): string => {
  return CHAIN_FOOD_IMAGES[chainId as keyof typeof CHAIN_FOOD_IMAGES] || 
    'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7'; // 기본 이미지
}; 
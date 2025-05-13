/**
 * 체인점 정보를 위한 인터페이스
 */
export interface Chain {
  id: string;
  name: string;
  logo: string;
}

/**
 * 이미지 경로를 만드는 함수
 */
const getLogoPath = (imageName: string): string => {
  return `${process.env.PUBLIC_URL}/images/chains/${imageName}`;
}

/**
 * 샘플 체인점 데이터
 */
export const SAMPLE_CHAINS: Chain[] = [
  { 
    id: 'mcdonalds', 
    name: "McDonald's", 
    logo: getLogoPath('mcdonalds.png')
  },
  { 
    id: 'kfc', 
    name: 'KFC', 
    logo: getLogoPath('kfc.png')
  },
  { 
    id: 'burger-king', 
    name: 'Burger King', 
    logo: getLogoPath('burger-king.png')
  },
  { 
    id: 'starbucks', 
    name: 'Starbucks', 
    logo: getLogoPath('starbucks.png')
  },
  { 
    id: 'pizza-hut', 
    name: 'Pizza Hut', 
    logo: getLogoPath('pizza-hut.png')
  }
]; 
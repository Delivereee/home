/**
 * 체인점 정보를 위한 인터페이스
 */
export interface Chain {
  id: string;
  name: string;
  imageUrl: string;
}

/**
 * 이미지 경로를 만드는 함수
 */
const getLogoPath = (imageName: string): string => {
  // process.env.PUBLIC_URL을 활용하여 올바른 경로 생성
  if (process.env.NODE_ENV === 'development') {
    return `${process.env.PUBLIC_URL}/images/chains/${imageName}`;
  }
  // GitHub Pages 배포 경로
  return `https://delivereee.github.io/home/images/chains/${imageName}`;
}

/**
 * 샘플 체인점 데이터
 */
export const SAMPLE_CHAINS: Chain[] = [
  { 
    id: 'mcdonalds', 
    name: "McDonald's", 
    imageUrl: getLogoPath('mcdonalds.png')
  },
  { 
    id: 'kfc', 
    name: 'KFC', 
    imageUrl: getLogoPath('kfc.png')
  },
  { 
    id: 'burger-king', 
    name: 'Burger King', 
    imageUrl: getLogoPath('burger-king.png')
  },
  { 
    id: 'starbucks', 
    name: 'Starbucks', 
    imageUrl: getLogoPath('starbucks.png')
  },
  { 
    id: 'pizza-hut', 
    name: 'Pizza Hut', 
    imageUrl: getLogoPath('pizza-hut.png')
  }
]; 
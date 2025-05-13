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
  // 개발 환경에서는 상대 경로 사용, 배포 환경에서는 절대 경로 사용
  if (process.env.NODE_ENV === 'development') {
    return `/images/chains/${imageName}`;
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
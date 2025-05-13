/**
 * 체인점 정보를 위한 인터페이스
 */
export interface Chain {
  id: string;
  name: string;
  logo: string;
}

/**
 * 샘플 체인점 데이터
 */
export const SAMPLE_CHAINS: Chain[] = [
  { 
    id: 'mcdonalds', 
    name: "McDonald's", 
    logo: '/images/chains/mcdonalds.png' 
  },
  { 
    id: 'kfc', 
    name: 'KFC', 
    logo: '/images/chains/kfc.png' 
  },
  { 
    id: 'burger-king', 
    name: 'Burger King', 
    logo: '/images/chains/burger-king.png' 
  },
  { 
    id: 'starbucks', 
    name: 'Starbucks', 
    logo: '/images/chains/starbucks.png' 
  },
  { 
    id: 'pizza-hut', 
    name: 'Pizza Hut', 
    logo: '/images/chains/pizza-hut.png'
  }
]; 
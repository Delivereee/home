import { SupportedLanguage } from '../config/languageConfig';

/**
 * 언어별 API 응답 캐시 인터페이스
 */
interface CacheEntry {
  data: any;
  timestamp: number;
  language: SupportedLanguage;
}

/**
 * 캐시 키 생성 타입 (엔드포인트와 파라미터로 구성)
 */
type CacheKey = string;

/**
 * 캐시 만료 시간 (10분)
 */
const CACHE_EXPIRY_MS = 10 * 60 * 1000;

/**
 * 전역 API 응답 캐시 저장소
 */
const apiCache: Record<CacheKey, CacheEntry> = {};

/**
 * 캐시 키 생성 함수
 * @param endpoint API 엔드포인트 
 * @param params 요청 파라미터
 * @returns 캐시 키 문자열
 */
export const createCacheKey = (endpoint: string, params?: Record<string, any>): CacheKey => {
  if (!params) return endpoint;
  
  // 파라미터를 정렬하여 일관된 캐시 키 생성
  const sortedParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  
  return `${endpoint}?${sortedParams}`;
};

/**
 * 캐시 데이터 추가 함수
 * @param cacheKey 캐시 키
 * @param data 저장할 데이터
 * @param language 언어 코드
 */
export const setCacheData = <T>(
  cacheKey: CacheKey, 
  data: T, 
  language: SupportedLanguage
): void => {
  apiCache[cacheKey] = {
    data,
    timestamp: Date.now(),
    language
  };
  
  console.log(`캐시 저장: ${cacheKey} (${language})`);
};

/**
 * 캐시 데이터 조회 함수
 * @param cacheKey 캐시 키
 * @param language 언어 코드
 * @returns 캐시된 데이터 또는 null (캐시 만료 또는 없음)
 */
export const getCacheData = <T>(
  cacheKey: CacheKey, 
  language: SupportedLanguage
): T | null => {
  const cachedEntry = apiCache[cacheKey];
  
  // 캐시 데이터가 없는 경우
  if (!cachedEntry) {
    return null;
  }
  
  // 언어가 일치하지 않는 경우
  if (cachedEntry.language !== language) {
    return null;
  }
  
  // 캐시 만료 확인
  const isExpired = Date.now() - cachedEntry.timestamp > CACHE_EXPIRY_MS;
  if (isExpired) {
    console.log(`캐시 만료: ${cacheKey} (${language})`);
    delete apiCache[cacheKey];
    return null;
  }
  
  console.log(`캐시 사용: ${cacheKey} (${language})`);
  return cachedEntry.data as T;
};

/**
 * 캐시 무효화 함수
 * @param pattern 무효화할 캐시 키 패턴 (정규식)
 */
export const invalidateCache = (pattern: RegExp): void => {
  Object.keys(apiCache).forEach(key => {
    if (pattern.test(key)) {
      delete apiCache[key];
      console.log(`캐시 무효화: ${key}`);
    }
  });
};

/**
 * 특정 언어의 전체 캐시 무효화
 * @param language 무효화할 언어
 */
export const invalidateLanguageCache = (language: SupportedLanguage): void => {
  Object.keys(apiCache).forEach(key => {
    if (apiCache[key]?.language === language) {
      delete apiCache[key];
      console.log(`${language} 언어 캐시 무효화: ${key}`);
    }
  });
}; 
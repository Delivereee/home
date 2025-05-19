/**
 * 네이버 맵스 SDK를 로드하는 유틸리티
 */

const NAVER_MAPS_CLIENT_ID = 't9urh3v0l9';
const NAVER_MAPS_TIMEOUT = 10000; // 10초 타임아웃 설정

interface MapLoadStatus {
  isLoaded: boolean;
  isLoading: boolean;
  loadPromise: Promise<boolean> | null;
}

// SDK 로드 상태를 추적하는 객체
const mapLoadStatus: MapLoadStatus = {
  isLoaded: false,
  isLoading: false,
  loadPromise: null
};

/**
 * 네이버 맵스 SDK가 로드되었는지 확인하는 함수
 */
export const isNaverMapsLoaded = (): boolean => {
  return (
    typeof window.naver !== 'undefined' && 
    window.naver.maps !== undefined && 
    window.naver.maps.Map !== undefined
  );
};

/**
 * 네이버 맵스 SDK 체크 및 로드 완료 대기 함수
 * 이제는 index.html에 직접 스크립트가 포함되어 있으므로 
 * 로드 여부만 체크하고 Promise를 리턴합니다.
 */
export const loadNaverMapsScript = (): Promise<boolean> => {
  // 이미 로드되었으면 즉시 완료
  if (isNaverMapsLoaded()) {
    console.log('Naver Maps SDK is already loaded');
    mapLoadStatus.isLoaded = true;
    return Promise.resolve(true);
  }

  // 이미 로딩 중이면 기존 프로미스 반환
  if (mapLoadStatus.isLoading && mapLoadStatus.loadPromise) {
    console.log('Naver Maps SDK is already loading');
    return mapLoadStatus.loadPromise;
  }

  // 로딩 상태로 변경
  mapLoadStatus.isLoading = true;
  
  // index.html에 스크립트가 이미 포함되어 있으므로
  // 로드 완료를 확인하는 Promise를 생성합니다.
  mapLoadStatus.loadPromise = new Promise<boolean>((resolve, reject) => {
    // 스크립트 로드 확인을 위한 타이머
    let checkCount = 0;
    const maxChecks = 50; // 10초(50 * 200ms) 동안 체크
    
    const checkLoaded = () => {
      if (isNaverMapsLoaded()) {
        console.log('Naver Maps SDK is now available');
        mapLoadStatus.isLoaded = true;
        mapLoadStatus.isLoading = false;
        resolve(true);
        return;
      }
      
      checkCount++;
      if (checkCount >= maxChecks) {
        console.error('Naver Maps SDK loading timed out');
        mapLoadStatus.isLoading = false;
        mapLoadStatus.loadPromise = null;
        reject(new Error('Naver Maps SDK loading timed out'));
        return;
      }
      
      // 200ms 간격으로 재확인
      setTimeout(checkLoaded, 200);
    };
    
    // 첫 번째 확인 시작
    checkLoaded();
  });

  return mapLoadStatus.loadPromise;
};

/**
 * 네이버 맵 SDK 초기화 함수
 * 컴포넌트에서 사용 전에 호출해야 합니다.
 */
export const initNaverMaps = async (): Promise<boolean> => {
  try {
    // 이미 로드되었으면 즉시 반환
    if (isNaverMapsLoaded()) {
      console.log('Naver Maps is already loaded');
      return true;
    }
    
    console.log('Waiting for Naver Maps to load');
    const result = await loadNaverMapsScript();
    console.log('Naver Maps initialization result:', result, 'naver object:', window.naver);
    return result;
  } catch (error) {
    console.error('Failed to initialize Naver Maps:', error);
    return false;
  }
}; 
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
 * 네이버 맵스 SDK를 동적으로 로드하는 함수
 * @returns Promise - SDK 로드 결과
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

  // 새로운 로딩 시작
  console.log('Starting to load Naver Maps SDK');
  mapLoadStatus.isLoading = true;
  
  // 기존 스크립트 제거 (중복 방지)
  const existingScript = document.querySelector('script[src*="openapi.map.naver.com"]');
  if (existingScript) {
    console.log('Removing existing Naver Maps script');
    existingScript.remove();
  }
  
  mapLoadStatus.loadPromise = new Promise<boolean>((resolve, reject) => {
    try {
      const script = document.createElement('script');
      const callbackName = `naverMapsCallback_${new Date().getTime()}`;
      let timeoutId: number | null = null;
      
      // 타임아웃 설정
      timeoutId = window.setTimeout(() => {
        console.error('Naver Maps SDK loading timed out');
        delete (window as any)[callbackName];
        mapLoadStatus.isLoading = false;
        reject(new Error('Naver Maps SDK loading timed out'));
      }, NAVER_MAPS_TIMEOUT);
      
      // 콜백 함수 정의
      (window as any)[callbackName] = () => {
        // 타임아웃 클리어
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        
        // 콜백 정리
        delete (window as any)[callbackName];
        
        // 디버깅을 위한 로그 추가
        console.log('Naver Maps SDK loaded successfully:', {
          naverExists: typeof window.naver !== 'undefined',
          mapsExists: typeof window.naver !== 'undefined' && window.naver.maps !== undefined,
          geocoderExists: typeof window.naver !== 'undefined' && (window.naver as any).geocoder !== undefined,
          availableProperties: typeof window.naver !== 'undefined' ? Object.keys(window.naver) : []
        });
        
        // 로드 상태 업데이트
        mapLoadStatus.isLoaded = true;
        mapLoadStatus.isLoading = false;
        
        // 실제로 로드되었는지 다시 확인
        if (isNaverMapsLoaded()) {
          resolve(true);
        } else {
          console.error('Naver Maps SDK callback was called but objects are not available');
          reject(new Error('Naver Maps SDK objects not available after loading'));
        }
      };

      // 스크립트 속성 설정
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true; // defer 추가
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAPS_CLIENT_ID}&submodules=geocoder&callback=${callbackName}`;
      
      script.onerror = (event) => {
        // 오류 시 타임아웃 클리어
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        
        // 오류 시 상태 업데이트
        console.error('Failed to load Naver Maps SDK:', event);
        mapLoadStatus.isLoading = false;
        mapLoadStatus.loadPromise = null;
        reject(new Error('Failed to load Naver Maps SDK'));
      };

      // 스크립트 추가
      document.head.appendChild(script);
      console.log('Naver Maps script added to document head');
    } catch (error) {
      // 예외 발생 시 상태 업데이트
      console.error('Error while setting up Naver Maps SDK loading:', error);
      mapLoadStatus.isLoading = false;
      mapLoadStatus.loadPromise = null;
      reject(error);
    }
  });

  return mapLoadStatus.loadPromise;
};

/**
 * 네이버 맵 SDK 초기화 함수
 * 컴포넌트에서 사용 전에 호출해야 합니다.
 */
export const initNaverMaps = async (): Promise<boolean> => {
  try {
    console.log('Initializing Naver Maps');
    const result = await loadNaverMapsScript();
    console.log('Naver Maps initialization result:', result);
    return result;
  } catch (error) {
    console.error('Failed to initialize Naver Maps:', error);
    return false;
  }
}; 
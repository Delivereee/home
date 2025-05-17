import axios from 'axios';

// 환경 변수에서 API 기본 URL 가져오기
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8084';
const ENVIRONMENT = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';
const isDevelopment = process.env.NODE_ENV === 'development';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 환경 정보 콘솔에 출력 (개발 중에만)
if (isDevelopment) {
  console.log(`API Client configured with base URL: ${API_BASE_URL}`);
  console.log(`Current environment: ${ENVIRONMENT}`);
  
  // 서버 상태 확인
  checkServerStatus();
}

/**
 * API 서버 상태 확인
 */
async function checkServerStatus() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/stores?lat=37.4743358&lng=126.93812149`, { timeout: 5000 });
    console.log('✅ API 서버 연결 성공:', response.status);
    console.log('📊 응답 데이터 항목 수:', Array.isArray(response.data) ? response.data.length : 'N/A');
    
    // 샘플 메뉴 API 연결 확인
    try {
      const menuResponse = await axios.get(`${API_BASE_URL}/api/v1/stores/LZXaAODk/menus`, { timeout: 5000 });
      console.log('✅ 메뉴 API 연결 성공:', menuResponse.status);
      console.log('📊 메뉴 데이터 항목 수:', Array.isArray(menuResponse.data) ? menuResponse.data.length : 'N/A');
    } catch (menuError) {
      console.warn('⚠️ 메뉴 API 연결 실패:', menuError);
    }
  } catch (error) {
    console.error('❌ API 서버 연결 실패:', error);
  }
}

// 요청 인터셉터 - 요청 전에 실행됨
apiClient.interceptors.request.use(
  (config) => {
    // 개발/배포 환경 모두에서 API 요청 허용
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 응답 후에 실행됨
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리 로직
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient; 
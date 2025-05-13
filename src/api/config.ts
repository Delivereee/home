import axios from 'axios';

// 환경 변수에서 API 기본 URL 가져오기
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8084';
const ENVIRONMENT = process.env.REACT_APP_ENV || 'development';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 환경 정보 콘솔에 출력 (개발 중에만)
if (ENVIRONMENT === 'development') {
  console.log(`API Client configured with base URL: ${API_BASE_URL}`);
  console.log(`Current environment: ${ENVIRONMENT}`);
}

// 요청 인터셉터 - 요청 전에 실행됨
apiClient.interceptors.request.use(
  (config) => {
    // 필요한 경우 여기에 인증 토큰 등 추가
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
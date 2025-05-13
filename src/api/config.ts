import axios from 'axios';

// 환경 변수에서 API 기본 URL 가져오기
// 배포 환경에서는 더미 URL을 사용하여 API 호출이 발생하지 않도록 함
const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8084')
  : '/dummy-api-url'; // 배포 환경에서는 더미 URL 사용
const ENVIRONMENT = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';

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
}

// 요청 인터셉터 - 요청 전에 실행됨
apiClient.interceptors.request.use(
  (config) => {
    // 배포 환경에서는 요청을 중단하고 샘플 데이터를 사용하기 위해 오류 발생
    if (!isDevelopment) {
      return Promise.reject(new Error('Using sample data in production'));
    }
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
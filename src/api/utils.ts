import axios, { AxiosError } from 'axios';

/**
 * API 에러 처리를 위한 표준 인터페이스
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  originalError?: Error;
}

/**
 * 파라미터를 URL 쿼리 문자열로 변환
 * @param params 쿼리 파라미터 객체
 * @returns 문자열로 변환된 쿼리 파라미터
 */
export function buildQueryString(params: Record<string, any>): string {
  const validParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`);
  
  return validParams.length ? `?${validParams.join('&')}` : '';
}

/**
 * Axios 에러를 표준화된 에러 형식으로 변환
 * @param error Axios에서 발생한 에러
 * @returns 표준화된 API 에러 객체
 */
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    // Axios 에러 처리
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data as any;
    
    return {
      message: responseData?.message || axiosError.message || 'An error occurred while fetching data',
      code: responseData?.code || axiosError.code,
      status: status || 500,
      originalError: axiosError
    };
  }
  
  // 기타 에러 처리
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    status: 500,
    originalError: error instanceof Error ? error : new Error(String(error))
  };
}

/**
 * API 응답을 로깅
 * @param endpoint API 엔드포인트
 * @param response 응답 데이터
 */
export function logApiResponse(endpoint: string, response: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`API Response [${endpoint}]:`, response);
  }
} 
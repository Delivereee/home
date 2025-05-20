/**
 * Google Analytics 관련 서비스 함수
 */

// 페이지 뷰 이벤트 전송
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  // Google Analytics가 로드되었는지 확인
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics not initialized');
    return;
  }

  // 현재 페이지의 타이틀 가져오기
  const title = pageTitle || document.title || 'Deliver Eats Easy';

  // 페이지 뷰 이벤트 전송
  window.gtag('event', 'page_view', {
    page_title: title,
    page_path: pagePath,
    send_to: 'G-G7K2FS7TSC'
  });
  
  console.log(`GA page view tracked: ${pagePath}`);
};

// 사용자 이벤트 추적 (예: 버튼 클릭, 장바구니 추가 등)
export const trackEvent = (
  eventName: string, 
  eventParams?: Record<string, any>
) => {
  // Google Analytics가 로드되었는지 확인
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google Analytics not initialized');
    return;
  }

  // 이벤트 전송
  window.gtag('event', eventName, eventParams);
  
  console.log(`GA event tracked: ${eventName}`, eventParams);
};

// GA 타입 정의
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
} 
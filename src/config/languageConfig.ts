// 지원되는 언어 타입
export type SupportedLanguage = 'en' | 'ko' | 'ja' | 'zh-CN' | 'zh-TW';

// 기본 언어 설정
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * 브라우저 언어를 감지하여 지원되는 언어로 변환
 * @returns 지원되는 언어 코드
 */
export const detectBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.toLowerCase();
  
  // 지원하는 언어 중에서 매칭되는 것 찾기
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('zh-cn')) return 'zh-CN';
  if (browserLang.startsWith('zh-tw')) return 'zh-TW';
  if (browserLang.startsWith('zh')) {
    // 간체와 번체 구분이 없는 경우 간체로 기본 설정
    return 'zh-CN';
  }
  
  // 기본값은 영어
  return 'en';
};

// 현재 언어 설정 (초기값: 디바이스 언어 또는 기본 영어)
// 브라우저 환경에서만 실행 (SSR 환경 대비)
let currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

// 브라우저 환경에서만 실행
if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
  try {
    // 로컬 스토리지에서 언어 설정 불러오기 (사용자가 이전에 선택한 언어가 있으면 사용)
    const savedLanguage = localStorage.getItem('app_language') as SupportedLanguage | null;
    
    if (savedLanguage && ['en', 'ko', 'ja', 'zh-CN', 'zh-TW'].includes(savedLanguage)) {
      currentLanguage = savedLanguage;
    } else {
      // 저장된 언어가 없으면 브라우저 언어 감지
      currentLanguage = detectBrowserLanguage();
      // 감지된 언어 저장
      localStorage.setItem('app_language', currentLanguage);
    }
    
    console.log(`언어 설정: ${currentLanguage} (${currentLanguage === detectBrowserLanguage() ? '디바이스 언어' : '사용자 설정'})`);
  } catch (error) {
    // localStorage 접근 오류 등이 발생할 경우 기본 언어 사용
    console.error('언어 설정 불러오기 실패:', error);
    currentLanguage = DEFAULT_LANGUAGE;
  }
}

/**
 * 현재 설정된 언어 반환
 * @returns 현재 언어 코드
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return currentLanguage;
};

/**
 * 디바이스 언어와 일치하는지 확인
 * @returns 현재 언어가 디바이스 언어와 일치하면 true
 */
export const isDeviceLanguage = (): boolean => {
  return currentLanguage === detectBrowserLanguage();
};

/**
 * 언어 설정 변경
 * @param language 변경할 언어 코드
 */
export const setLanguage = (language: SupportedLanguage): void => {
  currentLanguage = language;
  
  // 브라우저 환경에서만 실행
  if (typeof window !== 'undefined') {
    try {
      // 선택한 언어 설정 저장
      localStorage.setItem('app_language', language);
      
      // 언어 변경 이벤트 발생 - 모든 컴포넌트에 변경 알림
      const event = new CustomEvent('language-changed', { detail: { language } });
      window.dispatchEvent(event);
      
      console.log(`언어가 변경되었습니다: ${language}`);
    } catch (error) {
      console.error('언어 설정 저장 실패:', error);
    }
  }
};

/**
 * 다국어 필드에서 현재 언어에 맞는 값 반환
 * 해당 언어의 값이 없으면 기본 필드 값 사용
 * 
 * @param defaultValue 기본 필드 값
 * @param translations 언어별 번역 값 객체 (예: { en: 'English value', ko: '한국어 값' })
 * @returns 현재 언어에 맞는 값 또는 기본값
 */
export const getLocalizedValue = (
  defaultValue: string,
  translations: Partial<Record<SupportedLanguage, string | null | undefined>>
): string => {
  // 인자가 유효하지 않은 경우 빈 문자열 반환
  if (!defaultValue && !translations) return '';
  
  // defaultValue가 없으면 빈 문자열 사용
  const safeDefaultValue = defaultValue || '';
  
  // translations이 없거나 객체가 아닌 경우 기본값 반환
  if (!translations || typeof translations !== 'object') {
    return safeDefaultValue;
  }
  
  // 현재 언어에 해당하는 번역 값이 있고 값이 유효하면 해당 값 반환
  const translatedValue = translations[currentLanguage];
  if (translatedValue) {
    return translatedValue;
  }
  
  // 영어 값이 있고 현재 언어가 영어가 아니면 영어 값 반환
  if (translations.en && currentLanguage !== 'en') {
    return translations.en;
  }
  
  // 그 외의 경우 기본값 반환
  return safeDefaultValue;
}; 
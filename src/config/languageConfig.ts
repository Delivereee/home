// 지원되는 언어 타입
export type SupportedLanguage = 'en' | 'ko' | 'ja' | 'zh-CN' | 'zh-TW';

// 기본 언어 설정
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// 현재 언어 설정 (기본값: 'en')
let currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

/**
 * 현재 설정된 언어 반환
 * @returns 현재 언어 코드
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return currentLanguage;
};

/**
 * 언어 설정 변경
 * @param language 변경할 언어 코드
 */
export const setLanguage = (language: SupportedLanguage): void => {
  currentLanguage = language;
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
  return defaultValue;
}; 
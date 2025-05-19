import { useState, useEffect } from 'react';
import { t } from '../config/translations';
import { getCurrentLanguage, LANGUAGE_CHANGE_EVENT } from '../config/languageConfig';

/**
 * 다국어 처리를 위한 React 훅
 * 언어 변경 시 자동으로 컴포넌트를 리렌더링합니다.
 * 
 * @returns 다국어 처리 유틸리티 함수
 */
export const useTranslation = () => {
  // 현재 언어 상태
  const [language, setLanguage] = useState(getCurrentLanguage());
  
  // 언어 변경 감지하여 상태 업데이트
  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      // 언어 변경 이벤트 발생 시 상태 업데이트하여 컴포넌트 리렌더링
      setLanguage(getCurrentLanguage());
    };
    
    // 언어 변경 이벤트 리스너 등록
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);
    };
  }, []);
  
  /**
   * 번역 함수 - 키에 해당하는 현재 언어의 텍스트 반환
   * @param key 번역 키
   * @returns 번역된 텍스트
   */
  const translate = (key: string): string => {
    return t(key, language);
  };
  
  return {
    t: translate,
    language
  };
};

export default useTranslation; 
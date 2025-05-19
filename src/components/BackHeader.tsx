import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentLanguage, 
  setLanguage, 
  SupportedLanguage, 
  detectBrowserLanguage,
  isDeviceLanguage
} from '../config/languageConfig';
import useTranslation from '../hooks/useTranslation';

interface BackHeaderProps {
  title?: string;
}

const BackHeader: React.FC<BackHeaderProps> = ({ title = 'Back' }) => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(getCurrentLanguage());
  const deviceLang = detectBrowserLanguage();
  const { t } = useTranslation();

  // 앱 전체 언어 변경 시 상태 업데이트
  useEffect(() => {
    const updateLangState = () => {
      setCurrentLang(getCurrentLanguage());
    };
    
    // 언어 변경 감지를 위한 이벤트 리스너
    window.addEventListener('language-changed', updateLangState);
    
    return () => {
      window.removeEventListener('language-changed', updateLangState);
    };
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  // 언어 변경 버튼 클릭 핸들러
  const handleLanguageToggle = useCallback(() => {
    // 현재 언어가 영어면 디바이스 언어로, 아니면 영어로 전환
    const usingDeviceLang = isDeviceLanguage();
    const newLang = usingDeviceLang ? 'en' : deviceLang;
    
    // 언어 설정 변경
    setLanguage(newLang);
    setCurrentLang(newLang);
    
    // 언어 변경 이벤트 발생 (다른 컴포넌트에 알림)
    const event = new CustomEvent('language-changed', { detail: { language: newLang } });
    window.dispatchEvent(event);
    
    console.log(`언어가 변경되었습니다: ${getCurrentLanguage()} → ${newLang}`);
  }, [deviceLang]);

  // 현재 언어에 따라 버튼 툴팁 설정
  const getLanguageButtonTooltip = () => {
    const usingDeviceLang = isDeviceLanguage();
    return usingDeviceLang 
      ? 'Switch to English' 
      : `Switch to device language (${getLanguageDisplayName(deviceLang)})`;
  };
  
  // 언어 코드를 표시 이름으로 변환
  const getLanguageDisplayName = (langCode: SupportedLanguage): string => {
    const langNames: Record<SupportedLanguage, string> = {
      'en': 'English',
      'ko': '한국어',
      'ja': '日本語',
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文'
    };
    return langNames[langCode] || langCode;
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-10">
      <div className="flex items-center p-4">
        <button 
          onClick={handleGoBack}
          className="mr-4"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold flex-1 truncate">{title}</h1>
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center" 
          aria-label={getLanguageButtonTooltip()}
          onClick={handleLanguageToggle}
          title={getLanguageButtonTooltip()}
        >
          {/* 현재 언어 표시 */}
          <span className="mr-1 text-sm font-medium">{currentLang.toUpperCase()}</span>
          
          {/* Globe Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-400">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default BackHeader; 
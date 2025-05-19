import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DEE2Logo from '../assets/logos/DEE2.svg';
import { useAddress } from '../contexts/AddressContext';
import { 
  getCurrentLanguage, 
  setLanguage, 
  SupportedLanguage, 
  detectBrowserLanguage,
  isDeviceLanguage
} from '../config/languageConfig';
import useTranslation from '../hooks/useTranslation';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { address, isAddressSet } = useAddress();
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(getCurrentLanguage());
  const deviceLang = detectBrowserLanguage();
  const { t } = useTranslation(); // 다국어 처리 훅 사용
  
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

  const handleAddressClick = () => {
    // 주소 설정 페이지로 이동
    navigate('/address');
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
    <div className="bg-white border-b">
      {/* GNB 영역 - Material Design 가이드라인에 맞게 조정 */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center justify-center mr-3">
            <img 
              src={DEE2Logo} 
              alt="DEE Logo"
              className="h-10 w-auto"
              style={{ 
                objectFit: 'contain'
              }}
            />
          </div>
          <h1 className="text-xl font-medium">{t('app.name')}</h1>
        </div>
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center" 
          aria-label={getLanguageButtonTooltip()}
          onClick={handleLanguageToggle}
          title={getLanguageButtonTooltip()}
        >
          {/* 현재 언어 표시 */}
          <span className="mr-1 text-sm font-medium">{currentLang.toUpperCase()}</span>
          
          {/* Globe Icon - Material 아이콘 스타일로 조정 */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-400">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </button>
      </div>

      {/* 위치 정보 영역 - AddressContext 연동 */}
      <div 
        className="px-4 pb-3 cursor-pointer"
        onClick={handleAddressClick}
      >
        <div className="flex items-center text-gray-700 mb-2">
          {/* Map Marker Icon - Material 스타일 적용 */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-400 mr-3">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="flex-grow text-left font-normal">
            {address ? address.mainAddress : t('header.setAddress')}
          </span>
          {/* Chevron Right Icon - Material 스타일 적용 */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 ml-1">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </div>
        
        {isAddressSet() ? (
          <div className="flex items-center text-green-500 text-xs ml-8">
            {/* Check Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{t('header.allSet')}</span>
          </div>
        ) : (
          <div className="flex items-center text-yellow-500 text-xs ml-8">
            {/* Warning Icon - Material 스타일 적용 */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            <span>{t('header.addressNotSet')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header; 
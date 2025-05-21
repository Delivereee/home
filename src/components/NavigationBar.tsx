import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import { useAddress } from '../contexts/AddressContext';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAddressSet } = useAddress();
  
  // 주소 탭 하이라이트 상태 
  const [addressHighlight, setAddressHighlight] = useState(false);
  
  // 현재 활성화된 탭 확인
  const isActive = (path: string) => {
    return location.pathname === path || 
      (path === '/' && (location.pathname === '/' || location.pathname === '/home')) ||
      (path === '/browse' && location.pathname === '/restaurants');
  };
  
  // 주소가 설정되지 않았을 때 하이라이트 효과 추가
  useEffect(() => {
    // 주소가 설정되지 않았고, 주소 설정 페이지가 아닌 경우에만
    if (!isAddressSet() && location.pathname !== '/address') {
      // 깜빡임 효과
      const interval = setInterval(() => {
        setAddressHighlight(prev => !prev);
      }, 800);
      
      return () => clearInterval(interval);
    } else {
      setAddressHighlight(false);
    }
  }, [isAddressSet, location.pathname]);
  
  // 홈으로 이동 (주소 체크 없음)
  const goToHome = () => navigate('/');
  
  // 전체 레스토랑 목록으로 이동 (주소 체크)
  const goToBrowse = () => {
    if (isAddressSet()) {
      navigate('/browse');
    } else {
      // 주소 탭으로 직접 이동
      navigate('/address');
    }
  };
  
  // 주소 페이지로 이동
  const goToAddress = () => navigate('/address');
  
  // 장바구니로 이동 (주소 체크)
  const goToCart = () => {
    if (isAddressSet()) {
      navigate('/cart');
    } else {
      // 주소 탭으로 직접 이동
      navigate('/address');
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 shadow-lg">
      <div className="grid grid-cols-4 py-2 px-2">
        <div 
          className="flex flex-col items-center justify-center cursor-pointer py-1" 
          onClick={goToHome}
        >
          {/* Home Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
            className={`w-6 h-6 ${isActive('/') ? 'text-red-500' : 'text-gray-500'}`}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className={`text-xs mt-1 ${isActive('/') ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{t('nav.home')}</span>
        </div>
        
        <div 
          className="flex flex-col items-center justify-center cursor-pointer py-1" 
          onClick={goToBrowse}
        >
          {/* Compass/Browse Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
            className={`w-6 h-6 ${isActive('/browse') ? 'text-red-500' : 'text-gray-500'}`}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
          </svg>
          <span className={`text-xs mt-1 ${isActive('/browse') ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{t('nav.browse')}</span>
        </div>
        
        <div 
          className={`
            flex flex-col items-center justify-center cursor-pointer py-1
            ${addressHighlight ? 'animate-pulse' : ''}
            ${!isAddressSet() && !isActive('/address') ? 'relative' : ''}
          `}
          onClick={goToAddress}
        >
          {/* Address/Location Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
            className={`w-6 h-6 ${isActive('/address') ? 'text-red-500' : addressHighlight ? 'text-red-400' : 'text-gray-500'}`}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className={`text-xs mt-1 ${isActive('/address') ? 'text-red-500 font-medium' : addressHighlight ? 'text-red-400 font-medium' : 'text-gray-500'}`}>
            {t('header.setAddress')}
          </span>
          
          {/* 주소 설정 필요 안내 메시지 */}
          {!isAddressSet() && !isActive('/address') && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
              {t('address.tapToSet')}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-red-500"></div>
            </div>
          )}
        </div>
        
        <div 
          className="flex flex-col items-center justify-center cursor-pointer py-1" 
          onClick={goToCart}
        >
          {/* Cart Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
            className={`w-6 h-6 ${isActive('/cart') ? 'text-red-500' : 'text-gray-500'}`}>
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
          <span className={`text-xs mt-1 ${isActive('/cart') ? 'text-red-500 font-medium' : 'text-gray-500'}`}>{t('nav.cart')}</span>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar; 
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { CartProvider } from './contexts/CartContext';
import { AddressProvider } from './contexts/AddressContext';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import PopularChains from './components/PopularChains';
import NavigationBar from './components/NavigationBar';
import CategoryDetail from './pages/CategoryDetail';
import RestaurantDetail from './pages/RestaurantDetail';
import MenuDetail from './pages/MenuDetail';
import CartReplaceConfirm from './components/CartReplaceConfirm';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import AddressSetupPage from './pages/AddressSetupPage';
import { 
  setChannelTalkPage, 
  updateChannelTalkUser, 
  bootChannelTalk, 
  shutdownChannelTalk, 
  isHomePage 
} from './services/ChannelService';
import { getCurrentLanguage, SupportedLanguage, LANGUAGE_CHANGE_EVENT } from './config/languageConfig';
import { invalidateLanguageCache } from './api/cacheUtils';
import { trackPageView } from './services/AnalyticsService';

// Google Analytics 페이지 추적 컴포넌트
const AnalyticsTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // 현재 경로 추출
    const currentPath = window.location.hash.replace('#', '') || '/';
    
    // Google Analytics에 페이지 뷰 이벤트 전송
    trackPageView(currentPath);
  }, [location.pathname, location.hash]);
  
  return null;
};

// 채널톡 관리 컴포넌트 - 홈 페이지에서만 활성화
const ChannelTalkManager = () => {
  const location = useLocation();
  
  // DOM에서 채널톡 버튼 요소들을 모두 찾아 표시/숨김 처리하는 함수
  const toggleChannelTalkButton = (show: boolean) => {
    // 커스텀 버튼 처리
    const customButton = document.getElementById('custom-channel-button');
    if (customButton) {
      customButton.style.display = show ? 'flex' : 'none';
    }
    
    // 채널톡의 기본 버튼 처리 (클래스로 찾기)
    const channelButtons = document.querySelectorAll('[class*="channel-"]');
    channelButtons.forEach(button => {
      const element = button as HTMLElement;
      if (element.tagName === 'BUTTON' || 
          element.tagName === 'DIV' && (element.style.position === 'fixed' || element.getAttribute('class')?.includes('launcher'))) {
        // z-index 조정을 통해 다른 UI 요소와 겹치지 않도록 함
        if (element.style.zIndex) {
          element.style.zIndex = '998'; // 낮은 z-index 사용
        }
        element.style.display = show ? '' : 'none';
      }
    });
    
    // iframe 처리 (채널톡은 종종 iframe을 사용)
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (iframe.src.includes('channel.io')) {
        // z-index 조정
        const parent = iframe.parentElement;
        if (parent && parent instanceof HTMLElement) {
          parent.style.zIndex = '998';
        }
        iframe.style.display = show ? '' : 'none';
      }
    });
  };
  
  useEffect(() => {
    // 현재 경로 (로깅용)
    const currentPath = window.location.hash.replace('#', '');
    console.log('라우트 변경 감지:', currentPath);
    
    // 홈 페이지 여부 확인
    const homePageActive = isHomePage();
    console.log('홈 페이지 여부:', homePageActive);
    
    if (homePageActive) {
      // 홈 페이지에서만 채널톡 활성화
      console.log('채널톡 활성화 (홈 페이지)');
      
      // 현재 언어 설정으로 채널톡 초기화
      const currentLang = getCurrentLanguage();
      bootChannelTalk({
        language: currentLang
      }, true); // 강제 초기화 플래그 true로 설정
      
      // 현재 페이지 이름 설정
      setChannelTalkPage(location.pathname || 'Home');
      
      // 약간의 지연 후 DOM에서 버튼 표시
      setTimeout(() => {
        toggleChannelTalkButton(true);
      }, 500);
    } else {
      // 홈 페이지가 아니면 채널톡 종료 및 요소 숨김
      console.log('채널톡 비활성화 (홈 페이지 아님)');
      shutdownChannelTalk();
      
      // 약간의 지연 후 DOM에서 버튼 숨김
      setTimeout(() => {
        toggleChannelTalkButton(false);
      }, 300);
    }
    
    // 컴포넌트 언마운트 시 정리 작업
    return () => {
      // 특별한 정리 작업은 필요 없음
    };
  }, [location.pathname, location.hash]);
  
  // 언어 변경 감지 및 처리
  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{language: SupportedLanguage}>;
      const newLang = customEvent.detail.language;
      console.log('언어 변경 감지:', newLang);
      
      // 홈 페이지에서만 언어 변경 적용
      if (isHomePage() && window.ChannelIO) {
        shutdownChannelTalk();
        
        // 약간의 지연 후 새 언어로 재시작
        setTimeout(() => {
          bootChannelTalk({
            language: newLang
          }, true);
        }, 300);
      }
    };
    
    // 언어 변경 이벤트 리스너 등록
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);
    };
  }, []);
  
  return null;
};

// 앱 수준의 이벤트 핸들러 컴포넌트
const AppEventHandler = () => {
  useEffect(() => {
    // 언어 변경 이벤트 발생 시, 해당 언어의 API 캐시를 무효화
    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{language: SupportedLanguage, timestamp: number}>;
      const newLang = customEvent.detail.language;
      
      console.log(`언어 변경됨: ${newLang} - API 캐시 무효화`);
      
      // 이전 언어의 캐시 무효화
      invalidateLanguageCache(newLang);
    };
    
    // 언어 변경 이벤트 리스너 등록
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);
    
    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange as EventListener);
    };
  }, []);
  
  return null;
};

// 앱 컴포넌트를 감싸는 라우터 컨텍스트 제공 컴포넌트
const AppWithRouter = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

// 실제 앱 컨텐츠 컴포넌트
const AppContent = () => {
  return (
    <div className="App bg-gray-50 min-h-screen">
      <AnalyticsTracker />
      <ChannelTalkManager />
      <AppEventHandler />
      <Routes>
        {/* 홈 화면 */}
        <Route path="/" element={
          <>
            <Header />
            <main className="pb-16">
              <CategorySection />
              <PopularChains />
            </main>
            <NavigationBar />
          </>
        } />
        
        {/* 홈 화면 (GitHub Pages용 추가 경로) */}
        <Route path="/home" element={
          <>
            <Header />
            <main className="pb-16">
              <CategorySection />
              <PopularChains />
            </main>
            <NavigationBar />
          </>
        } />
        
        {/* 카테고리 상세 페이지 */}
        <Route path="/categories/:categoryId" element={<CategoryDetail />} />
        
        {/* 이전 라우트 유지 (하위 호환성) */}
        <Route path="/categories/:categoryId/:categoryName" element={<CategoryDetail />} />
        
        {/* 전체 레스토랑 목록 (Browse) */}
        <Route path="/browse" element={<CategoryDetail />} />
        <Route path="/restaurants" element={<CategoryDetail />} />
        
        {/* 체인점 상세 페이지 */}
        <Route path="/chains/:chainId/:chainName" element={<CategoryDetail />} />
        
        {/* 가게 상세 페이지 */}
        <Route path="/restaurant/:restaurantId" element={<RestaurantDetail />} />
        
        {/* 메뉴 상세 페이지 */}
        <Route path="/restaurant/:restaurantId/menu/:menuId" element={<MenuDetail />} />
        
        {/* 장바구니 페이지 */}
        <Route path="/cart" element={<CartPage />} />
        
        {/* 결제 페이지 */}
        <Route path="/checkout" element={<CheckoutPage />} />
        
        {/* 주문 성공 페이지 */}
        <Route path="/order-success" element={<OrderSuccessPage />} />
        
        {/* 주소 설정 페이지 */}
        <Route path="/address" element={<AddressSetupPage />} />
        
        {/* 404 에러 페이지 - 항상 모든 라우트의 마지막에 배치 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* 전역 컴포넌트 - 어디서든 접근 가능 */}
      <CartReplaceConfirm />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <AddressProvider>
        <AppWithRouter />
      </AddressProvider>
    </CartProvider>
  );
}

export default App;

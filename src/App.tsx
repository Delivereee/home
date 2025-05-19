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
import { setChannelTalkPage, updateChannelTalkUser, bootChannelTalk, shutdownChannelTalk } from './services/ChannelService';

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
      // 채널톡 버튼으로 보이는 요소만 처리 (버튼, 아이콘 등)
      if (element.tagName === 'BUTTON' || 
          element.tagName === 'DIV' && (element.style.position === 'fixed' || element.getAttribute('class')?.includes('launcher'))) {
        element.style.display = show ? '' : 'none';
      }
    });
    
    // iframe 처리 (채널톡은 종종 iframe을 사용)
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (iframe.src.includes('channel.io')) {
        iframe.style.display = show ? '' : 'none';
      }
    });
  };
  
  useEffect(() => {
    // 현재 경로 확인
    const currentPath = window.location.hash.replace('#', '');
    const isHomePage = currentPath === '/' || currentPath === '/home' || currentPath === '';
    
    console.log('라우트 변경 감지:', currentPath, '홈페이지:', isHomePage);
    
    // 홈 페이지에서만 채널톡 활성화
    if (isHomePage) {
      console.log('홈 페이지 확인: 채널톡 활성화');
      
      // 채널톡 초기화 및 버튼 표시
      bootChannelTalk();
      setChannelTalkPage('Home');
      
      // 약간의 지연 후 DOM에서 버튼 표시 (초기화 후 생성 시간 고려)
      setTimeout(() => {
        toggleChannelTalkButton(true);
      }, 500);
    } else {
      console.log('다른 페이지 확인: 채널톡 비활성화');
      
      // 채널톡 비활성화 전에 먼저 DOM에서 버튼 숨김
      toggleChannelTalkButton(false);
      
      // 채널톡 종료
      shutdownChannelTalk();
    }
    
    // 컴포넌트 언마운트 시 버튼 숨김
    return () => {
      if (!isHomePage) {
        toggleChannelTalkButton(false);
      }
    };
  }, [location.pathname, location.hash]);
  
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
      <ChannelTalkManager />
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

import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
import { bootChannelTalk, setChannelTalkPage, updateChannelTalkUser } from './services/ChannelService';

function App() {
  // 채널톡 페이지 추적
  useEffect(() => {
    // 현재 페이지 설정
    setChannelTalkPage('Home');
    
    // 페이지 변경 감지
    const handleRouteChange = () => {
      const currentPath = window.location.hash.replace('#', '');
      let pageName = 'Home';
      
      if (currentPath.includes('restaurant')) {
        pageName = 'Restaurant Detail';
      } else if (currentPath.includes('cart')) {
        pageName = 'Cart';
      } else if (currentPath.includes('checkout')) {
        pageName = 'Checkout';
      } else if (currentPath.includes('address')) {
        pageName = 'Address Setup';
      }
      
      setChannelTalkPage(pageName);
    };
    
    // 해시 변경 이벤트 리스너 추가
    window.addEventListener('hashchange', handleRouteChange);
    
    // 사용자 정보 업데이트 (선택 사항)
    if (window.ChannelIO) {
      try {
        window.ChannelIO('updateUser', {
          name: 'Guest User'
        });
      } catch (error) {
        console.error('Failed to update ChannelIO user:', error);
      }
    }
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);
  
  return (
    <CartProvider>
      <AddressProvider>
        <Router>
          <div className="App bg-gray-50 min-h-screen">
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
        </Router>
      </AddressProvider>
    </CartProvider>
  );
}

export default App;

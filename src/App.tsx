import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { CartProvider } from './contexts/CartContext';
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

function App() {
  return (
    <CartProvider>
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
    </CartProvider>
  );
}

export default App;

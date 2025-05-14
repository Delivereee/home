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
import CartReplaceConfirm from './components/CartReplaceConfirm';

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
            <Route path="/restaurants" element={<CategoryDetail />} />
            
            {/* 체인점 상세 페이지 */}
            <Route path="/chains/:chainId/:chainName" element={<CategoryDetail />} />
            
            {/* 가게 상세 페이지 */}
            <Route path="/restaurant/:restaurantId" element={<RestaurantDetail />} />
          </Routes>

          {/* 전역 컴포넌트 - 어디서든 접근 가능 */}
          <CartReplaceConfirm />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

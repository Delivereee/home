import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import PopularChains from './components/PopularChains';
import NavigationBar from './components/NavigationBar';
import CategoryDetail from './pages/CategoryDetail';

function App() {
  return (
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

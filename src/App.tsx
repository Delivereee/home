import React from 'react';
import './App.css';
import Header from './components/Header';
import CategorySection from './components/CategorySection';
import PopularChains from './components/PopularChains';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <div className="App bg-gray-50 min-h-screen">
      <Header />
      <main className="pb-16">
        <CategorySection />
        <PopularChains />
      </main>
      <NavigationBar />
    </div>
  );
}

export default App;

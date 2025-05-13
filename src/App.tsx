import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="bg-orange-500 p-4 text-white">
        <h1 className="text-2xl font-bold text-center">배달 주문 앱</h1>
      </header>
      <main className="p-4">
        <div className="max-w-md mx-auto">
          <p className="text-center mb-4">배달 주문 대행 앱입니다.</p>
          <div className="bg-white shadow-md rounded p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">카테고리</h2>
            <div className="grid grid-cols-3 gap-2">
              {['한식', '중식', '일식', '양식', '치킨', '피자'].map((category) => (
                <button 
                  key={category}
                  className="bg-gray-100 hover:bg-orange-100 p-2 rounded text-sm"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

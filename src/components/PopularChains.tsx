import React from 'react';

interface Chain {
  id: string;
  name: string;
  logo: string;
}

const PopularChains: React.FC = () => {
  // 샘플 체인점 데이터
  const chains: Chain[] = [
    { 
      id: 'mcdonalds', 
      name: "McDonald's", 
      logo: '/images/chains/mcdonalds.png' 
    },
    { 
      id: 'kfc', 
      name: 'KFC', 
      logo: '/images/chains/kfc.png' 
    },
    { 
      id: 'burger-king', 
      name: 'Burger King', 
      logo: '/images/chains/burger-king.png' 
    },
    { 
      id: 'starbucks', 
      name: 'Starbucks', 
      logo: '/images/chains/starbucks.png' 
    },
    { 
      id: 'pizza-hut', 
      name: 'Pizza Hut', 
      logo: '/images/chains/pizza-hut.png'
    }
  ];

  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl font-semibold mb-4 text-left">Popular Chains</h2>
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide pb-2 space-x-4 border-b border-gray-200" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {chains.map((chain) => (
            <div key={chain.id} className="flex flex-col items-center min-w-[80px] pb-3">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md border mb-2">
                <img 
                  src={chain.logo} 
                  alt={chain.name} 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="text-sm text-center">{chain.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Social Media Icons */}
      <div className="flex justify-center mt-10 space-x-4">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-2xl">W</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center">
          <span className="text-white text-2xl">L</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
          <span className="text-white text-2xl">W</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center">
          <span className="text-white text-2xl">C</span>
        </div>
      </div>
    </div>
  );
};

export default PopularChains; 
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
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/800px-McDonald%27s_Golden_Arches.svg.png' 
    },
    { 
      id: 'kfc', 
      name: 'KFC', 
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/1024px-KFC_logo.svg.png' 
    },
    { 
      id: 'burgerking', 
      name: 'Burger King', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/1024px-Burger_King_logo_%281999%29.svg.png' 
    },
    { 
      id: 'starbucks', 
      name: 'Starbucks', 
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1024px-Starbucks_Corporation_Logo_2011.svg.png' 
    },
    { 
      id: 'pizzahut', 
      name: 'Pizza Hut', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Pizza_Hut_1967-1999_logo.svg/1024px-Pizza_Hut_1967-1999_logo.svg.png' 
    }
  ];

  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl font-semibold mb-4 text-left">Popular Chains</h2>
      <div className="flex overflow-x-auto scrollbar-hide pb-2 space-x-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {chains.map((chain) => (
          <div key={chain.id} className="flex flex-col items-center min-w-[80px]">
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
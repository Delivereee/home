import React from 'react';
import { Restaurant } from '../types/restaurant';

interface RestaurantItemProps {
  restaurant: Restaurant;
}

const RestaurantItem: React.FC<RestaurantItemProps> = ({ restaurant }) => {
  return (
    <div className="border rounded-lg overflow-hidden mb-4 bg-white shadow-sm">
      {/* 레스토랑 이미지 */}
      <div className="h-48 overflow-hidden">
        <img 
          src={restaurant.backgroundUrl || restaurant.logoUrl} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 레스토랑 정보 */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
        <p className="text-gray-500 mb-2">{restaurant.address}</p>
        
        {/* 배달 시간 추정 */}
        <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">
          20-30 min
        </div>
        
        {/* 별점 및 리뷰 수 */}
        {restaurant.reviewCount > 0 && (
          <div className="mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400 mr-1">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="text-sm font-medium">{restaurant.reviewAvg.toFixed(1)}</span>
            <span className="text-sm text-gray-500 ml-1">({restaurant.reviewCount})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantItem; 
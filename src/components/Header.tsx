import React from 'react';
import { useNavigate } from 'react-router-dom';
import DEE2Logo from '../assets/logos/DEE2.svg';
import { useAddress } from '../contexts/AddressContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { address, isAddressSet } = useAddress();

  const handleAddressClick = () => {
    // 주소 설정 페이지로 이동
    navigate('/address');
  };

  return (
    <div className="bg-white border-b">
      {/* GNB 영역 - Material Design 가이드라인에 맞게 조정 */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center justify-center mr-3">
            <img 
              src={DEE2Logo} 
              alt="DEE Logo"
              className="h-10 w-auto"
              style={{ 
                objectFit: 'contain'
              }}
            />
          </div>
          <h1 className="text-xl font-medium">Deliver Eats Easy</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Change language">
          {/* Globe Icon - Material 아이콘 스타일로 조정 */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-400">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </button>
      </div>

      {/* 위치 정보 영역 - AddressContext 연동 */}
      <div 
        className="px-4 pb-3 cursor-pointer"
        onClick={handleAddressClick}
      >
        <div className="flex items-center text-gray-700 mb-2">
          {/* Map Marker Icon - Material 스타일 적용 */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-400 mr-3">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span className="flex-grow text-left font-normal">
            {address ? address.mainAddress : 'Set Your Address'}
          </span>
          {/* Chevron Right Icon - Material 스타일 적용 */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400 ml-1">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </div>
        
        {isAddressSet() ? (
          <div className="flex items-center text-green-500 text-xs ml-8">
            {/* Check Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>You're all set - Start your order!</span>
          </div>
        ) : (
          <div className="flex items-center text-yellow-500 text-xs ml-8">
            {/* Warning Icon - Material 스타일 적용 */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            <span>Full address not set (Tap to enter)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header; 
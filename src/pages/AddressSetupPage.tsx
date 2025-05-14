import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '../components/BackHeader';
import { useAddress } from '../contexts/AddressContext';
import { getCurrentPosition, reverseGeocode, getIpBasedLocation } from '../services/LocationService';

const AddressSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { address, setAddress } = useAddress();
  
  const [mainAddress, setMainAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    mainAddress: false,
    detailAddress: false
  });

  // 유효성 검사 상태와 유효성 검사 함수
  const validateMainAddress = (address: string): { isValid: boolean; message: string | null } => {
    const trimmedAddress = address.trim();
    
    // 비어 있는지 확인
    if (trimmedAddress.length === 0) {
      return { isValid: false, message: 'Main address is required' };
    }
    
    // 너무 짧은지 확인 (최소 8자)
    if (trimmedAddress.length < 8) {
      return { isValid: false, message: 'Address is too short, please enter a complete address' };
    }
    
    // 숫자가 포함되어 있는지 확인 (대부분의 주소에는 숫자가 포함됨)
    if (!/\d/.test(trimmedAddress)) {
      return { isValid: false, message: 'Address should include a number (building or street number)' };
    }
    
    // 쉼표가 있는지 확인 (올바른 주소 형식인지)
    if (!trimmedAddress.includes(',')) {
      return { isValid: false, message: 'Please use commas to separate address components' };
    }
    
    return { isValid: true, message: null };
  };
  
  // 주소 검증 결과
  const mainAddressValidation = validateMainAddress(mainAddress);
  const isMainAddressValid = mainAddressValidation.isValid;
  
  // 상세 주소 유효성 검사는 단순히 비어있지 않은지만 확인
  const isDetailAddressValid = detailAddress.trim().length > 0;
  const isFormValid = isMainAddressValid && isDetailAddressValid;

  // 기존 주소 정보가 있으면 로드
  useEffect(() => {
    if (address) {
      setMainAddress(address.mainAddress || '');
      setDetailAddress(address.detailAddress || '');
    }
  }, [address]);

  // 필드 변경 및 터치 상태 관리 핸들러
  const handleMainAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainAddress(e.target.value);
    setTouched(prev => ({ ...prev, mainAddress: true }));
  };

  const handleDetailAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetailAddress(e.target.value);
    setTouched(prev => ({ ...prev, detailAddress: true }));
  };

  // GPS를 사용하여 현재 위치 정보 가져오기
  const handleUseGPS = async () => {
    try {
      setIsLoading(true);
      setLocationError(null);
      console.log('GPS 위치 정보 요청 시작');
      
      // 브라우저의 Geolocation API를 사용하여 현재 위치 좌표 가져오기
      const position = await getCurrentPosition().catch(async (error) => {
        console.error('Geolocation API 오류:', error);
        
        // Geolocation 실패 시 IP 기반 위치 정보 사용
        if ((error as GeolocationPositionError)?.code === 1) {
          // 권한 거부 시 IP 기반 위치 정보 사용
          setLocationError('Using approximate location based on IP due to location permission denied.');
          const ipLocation = await getIpBasedLocation();
          if (!ipLocation) throw error;
          return ipLocation;
        } else if ((error as GeolocationPositionError)?.code === 2) {
          // 위치 정보를 사용할 수 없는 경우
          setLocationError('Using approximate location based on IP as precise location is unavailable.');
          const ipLocation = await getIpBasedLocation();
          if (!ipLocation) throw error;
          return ipLocation;
        } else {
          throw error;
        }
      });
      
      console.log('위치 정보 가져오기 성공:', position);
      
      // OpenStreetMap Nominatim API를 사용하여 좌표를 주소로 변환
      const geoAddress = await reverseGeocode(position.lng, position.lat);
      console.log('변환된 주소:', geoAddress);
      
      if (geoAddress) {
        // API에서 가져온 주소에 쉼표가 없다면 추가
        let formattedAddress = geoAddress;
        if (!formattedAddress.includes(',')) {
          // 공백을 기준으로 주소를 분리하고 콤마로 재구성
          const parts = formattedAddress.split(' ').filter(Boolean);
          if (parts.length >= 3) {
            // 주소 요소가 충분하면 쉼표 추가 (예: "123 Main Street, New York, USA")
            formattedAddress = [
              parts.slice(0, Math.ceil(parts.length / 3)).join(' '),
              parts.slice(Math.ceil(parts.length / 3), Math.ceil(parts.length * 2 / 3)).join(' '),
              parts.slice(Math.ceil(parts.length * 2 / 3)).join(' ')
            ].filter(Boolean).join(', ');
          }
        }
        
        setMainAddress(formattedAddress);
        setTouched(prev => ({ ...prev, mainAddress: true }));
        console.log('주소 입력 필드 업데이트 완료');
      } else {
        // 주소를 얻지 못했지만 위치는 얻은 경우, 좌표만 표시
        const coordsText = `Latitude: ${position.lat.toFixed(5)}, Longitude: ${position.lng.toFixed(5)}`;
        setMainAddress(coordsText);
        setTouched(prev => ({ ...prev, mainAddress: true }));
        setLocationError('Could not find address for your location. Showing coordinates only.');
        console.log('좌표로 주소 필드 업데이트');
      }
    } catch (error) {
      console.error('위치 정보 처리 중 오류:', error);
      
      // 사용자에게 적절한 오류 메시지 표시
      if ((error as GeolocationPositionError)?.code === 1) {
        // 위치 정보 권한 거부
        setLocationError('Location access permission denied. Please allow location access to use this feature.');
      } else if ((error as GeolocationPositionError)?.code === 2) {
        // 위치 정보를 사용할 수 없음
        setLocationError('Location information is unavailable. Please check your internet connection.');
      } else if ((error as GeolocationPositionError)?.code === 3) {
        // 시간 초과
        setLocationError('Location information request timed out. Please try again.');
      } else {
        // 기타 오류
        setLocationError('Error retrieving location information. Please enter your address manually.');
        console.error('상세 오류 정보:', error);
      }
    } finally {
      setIsLoading(false);
      console.log('GPS 위치 정보 요청 완료');
    }
  };

  const handleUploadBooking = () => {
    // 실제 구현에서는 파일 업로드 및 OCR 서비스를 사용하여 이미지에서 주소 추출
    alert("This feature would extract address from a booking confirmation in a real implementation.");
  };

  const handleSaveAddress = () => {
    // 모든 필드를 터치된 상태로 설정 (검증 에러 표시를 위해)
    setTouched({ mainAddress: true, detailAddress: true });

    // GPS로 가져온 주소가 좌표 형식이면 저장 허용
    const isGpsCoordinates = mainAddress.includes('Latitude:') && mainAddress.includes('Longitude:');
    
    // 유효성 검사
    if (!isGpsCoordinates) {
      const mainAddressCheck = validateMainAddress(mainAddress);
      
      if (!mainAddressCheck.isValid) {
        alert(mainAddressCheck.message);
        return;
      }
    }
    
    if (!detailAddress.trim()) {
      alert("Please enter your detail address");
      return;
    }

    // 주소 정보 저장
    setAddress({
      mainAddress: mainAddress.trim(),
      detailAddress: detailAddress.trim(),
      isComplete: true // GPS 좌표 또는 유효한 주소와 상세 주소가 있으면 완료 상태로 간주
    });

    // 홈으로 이동
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with back button */}
      <BackHeader title="Address Setup" />
      
      <div className="flex-1 px-4 py-4 pb-20">
        {/* Main container */}
        <div className="rounded-lg border border-gray-200 p-5 mb-4 bg-white shadow-sm">
          {/* Main Address Section */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="mainAddress" className="text-base font-medium text-gray-700 flex items-center">
                Main Address
                <span className="text-red-500 ml-1">*</span>
              </label>
              
              <button
                type="button"
                onClick={handleUseGPS}
                disabled={isLoading}
                className={`flex items-center justify-center gap-1 py-1.5 px-3 ${
                  isLoading 
                    ? 'bg-gray-200 cursor-not-allowed' 
                    : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 cursor-pointer'
                } rounded-full transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                <span className="text-gray-700">{isLoading ? 'Loading...' : 'Use GPS'}</span>
              </button>
            </div>
            
            <input
              type="text"
              id="mainAddress"
              value={mainAddress}
              onChange={handleMainAddressChange}
              placeholder="Enter your address"
              className={`w-full p-3 border ${
                !touched.mainAddress 
                  ? 'border-gray-300'
                  : isMainAddressValid 
                    ? 'border-green-500' 
                    : 'border-red-500'
              } rounded-lg focus:outline-none focus:ring-1 ${
                isMainAddressValid ? 'focus:ring-green-500 focus:border-green-500' : 'focus:ring-red-500 focus:border-red-500'
              } transition-all duration-150 placeholder-gray-400`}
              aria-invalid={touched.mainAddress && !isMainAddressValid}
            />
            
            {touched.mainAddress && !isMainAddressValid && (
              <div className="mt-1 text-red-500 text-sm">
                {mainAddressValidation.message}
              </div>
            )}
            
            {locationError && (
              <div className="mt-2 text-yellow-600 text-sm flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{locationError}</span>
              </div>
            )}
          </div>
          
          {/* Detail Address Section - Smaller font size and left aligned */}
          <div>
            <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-600 mb-2 text-left flex items-center">
              Detail Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            
            <textarea
              id="detailAddress"
              value={detailAddress}
              onChange={handleDetailAddressChange}
              placeholder="e.g. Room 301, 123 Hongdae-ro"
              className={`w-full p-3 border ${
                !touched.detailAddress 
                  ? 'border-gray-300'
                  : isDetailAddressValid 
                    ? 'border-green-500' 
                    : 'border-red-500'
              } rounded-lg focus:outline-none focus:ring-1 ${
                isDetailAddressValid ? 'focus:ring-green-500 focus:border-green-500' : 'focus:ring-red-500 focus:border-red-500'
              } transition-all duration-150 resize-none h-28 placeholder-gray-400`}
              aria-invalid={touched.detailAddress && !isDetailAddressValid}
            />
            
            {touched.detailAddress && !isDetailAddressValid && (
              <div className="mt-1 text-red-500 text-sm">
                Detail address is required
              </div>
            )}
          </div>
        </div>
        
        {/* Upload Booking Screenshot Section */}
        <div className="rounded-lg border border-gray-200 p-5 mb-6 bg-white shadow-sm">
          <button
            type="button"
            onClick={handleUploadBooking}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 mb-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-base font-medium text-gray-700">Upload Booking Screenshot (OCR)</span>
          </button>
          
          <p className="text-center text-gray-500 text-sm">
            Upload your hotel booking confirmation to extract address automatically
          </p>
        </div>
        
        {/* Save Address Button - Updated to Material Design style */}
        <button
          type="button"
          onClick={handleSaveAddress}
          className={`w-full py-3.5 ${
            isFormValid 
              ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
              : 'bg-red-300 cursor-not-allowed'
          } text-white rounded-lg font-medium transition-all duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2`}
        >
          Save Address
        </button>
      </div>
      
      {/* Navigation Bar */}
      <div className="border-t border-gray-200 bg-white py-2 grid grid-cols-4 fixed bottom-0 w-full shadow-lg">
        <button className="flex flex-col items-center justify-center py-1 focus:outline-none" onClick={() => navigate('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs text-gray-500 mt-1">Home</span>
        </button>
        
        <button className="flex flex-col items-center justify-center py-1 focus:outline-none" onClick={() => navigate('/restaurants')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-xs text-gray-500 mt-1">Browse</span>
        </button>
        
        <button className="flex flex-col items-center justify-center py-1 focus:outline-none" onClick={() => navigate('/address')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs text-red-500 mt-1">Address</span>
        </button>
        
        <button className="flex flex-col items-center justify-center py-1 focus:outline-none" onClick={() => navigate('/cart')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs text-gray-500 mt-1">Cart</span>
        </button>
      </div>
    </div>
  );
};

export default AddressSetupPage; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '../components/BackHeader';
import { useAddress } from '../contexts/AddressContext';
import { getCurrentPosition, reverseGeocode, getIpBasedLocation } from '../services/LocationService';
import { showChannelTalk, trackChannelTalkEvent } from '../services/ChannelService';
import NaverMap from '../components/NaverMap';

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
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  
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

  const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      // 위치 정보 저장
      setCurrentLocation(position);
      
      // 약간의 지연 후 지도 표시
      setTimeout(() => {
        setShowMap(true);
      }, 500);
      
      // OpenStreetMap Nominatim API를 사용하여 좌표를 주소로 변환
      const geoAddress = await reverseGeocode(position.lng, position.lat);
      console.log('변환된 주소:', geoAddress);
      
      if (geoAddress) {
        setMainAddress(geoAddress);
        setTouched(prev => ({ ...prev, mainAddress: true }));
        console.log('주소 입력 필드 업데이트 완료');
      } else {
        // 주소 변환 실패 시 좌표 표시
        setMainAddress(`Latitude: ${position.lat.toFixed(6)}, Longitude: ${position.lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('위치 정보 가져오기 실패:', error);
      setLocationError('위치 정보를 가져오는 데 실패했습니다. 직접 주소를 입력해주세요.');
    } finally {
      setIsLoading(false);
      console.log('GPS 위치 정보 요청 완료');
    }
  };

  // 지도에서 위치가 선택되었을 때 호출되는 핸들러
  const handleLocationSelect = async (location: { lat: number; lng: number }) => {
    console.log('지도에서 위치 선택:', location);
    setCurrentLocation(location);
    
    // 선택된 위치의 주소 변환
    try {
      const geoAddress = await reverseGeocode(location.lng, location.lat);
      
      if (geoAddress) {
        setMainAddress(geoAddress);
      } else {
        const coordsText = `Latitude: ${location.lat.toFixed(5)}, Longitude: ${location.lng.toFixed(5)}`;
        setMainAddress(coordsText);
      }
      
      setTouched(prev => ({ ...prev, mainAddress: true }));
    } catch (error) {
      console.error('선택한 위치의 주소 변환 실패:', error);
      const coordsText = `Latitude: ${location.lat.toFixed(5)}, Longitude: ${location.lng.toFixed(5)}`;
      setMainAddress(coordsText);
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

    // 주소 정보 저장 (위도/경도 정보 추가)
    setAddress({
      mainAddress: mainAddress.trim(),
      detailAddress: detailAddress.trim(),
      isComplete: true,
      ...(currentLocation && { lat: currentLocation.lat, lng: currentLocation.lng })
    });

    // 홈으로 이동
    navigate('/');
  };

  // 채널톡 도움말 열기
  const handleOpenHelp = () => {
    trackChannelTalkEvent('address_help_requested', {
      mainAddress: mainAddress,
      hasDetailAddress: !!detailAddress.trim()
    });
    showChannelTalk();
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
            <label htmlFor="mainAddress" className="text-base font-medium text-gray-700 flex items-center mb-2">
              Main Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            
            <input
              type="text"
              id="mainAddress"
              value={mainAddress}
              onChange={handleMainAddressChange}
              className={`w-full border ${
                touched.mainAddress && !isMainAddressValid && !mainAddress.includes('Latitude:')
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200'
              } rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 transition-all duration-200`}
              placeholder="Enter your address"
            />
            
            {touched.mainAddress && !isMainAddressValid && !mainAddress.includes('Latitude:') && (
              <p className="text-red-500 text-sm mt-1">{mainAddressValidation.message}</p>
            )}
            
            {locationError && (
              <p className="text-amber-600 text-sm mt-1 bg-amber-50 p-2 rounded border border-amber-200">
                {locationError}
              </p>
            )}
          </div>
          
          {/* Detail Address Section */}
          <div className="mb-5">
            <label htmlFor="detailAddress" className="text-base font-medium text-gray-700 flex items-center mb-2">
              Detail Address
              <span className="text-red-500 ml-1">*</span>
            </label>
            
            <input
              type="text"
              id="detailAddress"
              value={detailAddress}
              onChange={handleDetailAddressChange}
              className={`w-full border ${
                touched.detailAddress && !isDetailAddressValid
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200'
              } rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 transition-all duration-200`}
              placeholder="Enter apartment number, building name, floor, etc."
            />
            
            {touched.detailAddress && !isDetailAddressValid && (
              <p className="text-red-500 text-sm mt-1">Detail address is required</p>
            )}
          </div>
          
          {/* Use GPS Button */}
          <div className="mb-5">
            <button
              type="button"
              onClick={handleUseGPS}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-1 py-3 rounded-lg ${
                isLoading 
                  ? 'bg-gray-200 cursor-not-allowed' 
                  : 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 cursor-pointer'
              } transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300`}
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
          
          {/* 지도 표시 */}
          {showMap && currentLocation && (
            <div className="mb-5">
              <div className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
                <div className="relative" style={{ minHeight: '300px' }}>
                  <NaverMap
                    initialCenter={currentLocation}
                    onLocationSelect={handleLocationSelect}
                    height="300px"
                    zoom={17}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* 대체 주소 입력 방법 
          <div className="flex flex-col mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 text-sm">Or enter address using:</span>
            </div>
            <button
              type="button"
              onClick={handleUploadBooking}
              className="w-full flex justify-center items-center gap-2 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload Booking Confirmation</span>
            </button>
          </div> */}
          
          {/* 저장 버튼 */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSaveAddress}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                isLoading || (!isFormValid && touched.mainAddress && touched.detailAddress && !mainAddress.includes('Latitude:'))
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              } transition-all duration-150 shadow-sm`}
            >
              Save Address
            </button>
          </div>
          
          {/* Help link */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleOpenHelp}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
            >
              Need help with your address?
            </button>
          </div>
        </div>
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
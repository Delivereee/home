// 위치 정보와 관련된 API 서비스
interface Location {
  lng: number;
  lat: number;
}

// Nominatim API 응답 타입
interface NominatimReverseResponse {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

// 네이버 API 관련 인터페이스 (참조용으로 유지)
interface NaverReverseGeoResult {
  name: string;
  region: {
    area0: { name: string };
    area1: { name: string; alias?: string };
    area2: { name: string };
    area3: { name: string };
    area4: { name: string };
  };
  land?: {
    name?: string;
    number1?: string;
    number2?: string;
  };
}

interface NaverReverseGeoResponse {
  status: {
    code: number;
    name: string;
    message: string;
  };
  results: NaverReverseGeoResult[];
}

// 네이버 API 키 (참조용으로 유지)
const NAVER_API_KEY_ID = 'sjwtteaf8b';
const NAVER_API_KEY = '17oXuPH6IBiBfifTIGdEcLc4D2PlkMNjXNU18KAN';

/**
 * OpenStreetMap Nominatim API를 사용하여 좌표를 주소로 변환
 */
export const reverseGeocode = async (lng: number, lat: number): Promise<string | null> => {
  try {
    console.log(`역지오코딩 시작: 경도=${lng}, 위도=${lat}`);
    
    // Nominatim API 호출 URL 구성 (CORS 문제 없음)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    console.log('API 요청 URL:', url);
    
    // API 호출 시 언어를 영어로 설정하여 영문 주소 요청
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en', // 영어 응답 요청
        'User-Agent': 'DeliverEatsEasy/1.0' // 앱 식별자 (필수)
      }
    });
    
    console.log('API 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status} ${response.statusText}`);
    }
    
    const data: NominatimReverseResponse = await response.json();
    console.log('Nominatim API 응답 데이터:', data);
    
    // 영문 주소 형식으로 포맷팅
    if (data.address) {
      const addr = data.address;
      
      // "번지, 도로명, 구, 시, 국가" 형태로 포맷팅
      const formattedParts = [];
      
      // 번지(건물번호)와 도로명
      if (addr.house_number && addr.road) {
        formattedParts.push(`${addr.house_number}, ${addr.road}`);
      } else if (addr.road) {
        formattedParts.push(addr.road);
      } else if (addr.house_number) {
        formattedParts.push(addr.house_number);
      }
      
      // 동네/지역
      if (addr.suburb || addr.neighbourhood) {
        formattedParts.push(addr.suburb || addr.neighbourhood);
      }
      
      // 구
      if (addr.county) {
        formattedParts.push(addr.county);
      }
      
      // 시/도
      if (addr.city || addr.town) {
        formattedParts.push(addr.city || addr.town);
      } else if (addr.state) {
        formattedParts.push(addr.state);
      }
      
      // 국가
      if (addr.country) {
        formattedParts.push(addr.country);
      }
      
      // 요소들을 결합하여 형식에 맞는 주소 생성
      let formattedAddress = formattedParts.filter(Boolean).join(', ');
      
      // 포맷팅된 부분이 없으면 전체 display_name 사용
      if (!formattedAddress && data.display_name) {
        formattedAddress = data.display_name;
      }
      
      console.log('변환된 주소:', formattedAddress);
      return formattedAddress;
    }
    
    // 주소 정보가 없으면 좌표 반환
    return `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;
  } catch (error) {
    console.error('역지오코딩에 실패했습니다:', error);
    
    // IP 기반 대략적 위치 정보 시도 (fallback)
    try {
      console.log('IP 기반 위치 정보 시도...');
      const ipLocUrl = 'https://ipapi.co/json/';
      const ipLocResponse = await fetch(ipLocUrl);
      
      if (ipLocResponse.ok) {
        const ipData = await ipLocResponse.json();
        return `${ipData.city}, ${ipData.region}, ${ipData.country_name} (Based on IP)`;
      }
    } catch (ipError) {
      console.error('IP 기반 위치 정보 실패:', ipError);
    }
    
    // 모든 시도 실패 시 좌표만 반환
    return `Latitude: ${lat.toFixed(5)}, Longitude: ${lng.toFixed(5)}`;
  }
};

/**
 * 브라우저의 Geolocation API를 사용하여 정확한 위치를 가져오는 함수
 */
export const getCurrentPosition = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('현재 위치 정보 취득 성공:', location);
        resolve(location);
      },
      (error) => {
        console.error('현재 위치 정보 취득 실패:', error);
        reject(error);
      },
      { 
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

// 예비: IP 기반 대략적 위치 정보 가져오기 (Geolocation이 실패할 경우)
export const getIpBasedLocation = async (): Promise<Location | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('IP 위치 정보 서비스 오류');
    }
    
    const data = await response.json();
    return {
      lat: data.latitude,
      lng: data.longitude
    };
  } catch (error) {
    console.error('IP 기반 위치 정보 취득 실패:', error);
    return null;
  }
}; 
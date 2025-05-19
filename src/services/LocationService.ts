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
const NAVER_API_KEY_ID = 't9urh3v0l9';
const NAVER_API_KEY = 'uF1arW1RxI9MREhrfQpgfYwmHyoYHR4LE1heWfUz';

/**
 * OpenStreetMap Nominatim API를 사용하여 좌표를 주소로 변환
 */
export const reverseGeocode = async (lng: number, lat: number): Promise<string | null> => {
  try {
    // console.log(`역지오코딩 시작: 경도=${lng}, 위도=${lat}`);
    
    // OpenStreetMap Nominatim API 사용
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    // console.log('API 요청 URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en,en-US;q=0.9,ko;q=0.8',
        'User-Agent': 'Delivereee App (https://delivereee.github.io)'
      }
    });
    
    // console.log('API 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('역지오코딩 API 호출 실패:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    // console.log('Nominatim API 응답 데이터:', data);
    
    // Nominatim API 응답에서 주소 조합
    if (data && data.address) {
      const addr = data.address;
      let formattedAddress = '';
      
      // 미국 형식 주소
      if (addr.country_code === 'us') {
        // 주소 구성요소를 미국 형식으로 조합 (상세 -> 도시 -> 주 -> 우편번호)
        const parts = [];
        
        // 상세 주소 (번지, 거리명)
        if (addr.house_number) parts.push(addr.house_number);
        if (addr.road) parts.push(addr.road);
        
        // 지역/도시
        if (addr.suburb) parts.push(addr.suburb);
        if (addr.city || addr.town || addr.village) {
          const city = addr.city || addr.town || addr.village;
          parts.push(city);
        }
        
        // 주/지역
        if (addr.state) parts.push(addr.state);
        
        // 우편번호
        if (addr.postcode) parts.push(addr.postcode);
        
        // 국가
        if (addr.country) parts.push(addr.country);
        
        formattedAddress = parts.join(', ');
      } 
      // 한국 형식 주소
      else if (addr.country_code === 'kr') {
        // 한국 주소 형식으로 조합 (도/시 -> 구/군 -> 동/읍/면 -> 상세)
        const parts = [];
        
        // 국가
        if (addr.country) parts.push(addr.country);
        
        // 도/시
        if (addr.state) parts.push(addr.state);
        
        // 구/군/시
        if (addr.county) parts.push(addr.county);
        if (addr.city) parts.push(addr.city);
        
        // 동/읍/면
        if (addr.suburb) parts.push(addr.suburb);
        if (addr.neighbourhood) parts.push(addr.neighbourhood);
        
        // 상세 주소 (도로명)
        if (addr.road) parts.push(addr.road);
        if (addr.house_number) parts.push(addr.house_number);
        
        // 우편번호 표기 생략
        
        formattedAddress = parts.join(' ');
      }
      // 기타 국가 (일반적인 형식)
      else {
        const parts = [];
        
        // 상세 주소 (번지, 거리명)
        if (addr.house_number) parts.push(addr.house_number);
        if (addr.road) parts.push(addr.road);
        
        // 지역/도시
        if (addr.suburb) parts.push(addr.suburb);
        if (addr.city || addr.town || addr.village) {
          parts.push(addr.city || addr.town || addr.village);
        }
        
        // 주/지역 및 국가
        if (addr.state) parts.push(addr.state);
        if (addr.country) parts.push(addr.country);
        
        formattedAddress = parts.join(', ');
      }
      
      // console.log('변환된 주소:', formattedAddress);
      return formattedAddress;
    }
    
    return null;
  } catch (error) {
    console.error('역지오코딩에 실패했습니다:', error);
    
    // IP 기반 위치 정보 시도 - 좌표->주소 변환 실패 시 코백 메커니즘
    // console.log('IP 기반 위치 정보 시도...');
    try {
      const ipLocation = await getIpBasedLocation();
      if (ipLocation) {
        return `Near ${ipLocation.city || 'current location'}, ${ipLocation.region || ''}, ${ipLocation.country || ''}`;
      }
    } catch (ipError) {
      console.error('IP 기반 위치 정보 실패:', ipError);
    }
    
    return null;
  }
};

/**
 * 브라우저의 Geolocation API를 사용하여 정확한 위치를 가져오는 함수
 */
export const getCurrentPosition = (): Promise<{ lat: number; lng: number }> => {
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
        // console.log('현재 위치 정보 취득 성공:', location);
        resolve(location);
      },
      (error) => {
        console.error('현재 위치 정보 취득 실패:', error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// 예비: IP 기반 대략적 위치 정보 가져오기 (Geolocation이 실패할 경우)
export const getIpBasedLocation = async (): Promise<{ lat: number; lng: number; city?: string; region?: string; country?: string } | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error(`IP 기반 위치 정보 API 오류: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      return {
        lat: data.latitude,
        lng: data.longitude,
        city: data.city,
        region: data.region,
        country: data.country_name
      };
    }
    
    return null;
  } catch (error) {
    console.error('IP 기반 위치 정보 취득 실패:', error);
    return null;
  }
}; 
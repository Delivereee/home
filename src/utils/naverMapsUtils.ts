import { initNaverMaps } from './naverMapsLoader';

/**
 * 네이버 맵스 역지오코딩 (좌표 -> 주소 변환)
 * @param lat 위도
 * @param lng 경도
 * @returns 변환된 주소
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    // 네이버 맵스 SDK 로드 확인
    const isLoaded = await initNaverMaps();
    if (!isLoaded) {
      console.error('네이버 맵스 SDK 로드 실패');
      throw new Error('Failed to load Naver Maps SDK');
    }

    console.log('Naver SDK 상태:', {
      naverExists: typeof window.naver !== 'undefined',
      mapsExists: typeof window.naver !== 'undefined' && window.naver.maps !== undefined,
      geocoderExists: typeof window.naver !== 'undefined' && (window.naver as any).geocoder !== undefined
    });

    // 역지오코딩 모듈 로드 확인
    if (!(window.naver as any).geocoder) {
      console.warn('Naver Maps geocoder module is not loaded');
      return `좌표: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    return new Promise<string | null>((resolve, reject) => {
      (window.naver as any).geocoder.reverseGeocode(
        {
          coords: { lat, lng },  // 직접 CoordLiteral 객체 생성
          orders: ['roadaddr', 'addr', 'admcode']
        },
        (status: string, response: any) => {
          if (status !== 'OK') {
            console.error('Geocoding failed:', status);
            reject(new Error(`Geocoding failed: ${status}`));
            return;
          }

          if (response.v === 2 && response.results && response.results.length > 0) {
            let address = '';
            
            // 도로명 주소 시도
            const roadAddr = response.results.find((result: any) => result.name === 'roadaddr');
            if (roadAddr) {
              const region = roadAddr.region;
              address = `${region.area1.name} ${region.area2.name} ${region.area3.name}`;
              if (region.area4.name) {
                address += ` ${region.area4.name}`;
              }
              
              if (roadAddr.land) {
                if (roadAddr.land.name) {
                  address += ` ${roadAddr.land.name}`;
                }
                
                if (roadAddr.land.number1) {
                  address += ` ${roadAddr.land.number1}`;
                  if (roadAddr.land.number2) {
                    address += `-${roadAddr.land.number2}`;
                  }
                }
              }
              
              resolve(address.trim());
              return;
            }
            
            // 지번 주소 시도
            const jibunAddr = response.results.find((result: any) => result.name === 'addr');
            if (jibunAddr) {
              const region = jibunAddr.region;
              address = `${region.area1.name} ${region.area2.name} ${region.area3.name}`;
              if (region.area4.name) {
                address += ` ${region.area4.name}`;
              }
              
              if (jibunAddr.land) {
                if (jibunAddr.land.number1) {
                  address += ` ${jibunAddr.land.number1}`;
                  if (jibunAddr.land.number2) {
                    address += `-${jibunAddr.land.number2}`;
                  }
                }
              }
              
              resolve(address.trim());
              return;
            }
            
            // 행정동/법정동 정보만 있는 경우
            const admcode = response.results.find((result: any) => result.name === 'admcode');
            if (admcode) {
              const region = admcode.region;
              address = `${region.area1.name} ${region.area2.name} ${region.area3.name}`;
              resolve(address.trim());
              return;
            }
          }
          
          resolve(null);
        }
      );
    });
  } catch (error) {
    console.error('Error in reverseGeocode:', error);
    return null;
  }
};

/**
 * 주소를 포맷팅하는 함수 (한국 주소 형식)
 * @param address 주소
 * @returns 포맷팅된 주소
 */
export const formatKoreanAddress = (address: string): string => {
  // 이미 쉼표가 있다면 반환
  if (address.includes(',')) {
    return address;
  }
  
  // 공백으로 주소 분할
  const parts = address.split(' ').filter(Boolean);
  
  // 충분한 길이의 주소 요소가 있으면 포맷팅
  if (parts.length >= 3) {
    // 주소 분할 및 쉼표 추가
    const city = parts.slice(0, 1).join(' '); // 시/도
    const district = parts.slice(1, 2).join(' '); // 구/군
    const rest = parts.slice(2).join(' '); // 나머지 주소
    
    return `${city}, ${district}, ${rest}`;
  }
  
  return address;
}; 
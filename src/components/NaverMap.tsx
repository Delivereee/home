import React, { useEffect, useRef, useState } from 'react';

interface NaverMapProps {
  initialCenter?: { lat: number; lng: number };
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  width?: string | number;
  height?: string | number;
  zoom?: number;
  draggable?: boolean;
  markerDraggable?: boolean;
}

const NaverMap: React.FC<NaverMapProps> = ({
  initialCenter = { lat: 37.5665, lng: 126.9780 }, // 서울시청 기본 좌표
  onLocationSelect,
  width = '100%',
  height = '300px',
  zoom = 15,
  draggable = true,
  markerDraggable = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const clickListenerRef = useRef<any>(null);
  const markerDragListenerRef = useRef<any>(null);

  // 디버그 정보 출력 - 현재 URL 및 포트 확인
  useEffect(() => {
    // 디버그 로그 제거
  }, []);

  // 네이버 맵 스크립트 로드 확인
  useEffect(() => {
    let checkCount = 0;
    const maxChecks = 50;
    
    const checkNaverMapLoaded = () => {
      // 네이버 객체 상태 확인을 위한 디버그 출력 제거
      if (typeof window.naver !== 'undefined' && 
          window.naver.maps !== undefined && 
          window.naver.maps.Map !== undefined) {
        setIsScriptLoaded(true);
        return;
      }
      
      checkCount++;
      if (checkCount < maxChecks) {
        setTimeout(checkNaverMapLoaded, 100);
      } else {
        console.error('Naver 맵 스크립트 로딩 타임아웃');
        setMapError('네이버 맵스 SDK를 로드하지 못했습니다.');
      }
    };
    
    checkNaverMapLoaded();
    
    return () => {
      checkCount = maxChecks; // 정리 함수에서 타이머 중지
    };
  }, []);

  // 맵 초기화 - 스크립트가 로드된 후에만 실행
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current) return;
    
    // 맵 생성 전 인증 상태 확인
    try {
      const naverAvailable = typeof window.naver !== 'undefined' && window.naver.maps !== undefined;
    } catch (error) {
      console.error('인증 상태 확인 중 오류:', error);
    }
    
    let map: any = null;
    let mapMarker: any = null;

    try {
      // 지도 생성
      map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        zoom: zoom,
        draggable: draggable,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT
        }
      });
      
      // 마커 생성
      mapMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        map: map,
        draggable: markerDraggable,
        language: 'en' // 영어로 설정
      });
      
      // 마커 드래그 이벤트
      if (markerDraggable && onLocationSelect) {
        markerDragListenerRef.current = window.naver.maps.Event.addListener(mapMarker, 'dragend', () => {
          try {
            const position = mapMarker.getPosition();
            if (position) {
              const location = {
                lat: position.lat(),
                lng: position.lng()
              };
              onLocationSelect(location);
            }
          } catch (error) {
            console.error('마커 드래그 이벤트 처리 중 오류:', error);
          }
        });
      }
      
      // 지도 클릭 이벤트
      clickListenerRef.current = window.naver.maps.Event.addListener(map, 'click', (e: any) => {
        try {
          if (!mapMarker) return;
          
          const clickedPos = e.coord;
          
          mapMarker.setPosition(clickedPos);
          
          if (onLocationSelect) {
            onLocationSelect({
              lat: clickedPos.lat(),
              lng: clickedPos.lng()
            });
          }
        } catch (error) {
          console.error('지도 클릭 이벤트 처리 중 오류:', error);
        }
      });
      
      setMapInstance(map);
      setMarker(mapMarker);
    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error);
      setMapError('지도를 초기화하는 중 오류가 발생했습니다.');
    }
    
    // 컴포넌트 언마운트 시 정리 작업
    return () => {
      try {
        // 이벤트 리스너 제거
        if (clickListenerRef.current && window.naver && window.naver.maps && window.naver.maps.Event) {
          try {
            window.naver.maps.Event.removeListener(clickListenerRef.current);
          } catch (error) {
            console.error('클릭 이벤트 리스너 제거 중 오류:', error);
          }
          clickListenerRef.current = null;
        }
        
        if (markerDragListenerRef.current && window.naver && window.naver.maps && window.naver.maps.Event) {
          try {
            window.naver.maps.Event.removeListener(markerDragListenerRef.current);
          } catch (error) {
            console.error('마커 드래그 이벤트 리스너 제거 중 오류:', error);
          }
          markerDragListenerRef.current = null;
        }
        
        // 마커 제거
        if (mapMarker) {
          try {
            mapMarker.setMap(null);
          } catch (error) {
            console.error('마커 제거 중 오류:', error);
          }
        }
        
        // 맵 제거 - null 체크 추가
        if (map && window.naver && window.naver.maps) {
          try {
            // 맵에 연결된 모든 이벤트 리스너 제거 시도
            if (window.naver.maps.Event) {
              window.naver.maps.Event.clearListeners(map);
            }
            
            // destroy 호출 전 상태 검증
            if (typeof map.destroy === 'function') {
              map.destroy();
            }
          } catch (error) {
            console.error('지도 정리 중 오류 발생:', error);
          }
        }
      } catch (e) {
        console.error('이벤트 리스너 정리 중 오류 발생:', e);
      }
    };
  }, [initialCenter, zoom, draggable, markerDraggable, onLocationSelect, isScriptLoaded]);

  // initialCenter가 변경된 경우 지도와 마커 위치 업데이트
  useEffect(() => {
    if (!isScriptLoaded) return;
    
    if (mapInstance && marker && window.naver) {
      try {
        const position = new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng);
        mapInstance.setCenter(position);
        marker.setPosition(position);
      } catch (error) {
        console.error('지도 중심 업데이트 중 오류:', error);
      }
    }
  }, [initialCenter, mapInstance, marker, isScriptLoaded]);

  // 에러 상태 또는 로딩 상태
  if (mapError) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          color: '#e53935'
        }}
      >
        <p>{mapError}</p>
      </div>
    );
  }
  
  if (!isScriptLoaded) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '8px'
        }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p className="text-gray-600">지도를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{ width, height, borderRadius: '8px', overflow: 'hidden' }}
      className="relative border border-gray-300 shadow-sm"
    >
      <div className="absolute bottom-2 right-2 bg-white py-1 px-2 rounded text-xs text-gray-500 shadow-sm z-10">
        © Naver Maps
      </div>
    </div>
  );
};

export default NaverMap; 
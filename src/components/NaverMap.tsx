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
  const clickListenerRef = useRef<any>(null);
  const markerDragListenerRef = useRef<any>(null);

  // 맵 초기화
  useEffect(() => {
    // DOM 요소가 없으면 초기화하지 않음
    if (!mapRef.current) return;

    // naver 객체가 없으면 에러 표시
    if (typeof window.naver === 'undefined' || !window.naver.maps) {
      console.error('Naver 객체가 존재하지 않습니다. 네이버 맵 스크립트가 로드되었는지 확인하세요.');
      setMapError('네이버 맵스 SDK를 로드하지 못했습니다.');
      return;
    }

    let map: any = null;
    let mapMarker: any = null;

    try {
      console.log('지도 생성 시작:', initialCenter);

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
      
      console.log('지도 생성 완료');
      
      // 마커 생성
      mapMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
        map: map,
        draggable: markerDraggable,
      });
      
      console.log('마커 생성 완료');
      
      // 마커 드래그 이벤트
      if (markerDraggable && onLocationSelect) {
        markerDragListenerRef.current = window.naver.maps.Event.addListener(mapMarker, 'dragend', () => {
          const position = mapMarker.getPosition();
          const location = {
            lat: position.lat(),
            lng: position.lng()
          };
          console.log('마커 드래그:', location);
          onLocationSelect(location);
        });
      }
      
      // 지도 클릭 이벤트
      clickListenerRef.current = window.naver.maps.Event.addListener(map, 'click', (e: any) => {
        if (!mapMarker) return;
        
        const clickedPos = e.coord;
        console.log('지도 클릭:', {
          lat: clickedPos.lat(),
          lng: clickedPos.lng()
        });
        
        mapMarker.setPosition(clickedPos);
        
        if (onLocationSelect) {
          onLocationSelect({
            lat: clickedPos.lat(),
            lng: clickedPos.lng()
          });
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
      // 이벤트 리스너 제거
      try {
        if (clickListenerRef.current && window.naver && window.naver.maps) {
          window.naver.maps.Event.removeListener(clickListenerRef.current);
          clickListenerRef.current = null;
        }
        
        if (markerDragListenerRef.current && window.naver && window.naver.maps) {
          window.naver.maps.Event.removeListener(markerDragListenerRef.current);
          markerDragListenerRef.current = null;
        }
        
        // 마커 제거
        if (mapMarker) {
          mapMarker.setMap(null);
        }
        
        // 맵 제거 - 맵 인스턴스가 있을 때만 수행
        if (map) {
          try {
            // 명시적으로 모든 이벤트 리스너 제거 시도
            if (window.naver && window.naver.maps && window.naver.maps.Event) {
              window.naver.maps.Event.clearListeners(map);
            }
            map.destroy();
          } catch (error) {
            console.error('지도 정리 중 오류 발생:', error);
          }
        }
      } catch (e) {
        console.error('이벤트 리스너 정리 중 오류 발생:', e);
      }
    };
  }, [initialCenter, zoom, draggable, markerDraggable, onLocationSelect]);

  // initialCenter가 변경된 경우 지도와 마커 위치 업데이트
  useEffect(() => {
    if (mapInstance && marker && window.naver) {
      try {
        const position = new window.naver.maps.LatLng(initialCenter.lat, initialCenter.lng);
        mapInstance.setCenter(position);
        marker.setPosition(position);
      } catch (error) {
        console.error('지도 중심 업데이트 중 오류:', error);
      }
    }
  }, [initialCenter, mapInstance, marker]);

  // 에러 상태
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
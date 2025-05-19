import React, { useEffect, useRef, useState } from 'react';
import { initNaverMaps } from '../utils/naverMapsLoader';

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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // 맵 초기화
  useEffect(() => {
    let isMounted = true;
    
    const initMap = async () => {
      try {
        if (!mapRef.current) return;
        
        // SDK 로드
        const isSDKLoaded = await initNaverMaps();
        if (!isSDKLoaded) {
          setMapError('네이버 맵스 SDK를 로드하지 못했습니다.');
          return;
        }
        
        if (!isMounted) return;
        
        // naver 객체 사용 가능 여부 다시 확인
        if (!window.naver || !window.naver.maps) {
          console.error('Naver Maps 객체가 로드되지 않았습니다');
          setMapError('네이버 맵스가 정상적으로 로드되지 않았습니다.');
          return;
        }

        console.log('지도 생성 시작:', {
          ref: mapRef.current,
          naverExists: !!window.naver,
          mapsExists: !!(window.naver && window.naver.maps)
        });
        
        // naver 객체를 any로 캐스팅
        const naverMaps = (window.naver as any).maps;
        
        // 지도 생성
        const map = new naverMaps.Map(mapRef.current, {
          center: new naverMaps.LatLng(initialCenter.lat, initialCenter.lng),
          zoom: zoom,
          draggable: draggable,
          zoomControl: true,
          zoomControlOptions: {
            position: 'TOP_RIGHT'
          }
        });
        
        // 마커 생성
        const mapMarker = new naverMaps.Marker({
          position: new naverMaps.LatLng(initialCenter.lat, initialCenter.lng),
          map: map,
          draggable: markerDraggable,
        });
        
        // 마커 드래그 이벤트
        if (markerDraggable && onLocationSelect) {
          naverMaps.Event.addListener(mapMarker, 'dragend', () => {
            const position = mapMarker.getPosition();
            onLocationSelect({
              lat: position.lat(),
              lng: position.lng()
            });
          });
        }
        
        // 지도 클릭 이벤트
        naverMaps.Event.addListener(map, 'click', (e: any) => {
          if (!mapMarker) return;
          
          const clickedPos = e.coord;
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
        setMapLoaded(true);
      } catch (error) {
        console.error('Failed to initialize Naver Map:', error);
        if (isMounted) {
          setMapError('지도를 초기화하는 중 오류가 발생했습니다.');
        }
      }
    };

    initMap();
    
    return () => {
      isMounted = false;
      if (mapInstance) {
        // 지도 인스턴스 정리
        mapInstance.destroy();
      }
    };
  }, [initialCenter, zoom, draggable, markerDraggable, onLocationSelect]);

  // initialCenter가 변경된 경우 지도와 마커 위치 업데이트
  useEffect(() => {
    if (mapInstance && marker && window.naver) {
      const naverMaps = (window.naver as any).maps;
      const position = new naverMaps.LatLng(initialCenter.lat, initialCenter.lng);
      mapInstance.setCenter(position);
      marker.setPosition(position);
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

  // 로딩 상태
  if (!mapLoaded) {
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
          borderRadius: '8px'
        }}
      >
        <div className="animate-spin h-8 w-8 border-2 border-gray-500 rounded-full border-t-transparent"></div>
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
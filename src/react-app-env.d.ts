/// <reference types="react-scripts" />

// 전역 타입 정의
interface Window {
  // 네이버 맵 타입 정의
  naver: {
    maps: {
      Map: any;
      Marker: any;
      LatLng: any;
      Event: any;
      Point: any;
      Size: any;
      [key: string]: any;
    };
    [key: string]: any;
  } | undefined;
  
  // 채널톡 타입 정의
  ChannelIO?: ((command: string, ...args: any[]) => void) & {
    q?: any[];
    c?: (args: any[]) => void;
  };
  ChannelIOInitialized?: boolean;
}

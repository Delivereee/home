// 채널톡 타입 정의
// Window 인터페이스는 react-app-env.d.ts에서 정의됨

// 채널톡 설정 인터페이스
export interface ChannelIOSettings {
  pluginKey: string;
  accessSecret: string;
  memberId?: string;
  profile?: ChannelIOUserInfo;
  hideDefaultLauncher?: boolean;
  hideChannelButtonOnBoot?: boolean;
  customLauncherSelector?: string;
  mobileMessengerMode?: 'full' | 'slideup';
  language?: string;
  unsubscribeEmail?: boolean;
  unsubscribeTexting?: boolean;
  trackDefaultEvent?: boolean;
  trackUtmSource?: boolean;
  trackUtmMedium?: boolean;
  trackUtmCampaign?: boolean;
  trackUtmTerm?: boolean;
  trackUtmContent?: boolean;
  trackClickEvent?: boolean;
  zIndex?: number;
}

// 사용자 정보 인터페이스
export interface ChannelIOUserInfo {
  name?: string;
  mobileNumber?: string;
  avatarUrl?: string;
  email?: string;
  [key: string]: any;
}

// 채널톡 플러그인 키와 액세스 시크릿
const CHANNEL_IO_PLUGIN_KEY = '4de468b6-e6bf-4446-a6d0-fb3ccb1132a6';
const CHANNEL_IO_ACCESS_SECRET = '20157795b28f1efefb6415a2686cca15';

/**
 * 채널톡 초기화
 * @param settings 채널톡 설정
 */
export const bootChannelTalk = (settings?: Partial<ChannelIOSettings>) => {
  if (!window.ChannelIO) {
    console.error('ChannelIO is not loaded yet');
    return;
  }

  // 기본 설정과 사용자 설정 병합
  const defaultSettings: ChannelIOSettings = {
    pluginKey: CHANNEL_IO_PLUGIN_KEY,
    accessSecret: CHANNEL_IO_ACCESS_SECRET, // 액세스 시크릿 추가
    language: 'en', // 영어로 변경 (이전: 'ko')
    mobileMessengerMode: 'slideup',
    // 하단 중앙에 위치하도록 커스텀 CSS 설정
    customLauncherSelector: '#custom-channel-button',
    hideDefaultLauncher: true,
    // 채널톡 버튼의 z-index를 높게 설정하여 다른 요소보다 앞에 보이도록 함
    zIndex: 10000
  };

  const bootSettings = {
    ...defaultSettings,
    ...settings
  };

  try {
    // 채널톡 초기화
    window.ChannelIO('boot', bootSettings);
    console.log('ChannelTalk booted with settings:', bootSettings);
    
    // 커스텀 채널톡 버튼 생성 및 스타일링
    setTimeout(() => {
      createCustomChannelButton();
    }, 1000); // 채널톡 로드 후 약간의 지연 시간을 두고 커스텀 버튼 생성
  } catch (error) {
    console.error('Failed to boot ChannelTalk:', error);
  }
};

/**
 * 채널톡 종료
 */
export const shutdownChannelTalk = () => {
  if (window.ChannelIO) {
    try {
      window.ChannelIO('shutdown');
      console.log('ChannelTalk shutdown');
    } catch (error) {
      console.error('Failed to shutdown ChannelTalk:', error);
    }
  }
};

/**
 * 채널톡 메신저 표시
 */
export const showChannelTalk = () => {
  if (window.ChannelIO) {
    try {
      window.ChannelIO('showMessenger');
    } catch (error) {
      console.error('Failed to show ChannelTalk messenger:', error);
    }
  }
};

/**
 * 채널톡 메신저 숨기기
 */
export const hideChannelTalk = () => {
  if (window.ChannelIO) {
    try {
      window.ChannelIO('hideMessenger');
    } catch (error) {
      console.error('Failed to hide ChannelTalk messenger:', error);
    }
  }
};

/**
 * 특정 이벤트 추적
 * @param event 이벤트 이름
 * @param params 이벤트 파라미터
 */
export const trackChannelTalkEvent = (event: string, params?: any) => {
  if (window.ChannelIO) {
    try {
      window.ChannelIO('track', event, params);
      console.log(`ChannelTalk tracked event: ${event}`, params || '');
    } catch (error) {
      console.error('Failed to track ChannelTalk event:', error);
    }
  }
};

/**
 * 사용자 정보 업데이트
 * @param userInfo 사용자 정보
 */
export const updateChannelTalkUser = (userInfo: ChannelIOUserInfo) => {
  if (window.ChannelIO) {
    try {
      window.ChannelIO('updateUser', userInfo);
      console.log('ChannelTalk user updated:', userInfo);
    } catch (error) {
      console.error('Failed to update ChannelTalk user:', error);
    }
  }
};

/**
 * 현재 페이지 설정
 * @param pageName 페이지 이름
 */
export const setChannelTalkPage = (pageName: string) => {
  if (window.ChannelIO) {
    try {
      // 직접 호출 방식 사용
      window.ChannelIO('setPage', pageName);
      console.log(`ChannelTalk page set to: ${pageName}`);
    } catch (error) {
      console.error('Failed to set ChannelTalk page:', error);
    }
  }
};

/**
 * 커스텀 채널톡 버튼 생성
 * 화면 하단에 고정된 채팅 버튼을 생성합니다.
 */
const createCustomChannelButton = () => {
  // 이미 존재하는 버튼이 있으면 제거
  const existingButton = document.getElementById('custom-channel-button');
  if (existingButton) {
    existingButton.remove();
  }
  
  // 새 버튼 생성
  const button = document.createElement('button');
  button.id = 'custom-channel-button';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <path d="M8 10h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M16 10h.01"></path>
    </svg>
  `;
  
  // 버튼 스타일 지정
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '80px', // 네비게이션 바 위에 위치하도록 조정 (이전 70px)
    left: 'auto',
    right: '20px', // 오른쪽 하단에 배치
    transform: 'none', // 중앙 정렬 제거
    backgroundColor: '#FF3B30', // 앱 테마 색상에 맞춤
    color: 'white',
    border: 'none',
    borderRadius: '50%', // 원형 버튼으로 변경
    width: '50px',       // 고정 너비
    height: '50px',      // 고정 높이
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)', // 그림자 강화
    zIndex: '1000',
    cursor: 'pointer',
    transition: 'all 0.2s ease' // 호버 효과를 위한 트랜지션 추가
  });
  
  // 호버 효과 추가
  button.addEventListener('mouseenter', () => {
    Object.assign(button.style, {
      backgroundColor: '#E02D1F', // 약간 어두운 색상
      boxShadow: '0 6px 16px rgba(255, 59, 48, 0.4)' // 그림자 강화
    });
  });
  
  button.addEventListener('mouseleave', () => {
    Object.assign(button.style, {
      backgroundColor: '#FF3B30', // 원래 색상으로 복원
      boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)' // 원래 그림자로 복원
    });
  });
  
  // 클릭 이벤트: 채널톡 메신저 열기
  button.addEventListener('click', () => {
    if (window.ChannelIO) {
      try {
        window.ChannelIO('showMessenger');
        
        // 이벤트 추적
        trackChannelTalkEvent('help_button_clicked', {
          page: window.location.pathname
        });
      } catch (error) {
        console.error('Failed to open ChannelTalk messenger:', error);
      }
    }
  });
  
  // 문서에 버튼 추가
  document.body.appendChild(button);
}; 
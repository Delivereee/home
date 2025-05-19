import { SupportedLanguage } from './languageConfig';

// 다국어 텍스트 인터페이스
interface TranslationItem {
  en: string;
  ko?: string;
  ja?: string;
  'zh-CN'?: string;
  'zh-TW'?: string;
}

// 웹사이트 전체 번역 사전
const translations: Record<string, TranslationItem> = {
  // 공통 텍스트
  'app.name': {
    en: 'Deliver Eats Easy',
    ko: 'Deliver Eats Easy',
    ja: 'Deliver Eats Easy',
    'zh-CN': 'Deliver Eats Easy',
    'zh-TW': 'Deliver Eats Easy'
  },
  'app.tagline': {
    en: 'Food delivery made easy',
    ko: '간편한 음식 배달',
    ja: '簡単なフードデリバリー',
    'zh-CN': '简单的食品外送',
    'zh-TW': '簡單的食品外送'
  },
  
  // 헤더
  'header.setAddress': {
    en: 'Set Your Address',
    ko: '주소 설정하기',
    ja: '住所を設定する',
    'zh-CN': '设置您的地址',
    'zh-TW': '設置您的地址'
  },
  'header.allSet': {
    en: "You're all set - Start your order!",
    ko: '모든 준비 완료 - 주문을 시작하세요!',
    ja: '準備完了 - 注文を始めましょう！',
    'zh-CN': '一切就绪 - 开始订购！',
    'zh-TW': '一切就緒 - 開始訂購！'
  },
  'header.addressNotSet': {
    en: 'Full address not set (Tap to enter)',
    ko: '전체 주소가 설정되지 않았습니다 (탭하여 입력)',
    ja: '住所が完全に設定されていません（タップして入力）',
    'zh-CN': '地址未完全设置（点击输入）',
    'zh-TW': '地址未完全設置（點擊輸入）'
  },
  
  // 홈 화면
  'home.popularChains': {
    en: 'Popular Chains',
    ko: '인기 체인점',
    ja: '人気のチェーン店',
    'zh-CN': '热门连锁店',
    'zh-TW': '熱門連鎖店'
  },
  'home.categories': {
    en: 'Categories',
    ko: '카테고리',
    ja: 'カテゴリー',
    'zh-CN': '类别',
    'zh-TW': '類別'
  },
  
  // 로딩 상태
  'status.loading.chains': {
    en: 'Loading popular chains...',
    ko: '인기 체인점 불러오는 중...',
    ja: '人気のチェーン店を読み込み中...',
    'zh-CN': '正在加载热门连锁店...',
    'zh-TW': '正在加載熱門連鎖店...'
  },
  'status.loading.categories': {
    en: 'Loading categories...',
    ko: '카테고리 불러오는 중...',
    ja: 'カテゴリーを読み込み中...',
    'zh-CN': '正在加载类别...',
    'zh-TW': '正在加載類別...'
  },
  
  // 에러 상태
  'status.error.retry': {
    en: 'Retry',
    ko: '다시 시도',
    ja: '再試行',
    'zh-CN': '重试',
    'zh-TW': '重試'
  },
  
  // 빈 상태
  'status.empty.chains': {
    en: 'No popular chains found',
    ko: '인기 체인점이 없습니다',
    ja: '人気のチェーン店が見つかりません',
    'zh-CN': '未找到热门连锁店',
    'zh-TW': '未找到熱門連鎖店'
  },
  
  // 네비게이션
  'nav.home': {
    en: 'Home',
    ko: '홈',
    ja: 'ホーム',
    'zh-CN': '首页',
    'zh-TW': '首頁'
  },
  'nav.browse': {
    en: 'Browse',
    ko: '둘러보기',
    ja: '閲覧',
    'zh-CN': '浏览',
    'zh-TW': '瀏覽'
  },
  'nav.cart': {
    en: 'Cart',
    ko: '장바구니',
    ja: 'カート',
    'zh-CN': '购物车',
    'zh-TW': '購物車'
  },
  'nav.orders': {
    en: 'Orders',
    ko: '주문',
    ja: '注文',
    'zh-CN': '订单',
    'zh-TW': '訂單'
  },
  'nav.profile': {
    en: 'Profile',
    ko: '프로필',
    ja: 'プロフィール',
    'zh-CN': '个人资料',
    'zh-TW': '個人資料'
  },
  
  // 주소 설정 페이지
  'address.setup': {
    en: 'Address Setup',
    ko: '주소 설정',
    ja: '住所設定',
    'zh-CN': '地址设置',
    'zh-TW': '地址設置'
  },
  'address.main': {
    en: 'Main Address',
    ko: '기본 주소',
    ja: '主な住所',
    'zh-CN': '主要地址',
    'zh-TW': '主要地址'
  },
  'address.detail': {
    en: 'Detail Address',
    ko: '상세 주소',
    ja: '詳細住所',
    'zh-CN': '详细地址',
    'zh-TW': '詳細地址'
  },
  'address.useGPS': {
    en: 'Use Current Location',
    ko: '현재 위치 사용하기',
    ja: '現在位置を使用する',
    'zh-CN': '使用当前位置',
    'zh-TW': '使用當前位置'
  },
  'address.uploadBooking': {
    en: 'Upload Booking Confirmation',
    ko: '예약 확인서 업로드',
    ja: '予約確認書をアップロード',
    'zh-CN': '上传预订确认',
    'zh-TW': '上傳預訂確認'
  },
  'address.save': {
    en: 'Save Address',
    ko: '주소 저장',
    ja: '住所を保存',
    'zh-CN': '保存地址',
    'zh-TW': '保存地址'
  },
  'address.help': {
    en: 'Need Help?',
    ko: '도움이 필요하신가요?',
    ja: 'お手伝いが必要ですか？',
    'zh-CN': '需要帮助？',
    'zh-TW': '需要幫助？'
  },
  'address.required': {
    en: 'Main address is required',
    ko: '기본 주소는 필수입니다',
    ja: '主な住所は必須です',
    'zh-CN': '主要地址为必填项',
    'zh-TW': '主要地址為必填項'
  },
  'address.tooShort': {
    en: 'Address is too short, please enter a complete address',
    ko: '주소가 너무 짧습니다. 전체 주소를 입력해주세요',
    ja: '住所が短すぎます。完全な住所を入力してください',
    'zh-CN': '地址太短，请输入完整地址',
    'zh-TW': '地址太短，請輸入完整地址'
  },
  'address.missingNumber': {
    en: 'Address should include a number (building or street number)',
    ko: '주소에는 번호(건물 또는 도로 번호)가 포함되어야 합니다',
    ja: '住所には番号（建物または街路番号）を含める必要があります',
    'zh-CN': '地址应包含数字（建筑物或街道号码）',
    'zh-TW': '地址應包含數字（建築物或街道號碼）'
  },
  'address.detailRequired': {
    en: 'Please enter your detail address',
    ko: '상세 주소를 입력해주세요',
    ja: '詳細住所を入力してください',
    'zh-CN': '请输入您的详细地址',
    'zh-TW': '請輸入您的詳細地址'
  },
  'address.saveFailed': {
    en: 'Failed to save address. Please try again.',
    ko: '주소 저장에 실패했습니다. 다시 시도해주세요.',
    ja: '住所の保存に失敗しました。もう一度お試しください。',
    'zh-CN': '保存地址失败。请重试。',
    'zh-TW': '保存地址失敗。請重試。'
  },
};

/**
 * 번역 키에 해당하는 다국어 텍스트 반환
 * @param key 번역 키
 * @param lang 언어 코드 (기본값: 현재 설정된 언어)
 * @returns 번역된 텍스트
 */
export const getTranslation = (key: string, lang?: SupportedLanguage): string => {
  // 키가 없는 경우 빈 문자열 반환
  if (!key) return '';
  
  // 전역에서 불러올 현재 언어
  let currentLang = lang;
  
  // 브라우저 환경에서만 실행
  if (typeof window !== 'undefined' && !currentLang) {
    try {
      // localStorage에서 현재 언어 설정 가져오기
      const savedLang = localStorage.getItem('app_language') as SupportedLanguage | null;
      if (savedLang && ['en', 'ko', 'ja', 'zh-CN', 'zh-TW'].includes(savedLang)) {
        currentLang = savedLang;
      }
    } catch (e) {
      console.error('언어 설정 불러오기 실패:', e);
    }
  }
  
  // 현재 언어 없으면 영어 기본값 사용
  if (!currentLang) {
    currentLang = 'en';
  }
  
  // 번역 키가 사전에 있는지 확인
  const translationItem = translations[key];
  if (!translationItem) {
    console.warn(`번역 키 "${key}"를 찾을 수 없습니다.`);
    return key; // 키를 그대로 반환
  }
  
  // 현재 언어에 해당하는 번역이 있으면 반환, 없으면 영어 기본값 반환
  const translatedText = translationItem[currentLang];
  return translatedText || translationItem.en || key;
};

// 다국어 훅 사용을 위한 간단한 wrapper
export const t = getTranslation;

export default translations; 
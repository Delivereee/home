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
  'status.empty.categories': {
    en: 'No categories found',
    ko: '카테고리가 없습니다',
    ja: 'カテゴリーが見つかりません',
    'zh-CN': '未找到类别',
    'zh-TW': '未找到類別'
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
  
  // 상태 메시지 - 로딩
  'status.loading.restaurants': {
    en: 'Finding restaurants near you...',
    ko: '주변 음식점을 찾는 중...',
    ja: '近くのレストランを検索中...',
    'zh-CN': '正在查找附近的餐厅...',
    'zh-TW': '正在查找附近的餐廳...'
  },
  'status.loading.menus': {
    en: 'Loading menu options...',
    ko: '메뉴 옵션을 불러오는 중...',
    ja: 'メニューオプションを読み込んでいます...',
    'zh-CN': '正在加载菜单选项...',
    'zh-TW': '正在加載菜單選項...'
  },
  
  // 상태 메시지 - 에러
  'status.error.categories': {
    en: 'We had trouble loading categories. Please try again.',
    ko: '카테고리를 불러오는 데 문제가 발생했습니다. 다시 시도해주세요.',
    ja: 'カテゴリーの読み込み中に問題が発生しました。もう一度お試しください。',
    'zh-CN': '加载类别时出现问题。请重试。',
    'zh-TW': '加載類別時出現問題。請重試。'
  },
  'status.error.restaurants': {
    en: 'We couldn\'t load restaurants at this time. Please try again.',
    ko: '현재 음식점 정보를 불러올 수 없습니다. 다시 시도해주세요.',
    ja: '現在、レストラン情報を読み込むことができません。もう一度お試しください。',
    'zh-CN': '目前无法加载餐厅信息。请重试。',
    'zh-TW': '目前無法加載餐廳信息。請重試。'
  },
  'status.error.chains': {
    en: 'We couldn\'t load popular restaurants at this time. Please try again.',
    ko: '현재 인기 음식점을 불러올 수 없습니다. 다시 시도해주세요.',
    ja: '現在、人気のレストランを読み込むことができません。もう一度お試しください。',
    'zh-CN': '目前无法加载热门餐厅。请重试。',
    'zh-TW': '目前無法加載熱門餐廳。請重試。'
  },
  'status.error.menus': {
    en: 'We couldn\'t load the menu at this time. Please try again.',
    ko: '현재 메뉴를 불러올 수 없습니다. 다시 시도해주세요.',
    ja: '現在、メニューを読み込むことができません。もう一度お試しください。',
    'zh-CN': '目前无法加载菜单。请重试。',
    'zh-TW': '目前無法加載菜單。請重試。'
  },
  'status.error.default': {
    en: 'Something went wrong. Please try again.',
    ko: '문제가 발생했습니다. 다시 시도해주세요.',
    ja: '問題が発生しました。もう一度お試しください。',
    'zh-CN': '出现问题。请重试。',
    'zh-TW': '出現問題。請重試。'
  },
  'status.error.network': {
    en: 'Network connection issue. Please check your internet connection.',
    ko: '네트워크 연결 문제. 인터넷 연결을 확인해주세요.',
    ja: 'ネットワーク接続の問題です。インターネット接続を確認してください。',
    'zh-CN': '网络连接问题。请检查您的互联网连接。',
    'zh-TW': '網絡連接問題。請檢查您的互聯網連接。'
  },
  
  // 상태 메시지 - 비어있음
  'status.empty.restaurants': {
    en: 'No restaurants found in this area.',
    ko: '이 지역에서 음식점을 찾을 수 없습니다.',
    ja: 'この地域にレストランが見つかりません。',
    'zh-CN': '在此区域找不到餐厅。',
    'zh-TW': '在此區域找不到餐廳。'
  },
  'status.empty.menus': {
    en: 'This restaurant has no available menu items.',
    ko: '이 음식점에는 이용 가능한 메뉴 항목이 없습니다.',
    ja: 'このレストランには利用可能なメニュー項目がありません。',
    'zh-CN': '该餐厅没有可用的菜单项。',
    'zh-TW': '該餐廳沒有可用的菜單項。'
  },
  
  // 레스토랑 정보
  'restaurant.minimumOrder': {
    en: 'Minimum Order',
    ko: '최소 주문 금액',
    ja: '最低注文金額',
    'zh-CN': '最低订单金额',
    'zh-TW': '最低訂單金額'
  },
  'restaurant.noMinimumOrder': {
    en: 'No Minimum Order',
    ko: '최소 주문 금액 없음',
    ja: '最低注文金額なし',
    'zh-CN': '无最低订单金额',
    'zh-TW': '無最低訂單金額'
  },
  'restaurant.deliveryTime': {
    en: 'Within 1 hour',
    ko: '1시간 이내',
    ja: '1時間以内',
    'zh-CN': '1小时内',
    'zh-TW': '1小時內'
  },
  
  // Browse 페이지
  'browse.allRestaurants': {
    en: 'All Restaurants',
    ko: '모든 음식점',
    ja: 'すべてのレストラン',
    'zh-CN': '所有餐厅',
    'zh-TW': '所有餐廳'
  },
  'browse.restaurants': {
    en: 'Restaurants',
    ko: '음식점',
    ja: 'レストラン',
    'zh-CN': '餐厅',
    'zh-TW': '餐廳'
  },
  'browse.restaurantSingular': {
    en: 'restaurant',
    ko: '음식점',
    ja: 'レストラン',
    'zh-CN': '餐厅',
    'zh-TW': '餐廳'
  },
  'browse.restaurantPlural': {
    en: 'restaurants',
    ko: '음식점',
    ja: 'レストラン',
    'zh-CN': '餐厅',
    'zh-TW': '餐廳'
  },
  'browse.available': {
    en: 'available',
    ko: '이용 가능',
    ja: '利用可能',
    'zh-CN': '可用',
    'zh-TW': '可用'
  },

  // 에러/상태 메시지
  'error.connectionIssue': {
    en: 'Please check your internet connection and try again',
    ko: '인터넷 연결을 확인하고 다시 시도해주세요',
    ja: 'インターネット接続を確認して、もう一度お試しください',
    'zh-CN': '请检查您的互联网连接，然后重试',
    'zh-TW': '請檢查您的互聯網連接，然後重試'
  },
  'empty.changeLocationOrCategory': {
    en: 'Try changing your location or category',
    ko: '위치나 카테고리를 변경해 보세요',
    ja: '場所やカテゴリを変更してみてください',
    'zh-CN': '尝试更改您的位置或类别',
    'zh-TW': '嘗試更改您的位置或類別'
  },
  'action.refresh': {
    en: 'Refresh',
    ko: '새로고침',
    ja: '更新',
    'zh-CN': '刷新',
    'zh-TW': '刷新'
  },
  
  // 장바구니 페이지
  'cart.empty': {
    en: 'Your cart is empty',
    ko: '장바구니가 비어 있습니다',
    ja: 'カートが空です',
    'zh-CN': '您的购物车是空的',
    'zh-TW': '您的購物車是空的'
  },
  'cart.addItems': {
    en: 'Add some delicious items from our restaurants!',
    ko: '맛있는 음식을 장바구니에 담아보세요!',
    ja: '美味しい料理をカートに追加してください！',
    'zh-CN': '从我们的餐厅添加一些美味的食品！',
    'zh-TW': '從我們的餐廳添加一些美味的食品！'
  },
  'cart.browseRestaurants': {
    en: 'Browse Restaurants',
    ko: '음식점 둘러보기',
    ja: 'レストランを見る',
    'zh-CN': '浏览餐厅',
    'zh-TW': '瀏覽餐廳'
  },
  'cart.perPiece': {
    en: '(per 1 piece)',
    ko: '(1개당)',
    ja: '(1個あたり)',
    'zh-CN': '(每件)',
    'zh-TW': '(每件)'
  },
  'cart.remove': {
    en: 'Remove',
    ko: '삭제',
    ja: '削除',
    'zh-CN': '删除',
    'zh-TW': '刪除'
  },
  'cart.decrease': {
    en: 'Decrease quantity of',
    ko: '수량 감소',
    ja: '数量を減らす',
    'zh-CN': '减少数量',
    'zh-TW': '減少數量'
  },
  'cart.increase': {
    en: 'Increase quantity of',
    ko: '수량 증가',
    ja: '数量を増やす',
    'zh-CN': '增加数量',
    'zh-TW': '增加數量'
  },
  'cart.orderSummary': {
    en: 'Order Summary',
    ko: '주문 요약',
    ja: '注文の概要',
    'zh-CN': '订单摘要',
    'zh-TW': '訂單摘要'
  },
  'cart.subtotal': {
    en: 'Subtotal',
    ko: '소계',
    ja: '小計',
    'zh-CN': '小计',
    'zh-TW': '小計'
  },
  'cart.deliveryFee': {
    en: 'Delivery Fee',
    ko: '배달료',
    ja: '配送料',
    'zh-CN': '配送费',
    'zh-TW': '配送費'
  },
  'cart.proxyFee': {
    en: 'Proxy Ordering Fee',
    ko: '대리 주문 수수료',
    ja: '代理注文手数料',
    'zh-CN': '代理订购费',
    'zh-TW': '代理訂購費'
  },
  'cart.total': {
    en: 'Total',
    ko: '합계',
    ja: '合計',
    'zh-CN': '总计',
    'zh-TW': '總計'
  },
  'cart.addMore': {
    en: 'Add',
    ko: '추가',
    ja: '追加',
    'zh-CN': '添加',
    'zh-TW': '添加'
  },
  'cart.toOrder': {
    en: 'more to order',
    ko: '더 추가하여 주문하세요',
    ja: 'もっと追加して注文する',
    'zh-CN': '更多以下订单',
    'zh-TW': '更多以下訂單'
  },
  'cart.processing': {
    en: 'Processing...',
    ko: '처리 중...',
    ja: '処理中...',
    'zh-CN': '处理中...',
    'zh-TW': '處理中...'
  },
  'cart.proceedToCheckout': {
    en: 'Proceed to Checkout',
    ko: '결제 진행하기',
    ja: '決済に進む',
    'zh-CN': '进行结算',
    'zh-TW': '進行結算'
  },
  'cart.setAddressFirst': {
    en: 'Please set up your delivery address first',
    ko: '먼저 배송 주소를 설정해주세요',
    ja: '配送先住所を先に設定してください',
    'zh-CN': '请先设置您的配送地址',
    'zh-TW': '請先設置您的配送地址'
  },
  'cart.failedToCreateCart': {
    en: 'Failed to create cart',
    ko: '장바구니 생성에 실패했습니다',
    ja: 'カートの作成に失敗しました',
    'zh-CN': '创建购物车失败',
    'zh-TW': '創建購物車失敗'
  },
  'cart.failedToGetOrderId': {
    en: 'Failed to get order ID',
    ko: '주문 ID를 가져오지 못했습니다',
    ja: '注文IDの取得に失敗しました',
    'zh-CN': '获取订单ID失败',
    'zh-TW': '獲取訂單ID失敗'
  },
  'cart.checkoutFailed': {
    en: 'Failed to proceed to checkout',
    ko: '결제 진행에 실패했습니다',
    ja: '決済に進むことができませんでした',
    'zh-CN': '无法进行结算',
    'zh-TW': '無法進行結算'
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
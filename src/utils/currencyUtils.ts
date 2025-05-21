import { getCurrentLanguage } from '../config/languageConfig';

type SupportedCurrency = 'USD' | 'KRW' | 'JPY' | 'CNY' | 'TWD';

/**
 * Returns the appropriate currency symbol based on the current language
 */
export const getCurrencyByLanguage = (): SupportedCurrency => {
  const lang = getCurrentLanguage();
  
  switch (lang) {
    case 'ko': return 'KRW';
    case 'ja': return 'JPY';
    case 'zh-CN': return 'CNY';
    case 'zh-TW': return 'TWD';
    case 'en':
    default: return 'USD';
  }
};

/**
 * Format a price according to the current language/currency
 * Now that the server handles exchange rate calculations, we only need to format the display
 */
export const formatCurrency = (price: number): string => {
  const currency = getCurrencyByLanguage();
  
  // Use Intl.NumberFormat for consistent currency formatting
  return new Intl.NumberFormat(getCurrentLanguage(), { 
    style: 'currency', 
    currency,
    minimumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 2
  }).format(price);
}; 
import { useNavigate } from 'react-router-dom';
import { useAddress } from '../contexts/AddressContext';
import useTranslation from '../hooks/useTranslation';

/**
 * 주소 관련 유틸리티를 제공하는 커스텀 훅
 * 주소 상태 확인, 주소 페이지로 이동, 메시지 제공 기능
 */
export const useAddressUtils = () => {
  const { isAddressSet } = useAddress();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  /**
   * 주소 설정 여부 확인
   * @returns 주소 설정 여부 (boolean)
   */
  const isAddressValid = (): boolean => {
    return isAddressSet();
  };

  /**
   * 주소 페이지로 이동
   */
  const navigateToAddress = (): void => {
    navigate('/address');
  };

  /**
   * 주소 미설정 시 실행할 기본 콜백
   * @param callback 주소가 설정되었을 때 실행할 콜백 함수
   * @returns 주소 설정 여부에 따라 다른 동작을 수행하는 함수
   */
  const withAddressCheck = (callback: () => void): (() => void) => {
    return () => {
      if (isAddressSet()) {
        callback();
      } else {
        navigate('/address');
      }
    };
  };

  /**
   * 주소 미설정 시 필요한 알림 메시지 반환
   * @param messageType 메시지 타입 (기본: 'notSet')
   * @returns 다국어 지원 알림 메시지
   */
  const getAddressRequiredMessage = (
    messageType: 'notSet' | 'requiredForAction' | 'requiredForCheckout' | 'setAddress' | 'tapToSet' = 'notSet'
  ): string => {
    switch (messageType) {
      case 'requiredForAction':
        return t('address.requiredForAction');
      case 'requiredForCheckout':
        return t('address.requiredForCheckout');
      case 'setAddress':
        return t('address.setAddress');
      case 'tapToSet':
        return t('address.tapToSet');
      case 'notSet':
      default:
        return t('address.notSet');
    }
  };

  /**
   * 주소 설정 버튼 텍스트 반환
   * @returns 다국어 지원 버튼 텍스트
   */
  const getSetAddressButtonText = (): string => {
    return t('address.setNow');
  };
  
  return {
    isAddressValid,
    navigateToAddress,
    withAddressCheck,
    getAddressRequiredMessage,
    getSetAddressButtonText
  };
}; 
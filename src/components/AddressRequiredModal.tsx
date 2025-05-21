import React from 'react';
import { useNavigate } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

interface AddressRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageType?: 'notSet' | 'requiredForAction' | 'requiredForCheckout';
  onNavigateToAddress?: () => void;
}

/**
 * 주소 입력이 필요할 때 보여주는 모달 컴포넌트
 */
const AddressRequiredModal: React.FC<AddressRequiredModalProps> = ({
  isOpen,
  onClose,
  messageType = 'notSet',
  onNavigateToAddress
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) {
    return null;
  }
  
  // 메시지 타입에 따른 텍스트 반환
  const getMessage = () => {
    switch (messageType) {
      case 'requiredForAction':
        return t('address.requiredForAction');
      case 'requiredForCheckout':
        return t('address.requiredForCheckout');
      case 'notSet':
      default:
        return t('address.notSet');
    }
  };
  
  // 주소 설정 페이지로 이동
  const handleGoToAddress = () => {
    onClose();
    if (onNavigateToAddress) {
      onNavigateToAddress();
    } else {
      navigate('/address');
    }
  };
  
  // 모달 내부 클릭 시 이벤트 전파 중지
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        className="bg-white rounded-lg w-[90%] max-w-md overflow-hidden shadow-xl"
        onClick={handleModalClick}
      >
        <div className="px-4 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <span>{t('header.setAddress')}</span>
          </h2>
        </div>
        
        <div className="px-4 py-6">
          <p className="text-gray-600 mb-6 text-base">
            {getMessage()}
          </p>
          
          <div className="space-y-3">
            <button 
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors hover:bg-red-600"
              onClick={handleGoToAddress}
            >
              {t('address.setNow')}
            </button>
            
            <button 
              className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-semibold border border-gray-300 transition-colors hover:bg-gray-50"
              onClick={onClose}
            >
              {t('status.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressRequiredModal; 
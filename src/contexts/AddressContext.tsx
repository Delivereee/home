import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Address {
  mainAddress: string;
  detailAddress: string;
  isComplete: boolean;
}

interface AddressContextType {
  address: Address | null;
  setAddress: (address: Address) => void;
  clearAddress: () => void;
  isAddressSet: () => boolean;
}

// 초기 상태는 로컬 스토리지에서 불러옴
const loadAddressFromStorage = (): Address | null => {
  try {
    const addressData = localStorage.getItem('userAddress');
    return addressData ? JSON.parse(addressData) : null;
  } catch (error) {
    console.error('Error loading address from localStorage:', error);
    return null;
  }
};

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddressState] = useState<Address | null>(loadAddressFromStorage);

  // 주소 설정
  const setAddress = (newAddress: Address) => {
    setAddressState(newAddress);
    localStorage.setItem('userAddress', JSON.stringify(newAddress));
  };

  // 주소 초기화
  const clearAddress = () => {
    setAddressState(null);
    localStorage.removeItem('userAddress');
  };

  // 주소 설정 여부 확인
  const isAddressSet = () => {
    return !!address && address.isComplete;
  };

  const contextValue: AddressContextType = {
    address,
    setAddress,
    clearAddress,
    isAddressSet
  };

  return (
    <AddressContext.Provider value={contextValue}>
      {children}
    </AddressContext.Provider>
  );
};

// 훅 형태로 컨텍스트 사용
export const useAddress = (): AddressContextType => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
}; 
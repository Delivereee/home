import React from 'react';
import { MenuSection as MenuSectionType } from '../types/menu';
import MenuItem from './MenuItem';
import { getLocalizedValue } from '../config/languageConfig';

interface MenuSectionProps {
  section: MenuSectionType;
  restaurantId: string;
  restaurantName: string;
}

const MenuSection: React.FC<MenuSectionProps> = ({ section, restaurantId, restaurantName }) => {
  // 현재 언어에 맞는 섹션 이름 가져오기
  const displayName = getLocalizedValue(section.name, {
    en: section.nameEn
  });
  
  // 타입 정보를 영문으로 변환
  const typeDisplayInEnglish = section.msType;
  
  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      {/* 섹션 헤더 */}
      <div className="mb-4">
        {/* 섹션 제목 표시 */}
        <h2 className="text-xl font-bold text-gray-800 text-left">{displayName}</h2>
        
        {/* 타입 정보 표시 (영문, 작은 폰트, 좌측 정렬) */}
        {typeDisplayInEnglish && (
          <p className="text-xs text-gray-500 text-left">{typeDisplayInEnglish}</p>
        )}
      </div>
      
      {/* 메뉴 아이템 목록 */}
      <div>
        {section.menuItems.length === 0 ? (
          <p className="text-gray-500 italic">No items available in this section</p>
        ) : (
          <div>
            {section.menuItems.map((item, index) => (
              <div key={item.id} className={index !== section.menuItems.length - 1 ? "border-b border-gray-100" : ""}>
                <MenuItem 
                  menuItem={item} 
                  restaurantId={restaurantId}
                  restaurantName={restaurantName}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuSection; 
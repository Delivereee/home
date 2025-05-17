import React from 'react';
import { MenuSection as MenuSectionType } from '../types/menu';
import MenuItem from './MenuItem';

interface MenuSectionProps {
  section: MenuSectionType;
  restaurantId: string;
  restaurantName: string;
}

const MenuSection: React.FC<MenuSectionProps> = ({ section, restaurantId, restaurantName }) => {
  // 영문 이름을 우선 사용하고, 없을 경우 기본 필드 사용
  const displayName = section.nameEn || section.name || 'Menu Section';
  
  // 타입 정보를 영문으로 변
  
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
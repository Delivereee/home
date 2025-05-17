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
  
  return (
    <div className="mb-8">
      {/* 섹션 제목 표시 */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">{displayName}</h2>
      
      {section.menuItems.length === 0 ? (
        <p className="text-gray-500 italic">No items available in this section</p>
      ) : (
        <div>
          {section.menuItems.map(item => (
            <MenuItem 
              key={item.id} 
              menuItem={item} 
              restaurantId={restaurantId}
              restaurantName={restaurantName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuSection; 
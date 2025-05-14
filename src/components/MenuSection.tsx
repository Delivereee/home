import React from 'react';
import { MenuSection as MenuSectionType } from '../types/menu';
import MenuItem from './MenuItem';

interface MenuSectionProps {
  section: MenuSectionType;
  restaurantId: string;
  restaurantName: string;
}

const MenuSection: React.FC<MenuSectionProps> = ({ section, restaurantId, restaurantName }) => {
  // 기본 필드만 사용 (영문 이름 제외)
  const displayName = section.name || 'Menu Section';
  
  return (
    <div className="mb-8">
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
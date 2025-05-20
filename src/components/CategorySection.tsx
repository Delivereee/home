import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types/category';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import { useCategories } from '../hooks/useCategories';
import { getStatusMessages } from '../config/constants';
import ImageWithFallback from './ImageWithFallback';
import useTranslation from '../hooks/useTranslation';
import { getLocalizedValue } from '../config/languageConfig';

const CategorySection: React.FC = () => {
  const { categories, loading, error, refetch } = useCategories();
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category: Category) => {
    // 카테고리 상세 페이지로 이동 (ID만 사용)
    navigate(`/categories/${category.id}`);
  };
  
  // 카테고리 이름 다국어 처리
  const getLocalizedCategoryName = (category: Category) => {
    // API에서 반환되는 각 언어별 이름 필드를 사용
    const translations = {
      en: category.nameEn,
      ko: category.nameKo,
      ja: category.nameJa,
      'zh-CN': category.nameZhCn,
      'zh-TW': category.nameZhTw
    };
    
    // 현재 언어에 맞는 이름 반환 (없으면 기본 이름 사용)
    return getLocalizedValue(category.name, translations);
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-left">{t('home.categories')}</h2>
        <LoadingState height="h-40" message={t('status.loading.categories')} />
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-left">{t('home.categories')}</h2>
        <ErrorState height="h-40" message={error} onRetry={refetch} />
      </div>
    );
  }
  
  // 카테고리가 없는 경우
  if (categories.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-left">{t('home.categories')}</h2>
        <EmptyState 
          height="h-40" 
          message={t('status.empty.categories')} 
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-left">{t('home.categories')}</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="relative overflow-hidden rounded-lg h-40 cursor-pointer"
            onClick={() => handleCategoryClick(category)}
          >
            <ImageWithFallback 
              src={category.imageUrl} 
              alt={getLocalizedCategoryName(category)}
              className="w-full h-full object-cover"
              fallback="https://delivereee.github.io/home/images/categories/default-food.jpg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
              <h3 className="text-white text-xl font-bold p-3">{getLocalizedCategoryName(category)}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection; 
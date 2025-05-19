import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types/category';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { useCategories } from '../hooks/useCategories';
import { STATUS_MESSAGES } from '../config/constants';
import ImageWithFallback from './ImageWithFallback';

const CategorySection: React.FC = () => {
  const { categories, loading, error, refetch } = useCategories();
  const navigate = useNavigate();

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category: Category) => {
    // 카테고리 상세 페이지로 이동 (ID만 사용)
    navigate(`/categories/${category.id}`);
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-left">Categories</h2>
        <LoadingState height="h-40" message={STATUS_MESSAGES.loading.categories} />
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-left">Categories</h2>
        <ErrorState height="h-40" message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-left">Categories</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="relative overflow-hidden rounded-lg h-40 cursor-pointer"
            onClick={() => handleCategoryClick(category)}
          >
            <ImageWithFallback 
              src={category.imageUrl} 
              alt={category.name}
              className="w-full h-full object-cover"
              fallback="https://delivereee.github.io/home/images/categories/default-food.jpg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
              <h3 className="text-white text-xl font-bold p-3">{category.nameEn || category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection; 
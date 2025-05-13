import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../api/categoryService';
import { CATEGORIES, Category } from '../types/category';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

const CategorySection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // API에서 데이터 가져오기 시도
      const data = await getCategories();
      
      // API 호출 실패 시 로컬 데이터 사용 (개발 편의를 위해)
      if (data.length === 0) {
        // 로컬 샘플 데이터 사용
        setCategories(CATEGORIES);
        console.log('Using sample data for categories');
      } else {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. Please try again later.');
      
      // 에러 발생 시에도 기본 카테고리 데이터 사용
      setCategories(CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category: Category) => {
    // 카테고리 상세 페이지로 이동
    navigate(`/categories/${category.id}/${encodeURIComponent(category.name)}`);
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-left">Categories</h2>
        <LoadingState height="h-40" message="Loading categories..." />
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4 text-left">Categories</h2>
        <ErrorState height="h-40" message={error} onRetry={fetchCategories} />
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
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover"
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
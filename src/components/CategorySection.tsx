import React from 'react';

interface Category {
  id: string;
  name: string;
  image: string;
}

const CategorySection: React.FC = () => {
  // 샘플 카테고리 데이터
  const categories: Category[] = [
    { id: 'korean-bbq', name: 'Korean BBQ', image: 'https://source.unsplash.com/random/300x200/?korean-bbq' },
    { id: 'street-food', name: 'Street Food', image: 'https://source.unsplash.com/random/300x200/?street-food' },
    { id: 'bibimbap', name: 'Bibimbap', image: 'https://source.unsplash.com/random/300x200/?bibimbap' },
    { id: 'fried-chicken', name: 'Fried Chicken', image: 'https://source.unsplash.com/random/300x200/?fried-chicken' },
    { id: 'tteokbokki', name: 'Tteokbokki', image: 'https://source.unsplash.com/random/300x200/?tteokbokki' },
    { id: 'desserts', name: 'Desserts', image: 'https://source.unsplash.com/random/300x200/?desserts' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-left">Categories</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="relative overflow-hidden rounded-lg h-40">
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
              <h3 className="text-white text-xl font-bold p-3">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection; 
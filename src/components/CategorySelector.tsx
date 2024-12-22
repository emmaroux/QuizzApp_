import React from 'react';
import { Check, BookOpen } from 'lucide-react';

interface CategorySelectorProps {
  categories: string[];
  selectedCategories: string[];
  onSelectCategory: (category: string) => void;
  onSelectAll: () => void;
  onSelectRandom: () => void;
}

export function CategorySelector({
  categories,
  selectedCategories,
  onSelectCategory,
  onSelectAll,
  onSelectRandom
}: CategorySelectorProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Aucune catégorie disponible pour cette discipline
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={onSelectAll}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex-1"
        >
          Toutes les catégories
        </button>
        <button
          onClick={onSelectRandom}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex-1"
        >
          Au hasard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`p-3 rounded-lg flex items-center gap-2 ${
              selectedCategories.includes(category)
                ? 'bg-indigo-50 text-indigo-800'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left">{category}</span>
            {selectedCategories.includes(category) && (
              <Check className="w-5 h-5 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
import React from "react";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2 justify-start md:justify-center overflow-x-auto pb-4 scrollbar-hide ${className}`}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`
            px-5 py-2 rounded-component text-sm font-semibold transition-all duration-300 whitespace-nowrap
            ${activeCategory === category 
              ? "bg-secondary text-white shadow-md transform scale-105" 
              : "bg-bg-base text-text-primary hover:bg-bg-surface border border-border-main"}
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

import React from "react";

interface CategoryProps {
  categories: string[];
  selectpopulationCategory: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategorySelect: React.FC<CategoryProps> = ({
  categories,
  selectpopulationCategory
}) => {
  return (
    <div className="category-select">
      <select onChange={selectpopulationCategory}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;

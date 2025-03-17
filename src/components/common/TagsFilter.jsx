import React from 'react';

/**
 * TagsFilter component for filtering recipes by tags
 * @param {Array} tags - List of available tags
 * @param {string|null} activeTag - Currently selected tag
 * @param {Function} onTagClick - Callback when tag is clicked
 * @param {Array} recipes - List of recipes to count by tag
 */
const TagsFilter = ({ tags, activeTag, onTagClick, recipes = [] }) => {
  // Calculate the count of recipes for each tag
  const getTagCount = (tag) => {
    return recipes.filter(recipe => 
      (recipe.tags && recipe.tags.includes(tag)) || 
      recipe.category === tag || 
      recipe.area === tag
    ).length;
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto py-2 overflow-y-auto no-scrollbar">
        <div className="flex flex-nowrap space-x-2 min-w-0">
          <button
            onClick={() => onTagClick(null)}
            className={`
              flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium 
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-sm
              active:translate-y-0 active:shadow-none
              cursor-pointer ${
              activeTag === null
                ? 'bg-[#81B29A] text-[#F4F1DE] shadow-sm'
                : 'bg-[#3D405B] text-[#F4F1DE] hover:bg-opacity-90'
            }`}
          >
            All
          </button>
          {tags.map((tag) => {
            const count = getTagCount(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className={`
                  flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-sm
                  active:translate-y-0 active:shadow-none
                  cursor-pointer ${
                  activeTag === tag
                    ? 'bg-[#E07A5F] text-[#F4F1DE] shadow-sm'
                    : 'bg-[#3D405B] text-[#F4F1DE] hover:bg-opacity-90'
                }`}
                aria-pressed={activeTag === tag}
              >
                {tag} {count > 0 && 
                  <span className={`ml-1 ${activeTag === tag ? 'opacity-90' : 'opacity-70'}`}>
                    ({count})
                  </span>
                }
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TagsFilter;
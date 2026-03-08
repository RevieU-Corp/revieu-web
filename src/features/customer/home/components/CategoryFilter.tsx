import React, { useState, useRef, useEffect } from 'react';

export type CategoryType = 
  | 'All' 
  | 'Asian / Chinese' 
  | 'Burgers & Pizza' 
  | 'Coffee & Boba' 
  | 'Healthy & Bowls' 
  | 'Mexican' 
  | 'Dessert';

interface CategoryFilterProps {
    selectedCategory: CategoryType;
    onCategoryChange: (category: CategoryType) => void;
}

const CATEGORIES: CategoryType[] = [
    'All',
    'Asian / Chinese',
    'Burgers & Pizza',
    'Coffee & Boba',
    'Healthy & Bowls',
    'Mexican',
    'Dessert'
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCategorySelect = (category: CategoryType) => {
        onCategoryChange(category);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-[55px] h-[24px] items-center justify-between px-2 rounded-[20px] bg-[#FFF2F2] transition-colors"
            >
                <span className="max-w-[30px] truncate text-[10px] leading-none font-[800] text-[#990000] uppercase tracking-wide">
                    {selectedCategory}
                </span>
                <svg 
                    className={`w-3 h-3 flex-shrink-0 text-[#990000] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            className={`w-full text-left px-4 py-2.5 text-[12px] font-[700] transition-colors ${
                                selectedCategory === category
                                    ? 'bg-[#990000] text-white'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;

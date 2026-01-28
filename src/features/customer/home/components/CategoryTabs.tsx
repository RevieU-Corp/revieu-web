
import React from 'react';
import { CategoryType } from '../../shared/types';

interface CategoryTabsProps {
    active: CategoryType;
    onChange: (cat: CategoryType) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ active, onChange }) => {
    const tabs = Object.values(CategoryType);

    return (
        <div className="flex space-x-1.5 p-1.5 bg-white/40 backdrop-blur-xl rounded-[24px] border border-[#4A0000]/5 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={`flex-shrink-0 flex-1 px-8 py-4 text-[14px] font-[900] transition-all duration-500 rounded-[18px] tracking-tight text-center ${active === tab
                            ? 'bg-[#990000] text-white shadow-xl shadow-[#990000]/20'
                            : 'text-[#706962] opacity-50 hover:opacity-100'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;

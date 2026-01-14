import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTags: string[];
  selectedTags: string[];
  onApplyFilter: (tags: string[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  availableTags,
  selectedTags,
  onApplyFilter
}) => {
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);

  if (!isOpen) return null;

  const handleTagToggle = (tag: string) => {
    setLocalSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleApply = () => {
    onApplyFilter(localSelectedTags);
    onClose();
  };

  const handleClear = () => {
    setLocalSelectedTags([]);
  };

  const handleClose = () => {
    setLocalSelectedTags(selectedTags);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Filter by Tags</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {localSelectedTags.length} tag{localSelectedTags.length !== 1 ? 's' : ''} selected
            </p>
            {localSelectedTags.length > 0 && (
              <button
                onClick={handleClear}
                className="text-sm text-[#990000] font-medium hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Tag Grid */}
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => {
              const isSelected = localSelectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${isSelected
                      ? 'bg-[#990000] text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }
                  `}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-3 bg-[#990000] text-white rounded-lg font-medium hover:bg-[#880000] transition-colors shadow-md"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;

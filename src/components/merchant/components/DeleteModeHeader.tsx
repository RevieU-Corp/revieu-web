import React from 'react';
import { X, Trash2 } from 'lucide-react';

interface DeleteModeHeaderProps {
  selectedCount: number;
  onCancel: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  totalCount: number;
  isAllSelected: boolean;
}

const DeleteModeHeader: React.FC<DeleteModeHeaderProps> = ({
  selectedCount,
  onCancel,
  onDelete,
  onSelectAll,
  onDeselectAll,
  isAllSelected
}) => {
  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            aria-label="Cancel delete mode"
          >
            <X className="w-5 h-5 text-red-600" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-red-900">Delete Chats</h2>
            <p className="text-sm text-red-700">
              {selectedCount > 0 
                ? `${selectedCount} chat${selectedCount !== 1 ? 's' : ''} selected`
                : 'Select chats to delete'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Select All / Deselect All */}
          <button
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 rounded-lg transition-colors"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            disabled={selectedCount === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCount > 0
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>Delete ({selectedCount})</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModeHeader;
import React, { useState } from 'react';
import { X, Users } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupName: string) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreateGroup 
}) => {
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setGroupName('');
    setError('');
    setIsSubmitting(false);
    onClose();
  };

  const validateGroupName = (name: string): boolean => {
    if (!name.trim()) {
      setError('Group name is required');
      return false;
    }
    
    if (name.trim().length < 2) {
      setError('Group name must be at least 2 characters');
      return false;
    }
    
    if (name.trim().length > 50) {
      setError('Group name must be less than 50 characters');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGroupName(value);
    
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateGroupName(groupName)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onCreateGroup(groupName.trim());
      handleClose();
    } catch (error) {
      setError('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h2 id="modal-title" className="text-xl font-semibold text-gray-900">Create Group Chat</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                id="group-name"
                value={groupName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  error 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter group name..."
                maxLength={50}
                disabled={isSubmitting}
                autoFocus
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {groupName.length}/50 characters
              </p>
            </div>

            {/* Group Description (Optional) */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Group Chat Features</h3>
                  <ul className="mt-1 text-xs text-gray-600 space-y-1">
                    <li>• Send messages to multiple customers at once</li>
                    <li>• Share updates and announcements</li>
                    <li>• Manage group members easily</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !groupName.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
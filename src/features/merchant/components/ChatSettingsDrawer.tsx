import React from 'react';
import { X, Search, BellOff, Pin, Trash2 } from 'lucide-react';

interface ChatSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chatName: string;
  onSearchMessages: () => void;
  onMuteNotifications: () => void;
  onPinChat: () => void;
  onClearMessages: () => void;
  isMuted?: boolean;
  isPinned?: boolean;
}

const ChatSettingsDrawer: React.FC<ChatSettingsDrawerProps> = ({
  isOpen,
  onClose,
  chatName,
  onSearchMessages,
  onMuteNotifications,
  onPinChat,
  onClearMessages,
  isMuted = false,
  isPinned = false
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const settingsOptions = [
    {
      id: 'search',
      label: 'Search Messages',
      icon: Search,
      onClick: onSearchMessages,
      className: 'text-gray-700 hover:bg-gray-50'
    },
    {
      id: 'mute',
      label: isMuted ? 'Unmute Notifications' : 'Mute Notifications',
      icon: BellOff,
      onClick: onMuteNotifications,
      className: 'text-gray-700 hover:bg-gray-50'
    },
    {
      id: 'pin',
      label: isPinned ? 'Unpin Chat' : 'Pin Chat',
      icon: Pin,
      onClick: onPinChat,
      className: 'text-gray-700 hover:bg-gray-50'
    },
    {
      id: 'clear',
      label: 'Clear All Messages',
      icon: Trash2,
      onClick: onClearMessages,
      className: 'text-red-600 hover:bg-red-50',
      isDestructive: true
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-300"
        onClick={handleBackdropClick}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chat Settings</h2>
            <p className="text-sm text-gray-500 truncate">{chatName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Settings Options */}
        <div className="py-2">
          {settingsOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => {
                  option.onClick();
                  if (!option.isDestructive) {
                    onClose();
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors ${option.className}`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span className="text-left font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Chat settings and preferences
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatSettingsDrawer;
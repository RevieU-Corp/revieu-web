import React from 'react';
import { BellOff, Pin, Check } from 'lucide-react';

import { ChatItem } from '../types/chat';

interface ChatListItemProps {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isMuted?: boolean;
  isPinned?: boolean;
  isDeleteMode?: boolean;
  isSelected?: boolean;
  onClick: (chatId: string) => void;
  onSelect?: (chatId: string, selected: boolean) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  id,
  name,
  avatar,
  lastMessage,
  timestamp,
  unreadCount,
  isMuted = false,
  isPinned = false,
  isDeleteMode = false,
  isSelected = false,
  onClick,
  onSelect
}) => {
  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleClick = () => {
    if (isDeleteMode && onSelect) {
      onSelect(id, !isSelected);
    } else {
      onClick(id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer transition-colors ${
        isDeleteMode 
          ? isSelected 
            ? 'bg-red-50 border-l-4 border-red-500' 
            : 'bg-white hover:bg-gray-50'
          : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center px-4 py-3">
        {/* Selection Checkbox (Delete Mode) */}
        {isDeleteMode && (
          <div className="flex-shrink-0 mr-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              isSelected 
                ? 'bg-red-500 border-red-500 text-white' 
                : 'border-gray-300 hover:border-red-400'
            }`}>
              {isSelected && <Check className="w-4 h-4" />}
            </div>
          </div>
        )}

        {/* Avatar */}
        <div className="flex-shrink-0 mr-3 relative">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className={`w-12 h-12 rounded-full object-cover transition-opacity ${
                isDeleteMode && isSelected ? 'opacity-60' : 'opacity-100'
              }`}
              onError={(e) => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLDivElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 rounded-full bg-blue-500 text-white font-semibold ${avatar ? 'hidden' : 'flex'} items-center justify-center text-sm transition-opacity ${
              isDeleteMode && isSelected ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {getInitials(name)}
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <h3 className={`text-sm font-semibold truncate transition-colors ${
                isDeleteMode && isSelected ? 'text-red-700' : 'text-gray-900'
              }`}>
                {name}
              </h3>
              {/* Status Icons */}
              {!isDeleteMode && (
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {isPinned && (
                    <Pin className="w-3 h-3 text-blue-500" />
                  )}
                  {isMuted && (
                    <BellOff className="w-3 h-3 text-gray-500" />
                  )}
                </div>
              )}
            </div>
            <span className={`text-xs flex-shrink-0 transition-colors ${
              isDeleteMode && isSelected ? 'text-red-500' : 'text-gray-500'
            }`}>
              {timestamp}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-sm truncate transition-colors ${
              isDeleteMode && isSelected ? 'text-red-600' : 'text-gray-600'
            }`}>
              {lastMessage}
            </p>
            {!isDeleteMode && unreadCount && unreadCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
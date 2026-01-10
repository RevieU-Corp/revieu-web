import React from 'react';
import { Download, Image as ImageIcon, FileText } from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string | React.ReactNode;
    timestamp: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    type?: 'text' | 'image' | 'file';
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  };
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwnMessage, 
  showAvatar = true 
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (timestamp: string) => {
    // For demo purposes, if timestamp is "now", show current time
    if (timestamp === 'now') {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timestamp;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / 1024 / 1024;
    return mb > 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  const renderMessageContent = () => {
    if (message.type === 'file' && message.fileName) {
      const isImage = message.fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
      
      return (
        <div className="space-y-2">
          {message.content && message.content !== `📎 ${message.fileName}` && (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {typeof message.content === 'string' ? message.content : message.content}
            </div>
          )}
          
          <div className={`flex items-center space-x-3 p-3 rounded-lg border ${
            isOwnMessage ? 'bg-blue-500 border-blue-400' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex-shrink-0">
              {isImage ? (
                <ImageIcon className={`w-6 h-6 ${isOwnMessage ? 'text-blue-100' : 'text-blue-500'}`} />
              ) : (
                <FileText className={`w-6 h-6 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`} />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${
                isOwnMessage ? 'text-white' : 'text-gray-900'
              }`}>
                {message.fileName}
              </p>
              {message.fileSize && (
                <p className={`text-xs ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatFileSize(message.fileSize)}
                </p>
              )}
            </div>
            
            <button
              className={`flex-shrink-0 p-1 rounded transition-colors ${
                isOwnMessage 
                  ? 'text-blue-100 hover:text-white hover:bg-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Download file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {typeof message.content === 'string' ? message.content : message.content}
      </div>
    );
  };

  return (
    <div className={`flex items-end space-x-2 mb-4 ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      {showAvatar && !isOwnMessage && (
        <div className="flex-shrink-0 mb-1">
          {message.senderAvatar ? (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLDivElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-8 h-8 rounded-full bg-gray-400 text-white font-semibold ${message.senderAvatar ? 'hidden' : 'flex'} items-center justify-center text-xs`}
          >
            {getInitials(message.senderName)}
          </div>
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md`}>
        {/* Sender Name (only for others' messages) */}
        {!isOwnMessage && showAvatar && (
          <span className="text-xs text-gray-500 mb-1 px-1">{message.senderName}</span>
        )}
        
        {/* Message Bubble */}
        <div
          className={`px-4 py-2 rounded-2xl break-words shadow-sm ${
            isOwnMessage
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
          }`}
        >
          {renderMessageContent()}
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-gray-400 mt-1 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>

      {/* Own message avatar placeholder (to maintain spacing) */}
      {showAvatar && isOwnMessage && (
        <div className="w-8 h-8 flex-shrink-0 mb-1">
          {/* Empty space for alignment */}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import EmojiPicker from '../../shared/components/EmojiPicker';
import FileUpload, { FilePreview } from '../../shared/components/FileUpload';
import { useResponsiveLayout } from '../../shared/utils/deviceDetection';

interface MessageInputProps {
  onSendMessage: (content: string, file?: File) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = "Type a message...",
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use responsive layout hook
  const { isMobile, isKeyboardVisible } = useResponsiveLayout();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Close emoji picker when keyboard appears on mobile
  useEffect(() => {
    if (isKeyboardVisible && isEmojiPickerOpen) {
      setIsEmojiPickerOpen(false);
    }
  }, [isKeyboardVisible, isEmojiPickerOpen]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if ((trimmedMessage || selectedFile) && !disabled) {
      onSendMessage(trimmedMessage || (selectedFile ? `📎 ${selectedFile.name}` : ''), selectedFile || undefined);
      setMessage('');
      setSelectedFile(null);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = () => {
    // Close emoji picker if keyboard is visible on mobile
    if (isKeyboardVisible) {
      textareaRef.current?.blur();
      setTimeout(() => {
        setIsEmojiPickerOpen(!isEmojiPickerOpen);
      }, 100);
    } else {
      setIsEmojiPickerOpen(!isEmojiPickerOpen);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    // Focus back to textarea after a short delay
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Close emoji picker if open
    setIsEmojiPickerOpen(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const canSend = (message.trim() || selectedFile) && !disabled;

  return (
    <div
      ref={containerRef}
      className={`bg-white border-t border-gray-200 ${isMobile && isKeyboardVisible
          ? 'pb-safe-area-inset-bottom'
          : ''
        }`}
    >
      {/* File Preview */}
      {selectedFile && (
        <div className="p-3 border-b border-gray-100">
          <FilePreview file={selectedFile} onRemove={handleRemoveFile} />
        </div>
      )}

      {/* Input Area */}
      <div className={`${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="flex items-end space-x-2 sm:space-x-3">
          {/* File Upload Button */}
          <FileUpload
            onFileSelect={handleFileSelect}
            disabled={disabled}
          />

          {/* Message Input Container */}
          <div className="flex-1 relative">
            <div className="flex items-end bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedFile ? "Add a caption..." : placeholder}
                disabled={disabled}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-none outline-none resize-none min-h-[40px] sm:min-h-[44px] max-h-[120px] placeholder-gray-500 text-gray-900 text-sm sm:text-base"
                rows={1}
              />

              {/* Emoji Button */}
              <button
                onClick={handleEmojiClick}
                className={`p-2 transition-colors flex-shrink-0 mr-1 sm:mr-2 ${isEmojiPickerOpen
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                disabled={disabled}
                aria-label="Add emoji"
              >
                <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`p-2 sm:p-3 rounded-full transition-colors flex-shrink-0 ${canSend
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Emoji Picker - Position below input */}
      {isEmojiPickerOpen && !isKeyboardVisible && (
        <EmojiPicker
          isOpen={isEmojiPickerOpen}
          onClose={() => setIsEmojiPickerOpen(false)}
          onEmojiSelect={handleEmojiSelect}
          position="bottom"
        />
      )}

      {/* Emoji Picker Modal for mobile when keyboard is visible */}
      {isEmojiPickerOpen && isKeyboardVisible && (
        <EmojiPicker
          isOpen={isEmojiPickerOpen}
          onClose={() => setIsEmojiPickerOpen(false)}
          onEmojiSelect={handleEmojiSelect}
          position="modal"
        />
      )}
    </div>
  );
};

export default MessageInput;
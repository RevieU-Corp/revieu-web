import React from 'react';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  position?: 'modal' | 'bottom';
}

const EMOJI_CATEGORIES = {
  'Recent': ['😀', '😊', '😂', '❤️', '👍', '🎉', '🔥', '💯'],
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  'Gestures': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  'Objects': ['🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '⭐', '🌟', '💫', '✨', '🔥', '💯', '✅', '❌', '⚡', '💡']
};

const EmojiPicker: React.FC<EmojiPickerProps> = ({ 
  isOpen, 
  onClose, 
  onEmojiSelect, 
  position = 'bottom' 
}) => {
  if (!isOpen) return null;

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    // Don't close automatically for better UX
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (position === 'modal') {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black bg-opacity-25"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-200 w-full max-w-sm mx-4 mb-0 sm:mb-4 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Emojis</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
            >
              ×
            </button>
          </div>

          {/* Emoji Grid */}
          <div className="p-4 overflow-y-auto max-h-80">
            {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
              <div key={category} className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={`${category}-${index}`}
                      onClick={() => handleEmojiClick(emoji)}
                      className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Bottom position (inline with input)
  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <div className="p-4 max-h-64 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Emojis</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ×
          </button>
        </div>
        
        {/* Quick Access Emojis */}
        <div className="mb-4">
          <div className="grid grid-cols-8 gap-2">
            {EMOJI_CATEGORIES.Recent.map((emoji, index) => (
              <button
                key={`recent-${index}`}
                onClick={() => handleEmojiClick(emoji)}
                className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* All Categories */}
        {Object.entries(EMOJI_CATEGORIES).slice(1).map(([category, emojis]) => (
          <div key={category} className="mb-3">
            <h5 className="text-xs font-medium text-gray-600 mb-2">{category}</h5>
            <div className="grid grid-cols-8 gap-1">
              {emojis.slice(0, 16).map((emoji, index) => (
                <button
                  key={`${category}-${index}`}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-7 h-7 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
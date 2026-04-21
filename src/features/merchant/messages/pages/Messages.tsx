import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';
import { Search, Plus, Minus } from 'lucide-react';
import ChatListItem from '../components/ChatListItem';
import SearchBar from '../../shared/components/SearchBar';
import CreateGroupModal from '../components/CreateGroupModal';
import DeleteModeHeader from '../../shared/components/DeleteModeHeader';
import Toast from '../../shared/components/Toast';
import { ChatItem } from '../../shared/types/chat';
import { messagingService } from '../../shared/services/messagingService';

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allChats, setAllChats] = useState<ChatItem[]>([]);
  const [filteredChats, setFilteredChats] = useState<ChatItem[]>([]);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  useEffect(() => {
    let isMounted = true;

    const loadChats = async () => {
      try {
        const chats = await messagingService.listConversations();
        if (!isMounted) {
          return;
        }
        setAllChats(chats);
        setFilteredChats(chats);
      } catch (error) {
        console.error('Failed to load merchant conversations:', error);
        if (isMounted) {
          setAllChats([]);
          setFilteredChats([]);
        }
      }
    };

    loadChats();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleConversationUpdated = async () => {
      try {
        const chats = await messagingService.listConversations();
        setAllChats(chats);
        if (searchQuery) {
          setFilteredChats(filterChats(chats, searchQuery));
        } else {
          setFilteredChats(chats);
        }
      } catch (error) {
        console.error('Failed to refresh merchant conversations:', error);
      }
    };

    window.addEventListener('conversationUpdated', handleConversationUpdated);

    return () => {
      window.removeEventListener('conversationUpdated', handleConversationUpdated);
    };
  }, [searchQuery]);

  // Keyboard shortcuts for delete mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDeleteMode) {
        if (e.key === 'Escape') {
          handleCancelDeleteMode();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          if (selectedChatIds.size > 0) {
            handleDeleteSelected();
          }
        } else if (e.ctrlKey && e.key === 'a') {
          e.preventDefault();
          handleSelectAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDeleteMode, selectedChatIds.size]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredChats(filterChats(allChats, query));
  };

  const handleNewChat = () => {
    setIsCreateGroupModalOpen(true);
  };

  const handleDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedChatIds(new Set());
  };

  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedChatIds(new Set());
  };

  const handleSelectChat = (chatId: string, selected: boolean) => {
    const newSelectedIds = new Set(selectedChatIds);
    if (selected) {
      newSelectedIds.add(chatId);
    } else {
      newSelectedIds.delete(chatId);
    }
    setSelectedChatIds(newSelectedIds);
  };

  const handleSelectAll = () => {
    const allChatIds = new Set(filteredChats.map(chat => chat.id));
    setSelectedChatIds(allChatIds);
  };

  const handleDeselectAll = () => {
    setSelectedChatIds(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedChatIds.size === 0) return;

    const chatNames = Array.from(selectedChatIds)
      .map(id => filteredChats.find(chat => chat.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedChatIds.size} chat${selectedChatIds.size !== 1 ? 's' : ''}?\n\n${chatNames}\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      const remainingChats = allChats.filter((chat) => !selectedChatIds.has(chat.id));
      setAllChats(remainingChats);
      setFilteredChats(filterChats(remainingChats, searchQuery));

      // Exit delete mode
      setIsDeleteMode(false);
      setSelectedChatIds(new Set());

      // Show success toast
      setToast({
        message: `${selectedChatIds.size} chat${selectedChatIds.size !== 1 ? 's' : ''} deleted successfully`,
        type: 'success',
        isVisible: true
      });
    }
  };

  const handleCreateGroup = async (groupName: string) => {
    try {
      const newConversation = await messagingService.createConversation(groupName);
      const nextChats = [newConversation, ...allChats];
      setAllChats(nextChats);
      setFilteredChats(filterChats(nextChats, searchQuery));
      setToast({
        message: `Group "${groupName}" created successfully!`,
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Failed to create conversation:', error);
      setToast({
        message: 'Failed to create group',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleCloseCreateGroupModal = () => {
    setIsCreateGroupModalOpen(false);
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleChatClick = (chatId: string) => {
    if (!isDeleteMode) {
      navigate(PATHS.MERCHANT.CHAT(chatId));
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top Navigation Bar */}
      {!isDeleteMode ? (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search chats or users..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Delete Mode Button */}
              <button
                onClick={handleDeleteMode}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Delete chats"
              >
                <Minus className="w-5 h-5" />
              </button>

              {/* Plus Button */}
              <button
                onClick={handleNewChat}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Create new chat"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Delete Mode Header */
        <DeleteModeHeader
          selectedCount={selectedChatIds.size}
          totalCount={filteredChats.length}
          isAllSelected={selectedChatIds.size === filteredChats.length && filteredChats.length > 0}
          onCancel={handleCancelDeleteMode}
          onDelete={handleDeleteSelected}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />
      )}

      {/* Main Content - Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              id={chat.id}
              name={chat.name}
              avatar={chat.avatar}
              lastMessage={chat.lastMessage}
              timestamp={chat.timestamp}
              unreadCount={chat.unreadCount}
              isMuted={chat.isMuted}
              isPinned={chat.isPinned}
              isDeleteMode={isDeleteMode}
              isSelected={selectedChatIds.has(chat.id)}
              onClick={handleChatClick}
              onSelect={handleSelectChat}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chats found</h3>
            <p className="text-gray-500 text-center">
              {searchQuery ? 'Try adjusting your search terms' : 'Start a new conversation to see it here'}
            </p>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={handleCloseCreateGroupModal}
        onCreateGroup={handleCreateGroup}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Messages;

const filterChats = (chats: ChatItem[], query: string): ChatItem[] => {
  if (!query.trim()) {
    return chats;
  }

  const normalizedQuery = query.toLowerCase();
  return chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(normalizedQuery) ||
      chat.lastMessage.toLowerCase().includes(normalizedQuery)
  );
};

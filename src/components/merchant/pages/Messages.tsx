import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Minus } from 'lucide-react';
import ChatListItem from '../components/ChatListItem';
import SearchBar from '../components/SearchBar';
import CreateGroupModal from '../components/CreateGroupModal';
import DeleteModeHeader from '../components/DeleteModeHeader';
import Toast from '../components/Toast';
import { ChatItem } from '../types/chat';
import { getStoredChats, addNewChat, searchStoredChats, deleteMultipleChats } from '../utils/chatStorage';
import { syncMessageStorageWithChatMetadata } from '../utils/messageStorage';

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

  // Load chats on component mount
  useEffect(() => {
    // Sync message storage with chat metadata to ensure consistency
    syncMessageStorageWithChatMetadata();
    
    const storedChats = getStoredChats();
    setAllChats(storedChats);
    setFilteredChats(storedChats);
  }, []);

  // Listen for chat updates from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedChats = getStoredChats();
      setAllChats(updatedChats);
      // Re-apply current search filter
      if (searchQuery) {
        const filtered = searchStoredChats(searchQuery);
        setFilteredChats(filtered);
      } else {
        setFilteredChats(updatedChats);
      }
    };

    // Listen for custom events from ChatDetail component
    const handleChatUpdated = handleStorageChange;
    window.addEventListener('chatUpdated', handleChatUpdated);
    
    return () => {
      window.removeEventListener('chatUpdated', handleChatUpdated);
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
    const filtered = searchStoredChats(query);
    setFilteredChats(filtered);
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
      const updatedChats = deleteMultipleChats(Array.from(selectedChatIds));
      setAllChats(updatedChats);
      
      // Re-apply search filter
      const filtered = searchStoredChats(searchQuery);
      setFilteredChats(filtered);
      
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

  const handleCreateGroup = (groupName: string) => {
    // Create new group
    const newGroup: ChatItem = {
      id: `group_${Date.now()}`,
      name: groupName,
      avatar: '', // Will show initials fallback
      lastMessage: 'Group created',
      timestamp: 'now',
      unreadCount: 0
    };
    
    // Add to persistent storage
    const updatedChats = addNewChat(newGroup);
    setAllChats(updatedChats);
    
    // Apply current search filter to the updated chats
    const filtered = searchStoredChats(searchQuery);
    setFilteredChats(filtered);

    // Show success toast
    setToast({
      message: `Group "${groupName}" created successfully!`,
      type: 'success',
      isVisible: true
    });

    // Store the new group data in sessionStorage for the ChatDetail component
    sessionStorage.setItem(`chat_${newGroup.id}`, JSON.stringify(newGroup));
  };

  const handleCloseCreateGroupModal = () => {
    setIsCreateGroupModalOpen(false);
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleChatClick = (chatId: string) => {
    if (!isDeleteMode) {
      navigate(`/merchant/messages/${chatId}`);
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
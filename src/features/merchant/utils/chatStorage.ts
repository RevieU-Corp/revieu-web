import { ChatItem } from '../types/chat';
import { mockChats } from './mockData';
import { getAllChatSettings, deleteSettingsForChats } from './chatSettings';
import { deleteMessagesForChats, getMessagesForChatPersistent, saveMessagesForChat } from './messageStorage';

const CHATS_STORAGE_KEY = 'merchant_all_chats';

// Helper function to determine if a lastMessage should trigger sync message creation
const shouldCreateSyncMessage = (lastMessage: string): boolean => {
  const skipMessages = [
    'Group created',
    'No messages',
    'Group chat',
    'Start a conversation',
    ''
  ];
  return !skipMessages.includes(lastMessage);
};

// Get all stored chats with settings merged
export const getStoredChats = (): ChatItem[] => {
  try {
    const stored = localStorage.getItem(CHATS_STORAGE_KEY);
    let chats: ChatItem[];

    if (stored) {
      chats = JSON.parse(stored);
    } else {
      // If no stored chats, initialize with mock data
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(mockChats));
      chats = mockChats;
    }

    // Merge with settings
    const allSettings = getAllChatSettings();
    const chatsWithSettings = chats.map(chat => ({
      ...chat,
      isMuted: allSettings[chat.id]?.isMuted || false,
      isPinned: allSettings[chat.id]?.isPinned || false
    }));

    // Sort: pinned chats first, then by timestamp
    return chatsWithSettings.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // For same pin status, sort by timestamp (newest first)
      if (a.timestamp === 'now') return -1;
      if (b.timestamp === 'now') return 1;

      // Simple timestamp comparison (in real app, use proper date parsing)
      return 0;
    });
  } catch (error) {
    console.error('Error loading stored chats:', error);
    return mockChats;
  }
};

// Save all chats
export const saveAllChats = (chats: ChatItem[]): void => {
  try {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Error saving chats:', error);
  }
};

// Add a new chat
export const addNewChat = (chat: ChatItem): ChatItem[] => {
  const existingChats = getStoredChats();
  const updatedChats = [chat, ...existingChats];
  saveAllChats(updatedChats);
  return updatedChats;
};

// Update a chat's last message and timestamp
export const updateChatLastMessage = (chatId: string, lastMessage: string, timestamp: string): ChatItem[] => {
  const existingChats = getStoredChats();
  const updatedChats = existingChats.map(chat => {
    if (chat.id === chatId) {
      return {
        ...chat,
        lastMessage,
        timestamp,
        unreadCount: 0 // Reset unread count when we send a message
      };
    }
    return chat;
  });

  // Move the updated chat to the top
  const updatedChat = updatedChats.find(chat => chat.id === chatId);
  const otherChats = updatedChats.filter(chat => chat.id !== chatId);
  const finalChats = updatedChat ? [updatedChat, ...otherChats] : updatedChats;

  saveAllChats(finalChats);

  // Ensure message storage is in sync - if we're updating lastMessage but there are no messages in storage,
  // we should create a message entry to maintain consistency
  try {
    const existingMessages = getMessagesForChatPersistent(chatId);

    // If no messages exist but we're setting a meaningful lastMessage, create a placeholder
    if (existingMessages.length === 0 && lastMessage && shouldCreateSyncMessage(lastMessage)) {
      const placeholderMessage = {
        id: `sync_${Date.now()}`,
        chatId: chatId,
        senderId: chatId.startsWith('group_') ? 'unknown' : chatId,
        senderName: chatId.startsWith('group_') ? 'Unknown' : (updatedChat?.name || 'Unknown'),
        senderAvatar: updatedChat?.avatar || '',
        content: lastMessage,
        timestamp: timestamp,
        type: 'text' as const,
        isRead: true
      };

      saveMessagesForChat(chatId, [placeholderMessage]);
    }
  } catch (error) {
    console.error('Error syncing message storage with chat metadata:', error);
  }

  return finalChats;
};

// Search chats with settings
export const searchStoredChats = (query: string): ChatItem[] => {
  const allChats = getStoredChats(); // This now includes settings
  if (!query.trim()) return allChats;

  return allChats.filter(chat =>
    chat.name.toLowerCase().includes(query.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(query.toLowerCase())
  );
};

// Delete a chat
export const deleteChat = (chatId: string): ChatItem[] => {
  try {
    const storedChats = localStorage.getItem(CHATS_STORAGE_KEY);
    if (storedChats) {
      const chats: ChatItem[] = JSON.parse(storedChats);
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
      return getStoredChats(); // Return updated chats with settings
    }
    return getStoredChats();
  } catch (error) {
    console.error('Error deleting chat:', error);
    return getStoredChats();
  }
};

// Delete multiple chats
export const deleteMultipleChats = (chatIds: string[]): ChatItem[] => {
  try {
    const storedChats = localStorage.getItem(CHATS_STORAGE_KEY);
    if (storedChats) {
      const chats: ChatItem[] = JSON.parse(storedChats);
      const updatedChats = chats.filter(chat => !chatIds.includes(chat.id));
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));

      // Clean up related data
      deleteSettingsForChats(chatIds);
      deleteMessagesForChats(chatIds);

      return getStoredChats(); // Return updated chats with settings
    }
    return getStoredChats();
  } catch (error) {
    console.error('Error deleting chats:', error);
    return getStoredChats();
  }
};
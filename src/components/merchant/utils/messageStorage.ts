import { ChatMessage } from '../types/chat';

const MESSAGES_STORAGE_KEY = 'merchant_chat_messages';

// Get all stored messages
export const getStoredMessages = (): Record<string, ChatMessage[]> => {
  try {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading stored messages:', error);
    return {};
  }
};

// Save messages for a specific chat
export const saveMessagesForChat = (chatId: string, messages: ChatMessage[]): void => {
  try {
    const allMessages = getStoredMessages();
    allMessages[chatId] = messages;
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

// Get messages for a specific chat
export const getMessagesForChatPersistent = (chatId: string): ChatMessage[] => {
  const allMessages = getStoredMessages();
  return allMessages[chatId] || [];
};

// Add a new message to a chat
export const addMessageToChat = (chatId: string, message: ChatMessage): void => {
  const existingMessages = getMessagesForChatPersistent(chatId);
  const updatedMessages = [...existingMessages, message];
  saveMessagesForChat(chatId, updatedMessages);
};

// Clear all messages for a chat
export const clearMessagesForChat = (chatId: string): void => {
  try {
    const allMessages = getStoredMessages();
    delete allMessages[chatId];
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));
  } catch (error) {
    console.error('Error clearing messages:', error);
  }
};

// Delete all messages for multiple chats
export const deleteMessagesForChats = (chatIds: string[]): void => {
  try {
    const allMessages = getStoredMessages();
    chatIds.forEach(chatId => {
      delete allMessages[chatId];
    });
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));
  } catch (error) {
    console.error('Error deleting messages for chats:', error);
  }
};

// Sync message storage with chat metadata - ensures consistency between the two systems
export const syncMessageStorageWithChatMetadata = (): void => {
  try {
    const chatStorageKey = 'merchant_all_chats';
    const storedChats = localStorage.getItem(chatStorageKey);
    if (!storedChats) return;
    
    const chats = JSON.parse(storedChats);
    const allMessages = getStoredMessages();
    
    chats.forEach((chat: any) => {
      const chatId = chat.id;
      const existingMessages = allMessages[chatId] || [];
      
      // If chat has a meaningful lastMessage but no messages in storage, create a reconstructed message
      if (existingMessages.length === 0 && chat.lastMessage && shouldReconstructMessage(chat.lastMessage)) {
        const reconstructedMessage: ChatMessage = {
          id: `sync_${Date.now()}_${chatId}`,
          chatId: chatId,
          senderId: determineMessageSender(chatId, chat),
          senderName: determineMessageSenderName(chatId, chat),
          senderAvatar: chat.avatar || '',
          content: chat.lastMessage,
          timestamp: chat.timestamp || 'recently',
          type: 'text',
          isRead: true
        };
        
        allMessages[chatId] = [reconstructedMessage];
      }
    });
    
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(allMessages));
  } catch (error) {
    console.error('Error syncing message storage with chat metadata:', error);
  }
};

// Initialize messages for a chat (merge with mock data if first time)
export const initializeMessagesForChat = (chatId: string, mockMessages: ChatMessage[]): ChatMessage[] => {
  const storedMessages = getMessagesForChatPersistent(chatId);
  
  // If we have stored messages, return them
  if (storedMessages.length > 0) {
    return storedMessages;
  }
  
  // If no stored messages but we have mock data, use mock data as initial
  if (mockMessages.length > 0) {
    saveMessagesForChat(chatId, mockMessages);
    return mockMessages;
  }
  
  // If no stored messages and no mock data, check if chat metadata exists with lastMessage
  // This handles cases where chat list shows a message preview but message storage is empty
  try {
    const chatStorageKey = 'merchant_all_chats';
    const storedChats = localStorage.getItem(chatStorageKey);
    if (storedChats) {
      const chats = JSON.parse(storedChats);
      const chat = chats.find((c: any) => c.id === chatId);
      
      // If chat exists and has a meaningful lastMessage, create a reconstructed message
      if (chat && chat.lastMessage && shouldReconstructMessage(chat.lastMessage)) {
        const reconstructedMessage: ChatMessage = {
          id: `reconstructed_${Date.now()}`,
          chatId: chatId,
          senderId: determineMessageSender(chatId, chat),
          senderName: determineMessageSenderName(chatId, chat),
          senderAvatar: chat.avatar || '',
          content: chat.lastMessage,
          timestamp: chat.timestamp || 'recently',
          type: 'text',
          isRead: true
        };
        
        // Save the reconstructed message
        saveMessagesForChat(chatId, [reconstructedMessage]);
        return [reconstructedMessage];
      }
    }
  } catch (error) {
    console.error('Error reconstructing messages from chat metadata:', error);
  }
  
  // Return empty array if no messages can be found or reconstructed
  return [];
};

// Helper function to determine if a lastMessage should be reconstructed
const shouldReconstructMessage = (lastMessage: string): boolean => {
  const skipMessages = [
    'Group created',
    'No messages',
    'Group chat',
    'Start a conversation',
    ''
  ];
  return !skipMessages.includes(lastMessage);
};

// Helper function to determine the sender ID for reconstructed messages
const determineMessageSender = (chatId: string, chat: any): string => {
  if (chatId.startsWith('group_')) {
    return 'unknown'; // For groups, we don't know who sent the last message
  }
  
  // For 1-on-1 chats, assume the message is from the other person (not the current user)
  return chatId;
};

// Helper function to determine the sender name for reconstructed messages
const determineMessageSenderName = (chatId: string, chat: any): string => {
  if (chatId.startsWith('group_')) {
    return 'Unknown'; // For groups, we don't know who sent the last message
  }
  
  // For 1-on-1 chats, use the chat name
  return chat.name || 'Unknown';
};

// Force sync between chat metadata and message storage (useful for debugging)
export const forceSyncChatAndMessages = (): void => {
  console.log('Forcing sync between chat metadata and message storage...');
  syncMessageStorageWithChatMetadata();
  console.log('Sync completed.');
};
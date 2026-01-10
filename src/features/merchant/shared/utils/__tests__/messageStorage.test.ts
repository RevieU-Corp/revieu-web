import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initializeMessagesForChat,
  syncMessageStorageWithChatMetadata
} from '../messageStorage';
import { ChatMessage } from '../../types/chat';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Message Storage Sync Fix', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reconstruct messages from chat metadata when message storage is empty', () => {
    // Mock chat metadata with lastMessage but no message storage
    const mockChatData = JSON.stringify([
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://example.com/avatar.jpg',
        lastMessage: 'Hi! Is the chocolate cake still available?',
        timestamp: '2m ago'
      }
    ]);

    // Mock empty message storage
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'merchant_all_chats') return mockChatData;
      if (key === 'merchant_chat_messages') return '{}';
      return null;
    });

    const mockMessages: ChatMessage[] = []; // No mock messages
    const result = initializeMessagesForChat('1', mockMessages);

    // Should reconstruct a message from chat metadata
    expect(result).toHaveLength(1);
    expect(result[0].content).toBe('Hi! Is the chocolate cake still available?');
    expect(result[0].chatId).toBe('1');
    expect(result[0].senderName).toBe('Sarah Johnson');
  });

  it('should not reconstruct messages for system messages', () => {
    const mockChatData = JSON.stringify([
      {
        id: 'group_123',
        name: 'Test Group',
        lastMessage: 'Group created',
        timestamp: 'now'
      }
    ]);

    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'merchant_all_chats') return mockChatData;
      if (key === 'merchant_chat_messages') return '{}';
      return null;
    });

    const result = initializeMessagesForChat('group_123', []);

    // Should not reconstruct system messages
    expect(result).toHaveLength(0);
  });

  it('should handle group chats differently from 1-on-1 chats', () => {
    const mockChatData = JSON.stringify([
      {
        id: 'group_456',
        name: 'Team Chat',
        lastMessage: 'Hello everyone!',
        timestamp: '5m ago'
      }
    ]);

    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'merchant_all_chats') return mockChatData;
      if (key === 'merchant_chat_messages') return '{}';
      return null;
    });

    const result = initializeMessagesForChat('group_456', []);

    expect(result).toHaveLength(1);
    expect(result[0].senderId).toBe('unknown'); // Groups have unknown sender
    expect(result[0].senderName).toBe('Unknown');
  });

  it('should return existing messages if they exist', () => {
    const existingMessages = JSON.stringify({
      '1': [
        {
          id: 'msg_1',
          chatId: '1',
          content: 'Existing message',
          senderId: '1',
          senderName: 'Sarah',
          timestamp: '1h ago',
          type: 'text',
          isRead: true
        }
      ]
    });

    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'merchant_chat_messages') return existingMessages;
      return null;
    });

    const result = initializeMessagesForChat('1', []);

    expect(result).toHaveLength(1);
    expect(result[0].content).toBe('Existing message');
  });

  it('should sync all chats with missing messages', () => {
    const mockChatData = JSON.stringify([
      {
        id: '1',
        name: 'Sarah Johnson',
        lastMessage: 'Hello there!',
        timestamp: '1m ago'
      },
      {
        id: '2',
        name: 'Mike Chen',
        lastMessage: 'Thanks!',
        timestamp: '5m ago'
      }
    ]);

    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'merchant_all_chats') return mockChatData;
      if (key === 'merchant_chat_messages') return '{}';
      return null;
    });

    syncMessageStorageWithChatMetadata();

    // Should have called setItem to save reconstructed messages
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'merchant_chat_messages',
      expect.stringContaining('Hello there!')
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'merchant_chat_messages',
      expect.stringContaining('Thanks!')
    );
  });
});
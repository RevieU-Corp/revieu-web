import { apiClient } from '../../../../api/apiClient';
import { ChatItem, ChatMessage } from '../types/chat';

type BackendConversation = {
  id: number | string;
  title: string;
  avatar_url?: string;
  last_message?: string;
  last_message_at?: string | null;
  unread_count?: number;
  is_muted?: boolean;
};

type BackendMessage = {
  id: number | string;
  conversation_id: number | string;
  sender_id: number | string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  is_read: boolean;
  created_at: string;
};

const formatRelativeTime = (value?: string | null): string => {
  if (!value) {
    return 'now';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'now';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes <= 0) {
    return 'now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatMessageTimestamp = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'now';
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

const mapConversation = (conversation: BackendConversation): ChatItem => ({
  id: String(conversation.id),
  name: conversation.title || 'Conversation',
  avatar: conversation.avatar_url || '',
  lastMessage: conversation.last_message || 'Start a conversation',
  timestamp: formatRelativeTime(conversation.last_message_at),
  unreadCount: conversation.unread_count || 0,
  isMuted: Boolean(conversation.is_muted),
  isOnline: false,
});

const mapMessage = (message: BackendMessage): ChatMessage => ({
  id: String(message.id),
  chatId: String(message.conversation_id),
  senderId: String(message.sender_id),
  senderName: message.sender_name,
  senderAvatar: message.sender_avatar || '',
  content: message.content,
  timestamp: formatMessageTimestamp(message.created_at),
  type: message.message_type || 'text',
  isRead: message.is_read,
});

export const messagingService = {
  async listConversations(): Promise<ChatItem[]> {
    const response = await apiClient.get('/conversations');
    const conversations = Array.isArray(response.data?.data) ? response.data.data : [];
    return conversations.map((conversation: BackendConversation) => mapConversation(conversation));
  },

  async createConversation(title: string): Promise<ChatItem> {
    const response = await apiClient.post('/conversations', {
      title,
      type: 'group',
    });
    return mapConversation(response.data.data);
  },

  async getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get(`/conversations/${conversationId}/messages`);
    const messages = Array.isArray(response.data?.data) ? response.data.data : [];
    return messages.map((message: BackendMessage) => mapMessage(message));
  },

  async sendMessage(conversationId: string, content: string): Promise<ChatMessage> {
    const response = await apiClient.post(`/conversations/${conversationId}/messages`, {
      content,
      message_type: 'text',
    });
    return mapMessage(response.data.data);
  },

  async updateConversationSettings(conversationId: string, isMuted: boolean): Promise<ChatItem> {
    const response = await apiClient.patch(`/conversations/${conversationId}/settings`, {
      is_muted: isMuted,
    });
    return mapConversation(response.data.data);
  },
};

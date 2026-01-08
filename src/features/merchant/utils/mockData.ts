import { ChatItem, ChatMessage } from '../types/chat';

export const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    lastMessage: 'Hi! Is the chocolate cake still available?',
    timestamp: '2m ago',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    lastMessage: 'Thank you for the quick delivery!',
    timestamp: '15m ago',
    isOnline: false,
    lastSeen: '10m ago'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    lastMessage: 'Can I modify my order?',
    timestamp: '1h ago',
    unreadCount: 1,
    isOnline: true
  },
  {
    id: '4',
    name: 'David Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    lastMessage: 'Great service as always!',
    timestamp: '2h ago',
    isOnline: false,
    lastSeen: '1h ago'
  },
  {
    id: '5',
    name: 'Lisa Park',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
    lastMessage: 'What time do you close today?',
    timestamp: '3h ago',
    isOnline: true
  },
  {
    id: '6',
    name: 'James Thompson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    lastMessage: 'The food was amazing! Will order again.',
    timestamp: '5h ago',
    isOnline: false,
    lastSeen: '3h ago'
  },
  {
    id: '7',
    name: 'Anna Martinez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
    lastMessage: 'Do you have any vegan options?',
    timestamp: '1d ago',
    isOnline: false,
    lastSeen: '12h ago'
  },
  {
    id: '8',
    name: 'Robert Kim',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
    lastMessage: 'Thanks for accommodating my dietary restrictions.',
    timestamp: '2d ago',
    isOnline: false,
    lastSeen: '1d ago'
  }
];

// Mock messages for each chat
export const mockMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: 'msg_1_1',
      chatId: '1',
      senderId: '1',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      content: 'Hello! I saw your bakery on the app and I\'m interested in ordering a cake.',
      timestamp: '10:30 AM',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg_1_2',
      chatId: '1',
      senderId: 'merchant_1',
      senderName: 'Merchant',
      content: 'Hi Sarah! Thank you for your interest. What kind of cake are you looking for?',
      timestamp: '10:32 AM',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg_1_3',
      chatId: '1',
      senderId: '1',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      content: 'I\'m looking for a chocolate cake for my daughter\'s birthday. Do you have any available for this weekend?',
      timestamp: '10:35 AM',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg_1_4',
      chatId: '1',
      senderId: 'merchant_1',
      senderName: 'Merchant',
      content: 'Absolutely! We have several chocolate cake options. Would you like a custom design or one of our signature cakes?',
      timestamp: '10:37 AM',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg_1_5',
      chatId: '1',
      senderId: '1',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      content: 'Hi! Is the chocolate cake still available?',
      timestamp: '2m ago',
      type: 'text',
      isRead: false
    }
  ],
  '2': [
    {
      id: 'msg_2_1',
      chatId: '2',
      senderId: '2',
      senderName: 'Mike Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      content: 'Hi, I just received my order. The food looks amazing!',
      timestamp: '2:15 PM',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg_2_2',
      chatId: '2',
      senderId: 'merchant_1',
      senderName: 'Merchant',
      content: 'Thank you so much Mike! We really appreciate your business. How does everything taste?',
      timestamp: '2:18 PM',
      type: 'text',
      isRead: true
    },
    {
      id: 'msg_2_3',
      chatId: '2',
      senderId: '2',
      senderName: 'Mike Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      content: 'Thank you for the quick delivery!',
      timestamp: '15m ago',
      type: 'text',
      isRead: false
    }
  ]
};

export const getRandomChats = (count: number = 8): ChatItem[] => {
  return mockChats.slice(0, count);
};

export const searchChats = (chats: ChatItem[], query: string): ChatItem[] => {
  if (!query.trim()) return chats;
  
  return chats.filter(chat =>
    chat.name.toLowerCase().includes(query.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(query.toLowerCase())
  );
};

export const getMessagesForChat = (chatId: string): ChatMessage[] => {
  return mockMessages[chatId] || [];
};
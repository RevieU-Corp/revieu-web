import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { ChatItem, ChatMessage } from '../../shared/types/chat';
import { messagingService } from '../../shared/services/messagingService';
import { useAuth } from '../../../../contexts/AuthContext';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import ChatSettingsDrawer from '../components/ChatSettingsDrawer';

const ChatDetail: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chat, setChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [chatSettings, setChatSettings] = useState({ isMuted: false, isPinned: false });

  // Scroll to bottom of messages
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    // Use immediate scroll for initial load, smooth for new messages
    const isInitialLoad = messages.length <= 1;
    scrollToBottom(isInitialLoad ? 'auto' : 'smooth');
  }, [messages]);

  // Scroll to bottom when chat changes
  useEffect(() => {
    if (chat) {
      // Small delay to ensure DOM is updated
      setTimeout(() => scrollToBottom('auto'), 100);
    }
  }, [chat?.id]);

  useEffect(() => {
    if (!chatId) {
      navigate(PATHS.MERCHANT.MESSAGES);
      return;
    }

    let isMounted = true;

    const loadConversation = async () => {
      try {
        const [conversations, conversationMessages] = await Promise.all([
          messagingService.listConversations(),
          messagingService.getConversationMessages(chatId),
        ]);
        if (!isMounted) {
          return;
        }
        const foundChat = conversations.find((conversation) => conversation.id === chatId) || null;
        if (!foundChat) {
          navigate(PATHS.MERCHANT.MESSAGES);
          return;
        }
        setChat(foundChat);
        setMessages(conversationMessages);
        setChatSettings({
          isMuted: Boolean(foundChat.isMuted),
          isPinned: Boolean(foundChat.isPinned),
        });
      } catch (error) {
        console.error('Error loading conversation:', error);
        navigate(PATHS.MERCHANT.MESSAGES);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadConversation();

    return () => {
      isMounted = false;
    };
  }, [chatId, navigate]);

  const handleBack = () => {
    navigate(PATHS.MERCHANT.MESSAGES);
  };

  const handleSendMessage = (content: string, file?: File) => {
    if (!chat || (!content.trim() && !file)) return;

    const messageContent = content.trim() || (file ? `Attachment: ${file.name}` : '');

    void messagingService.sendMessage(chat.id, messageContent)
      .then((newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        setChat((prev) => prev ? { ...prev, lastMessage: newMessage.content, timestamp: 'now' } : prev);
        window.dispatchEvent(new CustomEvent('conversationUpdated'));
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
      });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleMoreOptions = () => {
    setIsSettingsDrawerOpen(true);
  };

  const handleSearchMessages = () => {
    if (!chat) return;
    navigate(PATHS.MERCHANT.SEARCH_MESSAGES(chat.id));
  };

  const handleMuteNotifications = () => {
    if (!chat) return;
    const newMuteStatus = !chatSettings.isMuted;
    void messagingService.updateConversationSettings(chat.id, newMuteStatus)
      .then((updatedConversation) => {
        setChat(updatedConversation);
        setChatSettings(prev => ({ ...prev, isMuted: newMuteStatus }));
        window.dispatchEvent(new CustomEvent('conversationUpdated'));
      })
      .catch((error) => {
        console.error('Failed to update conversation settings:', error);
      });
  };

  const handlePinChat = () => {
    if (!chat) return;
    const newPinStatus = !chatSettings.isPinned;
    setChatSettings(prev => ({ ...prev, isPinned: newPinStatus }));
  };

  const handleClearMessages = () => {
    if (!chat) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to clear all messages in this chat with ${chat.name}? This action cannot be undone.`
    );

    if (confirmed) {
      setMessages([]);
      setIsSettingsDrawerOpen(false);
    }
  };

  // Show loading state
  if (isLoading || !chat) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="chat-container bg-gray-50 overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left Section - Back Button and Chat Info */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="Go back to messages"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Chat Avatar and Name */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                {chat.avatar ? (
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLDivElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-10 h-10 rounded-full bg-blue-500 text-white font-semibold ${chat.avatar ? 'hidden' : 'flex'} items-center justify-center text-sm`}
                >
                  {getInitials(chat.name)}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-semibold text-gray-900 truncate">{chat.name}</h1>
                <p className="text-sm text-gray-500 truncate">
                  {chat.isOnline ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0"></span>
                      Online
                    </span>
                  ) : (
                    chat.lastSeen && `Last seen ${chat.lastSeen}`
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - More Options */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={handleMoreOptions}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="chat-messages custom-scrollbar messages-container">
        {messages.length === 0 ? (
          /* Welcome Message for Empty Chats */
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm max-w-md mx-auto">
                <div className="mb-4">
                  {chat.avatar ? (
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center text-xl mx-auto">
                      {getInitials(chat.name)}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {chat.id.startsWith('group_') ? `Welcome to ${chat.name}` : `Chat with ${chat.name}`}
                </h3>
                <p className="text-gray-600 text-sm">
                  {chat.id.startsWith('group_')
                    ? `This is the beginning of your group conversation in ${chat.name}.`
                    : `This is the beginning of your conversation with ${chat.name}.`
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="p-4">
            <div className="space-y-1">
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === String(user?.id ?? '');
                const prevMessage = messages[index - 1];
                const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={isOwnMessage}
                    showAvatar={showAvatar}
                  />
                );
              })}
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="chat-input">
        <MessageInput
          onSendMessage={handleSendMessage}
          placeholder={`Message ${chat.name}...`}
        />
      </div>

      {/* Chat Settings Drawer */}
      <ChatSettingsDrawer
        isOpen={isSettingsDrawerOpen}
        onClose={() => setIsSettingsDrawerOpen(false)}
        chatName={chat.name}
        onSearchMessages={handleSearchMessages}
        onMuteNotifications={handleMuteNotifications}
        onPinChat={handlePinChat}
        onClearMessages={handleClearMessages}
        isMuted={chatSettings.isMuted}
        isPinned={chatSettings.isPinned}
      />
    </div>
  );
};

export default ChatDetail;

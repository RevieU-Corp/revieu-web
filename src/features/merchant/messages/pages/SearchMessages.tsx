import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';
import { ArrowLeft, Search, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../../shared/types/chat';
import { messagingService } from '../../shared/services/messagingService';
import { useAuth } from '../../../../contexts/AuthContext';
import MessageBubble from '../components/MessageBubble';
import SearchBar from '../../shared/components/SearchBar';

const SearchMessages: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ChatMessage[]>([]);
  const [chatName, setChatName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chatId) {
      navigate(PATHS.MERCHANT.MESSAGES);
      return;
    }

    let isMounted = true;

    const loadConversationMessages = async () => {
      try {
        const [conversations, messages] = await Promise.all([
          messagingService.listConversations(),
          messagingService.getConversationMessages(chatId),
        ]);
        if (!isMounted) {
          return;
        }
        const chat = conversations.find((conversation) => conversation.id === chatId);
        setChatName(chat?.name || 'Conversation');
        setAllMessages(messages);
        setFilteredMessages(messages);
      } catch (error) {
        console.error('Failed to load searchable messages:', error);
        if (isMounted) {
          setAllMessages([]);
          setFilteredMessages([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadConversationMessages();

    return () => {
      isMounted = false;
    };
  }, [chatId, navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredMessages(allMessages);
      return;
    }

    const filtered = allMessages.filter(message =>
      message.content.toLowerCase().includes(query.toLowerCase()) ||
      message.senderName.toLowerCase().includes(query.toLowerCase()) ||
      (message.fileName && message.fileName.toLowerCase().includes(query.toLowerCase()))
    );

    setFilteredMessages(filtered);
  };

  const handleBack = () => {
    navigate(PATHS.MERCHANT.CHAT(chatId || ''));
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  const renderSearchResult = (message: ChatMessage, index: number) => {
    const isOwnMessage = message.senderId === String(user?.id ?? '');
    const prevMessage = filteredMessages[index - 1];
    const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

    // Create a highlighted version of the message
    const highlightedMessage = {
      ...message,
      content: searchQuery ? highlightText(message.content, searchQuery) : message.content
    };

    return (
      <div key={message.id} className="border-b border-gray-100 pb-4 mb-4 last:border-b-0">
        <MessageBubble
          message={highlightedMessage}
          isOwnMessage={isOwnMessage}
          showAvatar={showAvatar}
        />
        {searchQuery && (
          <div className="mt-2 text-xs text-gray-500 px-4">
            {message.timestamp} • Match in message content
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-3 mb-3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back to chat"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Search Messages</h1>
            <p className="text-sm text-gray-500">{chatName}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search in conversation..."
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            {searchQuery ? (
              // No search results
              <>
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500 text-center">
                  No messages found matching "{searchQuery}". Try different keywords.
                </p>
              </>
            ) : (
              // No messages in chat
              <>
                <div className="text-gray-400 mb-4">
                  <MessageSquare className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
                <p className="text-gray-500 text-center">
                  This conversation doesn't have any messages yet.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="p-4">
            {searchQuery && (
              <div className="mb-4 text-sm text-gray-600">
                Found {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
            )}

            <div className="space-y-1">
              {filteredMessages.map((message, index) => renderSearchResult(message, index))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMessages;

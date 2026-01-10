const CHAT_SETTINGS_STORAGE_KEY = 'merchant_chat_settings';

interface ChatSettings {
  isMuted: boolean;
  isPinned: boolean;
}

type ChatSettingsMap = Record<string, ChatSettings>;

// Get all chat settings
export const getAllChatSettings = (): ChatSettingsMap => {
  try {
    const stored = localStorage.getItem(CHAT_SETTINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading chat settings:', error);
    return {};
  }
};

// Get settings for a specific chat
export const getChatSettings = (chatId: string): ChatSettings => {
  const allSettings = getAllChatSettings();
  return allSettings[chatId] || { isMuted: false, isPinned: false };
};

// Update settings for a specific chat
export const updateChatSettings = (chatId: string, settings: Partial<ChatSettings>): void => {
  try {
    const allSettings = getAllChatSettings();
    allSettings[chatId] = {
      ...getChatSettings(chatId),
      ...settings
    };
    localStorage.setItem(CHAT_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
  } catch (error) {
    console.error('Error saving chat settings:', error);
  }
};

// Toggle mute status
export const toggleChatMute = (chatId: string): boolean => {
  const currentSettings = getChatSettings(chatId);
  const newMuteStatus = !currentSettings.isMuted;
  updateChatSettings(chatId, { isMuted: newMuteStatus });
  return newMuteStatus;
};

// Toggle pin status
export const toggleChatPin = (chatId: string): boolean => {
  const currentSettings = getChatSettings(chatId);
  const newPinStatus = !currentSettings.isPinned;
  updateChatSettings(chatId, { isPinned: newPinStatus });
  return newPinStatus;
};

// Delete settings for multiple chats
export const deleteSettingsForChats = (chatIds: string[]): void => {
  try {
    const allSettings = getAllChatSettings();
    chatIds.forEach(chatId => {
      delete allSettings[chatId];
    });
    localStorage.setItem(CHAT_SETTINGS_STORAGE_KEY, JSON.stringify(allSettings));
  } catch (error) {
    console.error('Error deleting chat settings:', error);
  }
};
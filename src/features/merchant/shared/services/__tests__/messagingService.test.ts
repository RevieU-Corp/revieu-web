import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet, mockPatch, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPatch: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock('../../../../../api/apiClient', () => ({
  apiClient: {
    get: mockGet,
    patch: mockPatch,
    delete: mockDelete,
  },
}));

import { messagingService } from '../messagingService';

const conversationResponse = {
  id: 42,
  title: 'Revieu Demo Cafe',
  last_message: 'See you tomorrow',
  last_message_at: '2026-08-22T12:00:00.000Z',
  unread_count: 2,
  is_muted: false,
  is_pinned: true,
};

describe('messagingService', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPatch.mockReset();
    mockDelete.mockReset();
  });

  it('maps the server pinned state when listing conversations', async () => {
    mockGet.mockResolvedValue({ data: { data: [conversationResponse] } });

    const conversations = await messagingService.listConversations();

    expect(mockGet).toHaveBeenCalledWith('/conversations');
    expect(conversations[0]).toMatchObject({
      id: '42',
      name: 'Revieu Demo Cafe',
      isPinned: true,
      isMuted: false,
    });
  });

  it('sends only the requested settings and returns the persisted server state', async () => {
    mockPatch.mockResolvedValue({ data: { data: conversationResponse } });

    const conversation = await messagingService.updateConversationSettings('42', { isPinned: true });

    expect(mockPatch).toHaveBeenCalledWith('/conversations/42/settings', {
      is_pinned: true,
    });
    expect(conversation.isPinned).toBe(true);
  });

  it('uses persistent delete and clear endpoints', async () => {
    mockDelete.mockResolvedValue({ data: { status: 'ok' } });

    await messagingService.deleteConversation('42');
    await messagingService.clearConversationMessages('42');

    expect(mockDelete).toHaveBeenNthCalledWith(1, '/conversations/42');
    expect(mockDelete).toHaveBeenNthCalledWith(2, '/conversations/42/messages');
  });
});

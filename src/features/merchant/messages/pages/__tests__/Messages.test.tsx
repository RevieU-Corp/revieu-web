import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { listConversationsMock } = vi.hoisted(() => ({
  listConversationsMock: vi.fn(),
}));

vi.mock('../../../shared/services/messagingService', () => ({
  messagingService: {
    listConversations: listConversationsMock,
  },
}));

describe('Messages', () => {
  beforeEach(() => {
    listConversationsMock.mockReset();
    listConversationsMock.mockResolvedValue([
      {
        id: 'c-1',
        name: 'Revieu VIP Group',
        avatar: '',
        lastMessage: 'Live API conversation',
        timestamp: 'now',
        unreadCount: 1,
      },
    ]);
    localStorage.clear();
  });

  it('loads conversations from the messaging service instead of seeded local storage', async () => {
    const { default: Messages } = await import('../Messages');

    render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(listConversationsMock).toHaveBeenCalled();
    });

    expect(screen.getByText('Revieu VIP Group')).toBeInTheDocument();
  });
});

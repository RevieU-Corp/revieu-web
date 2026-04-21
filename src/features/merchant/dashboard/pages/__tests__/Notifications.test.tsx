import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { listNotificationsMock } = vi.hoisted(() => ({
  listNotificationsMock: vi.fn(),
}));

vi.mock('../../../shared/services/notificationService', () => ({
  notificationService: {
    listNotifications: listNotificationsMock,
  },
}));

describe('Merchant Notifications', () => {
  beforeEach(() => {
    listNotificationsMock.mockReset();
    listNotificationsMock.mockResolvedValue([
      {
        id: 'n-1',
        title: 'Verification submitted',
        content: 'We received your documents.',
        isRead: false,
        createdAt: '2026-03-28T08:00:00Z',
      },
    ]);
  });

  it('renders backend notifications instead of static placeholder cards', async () => {
    const { default: Notifications } = await import('../Notifications');

    render(<Notifications />);

    await waitFor(() => {
      expect(listNotificationsMock).toHaveBeenCalled();
    });

    expect(screen.getByText('Verification submitted')).toBeInTheDocument();
    expect(screen.getByText('We received your documents.')).toBeInTheDocument();
  });
});

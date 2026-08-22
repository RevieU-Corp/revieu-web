import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import Header from '../Header';

vi.mock('../../../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'tester@example.com',
      name: 'Tester',
      role: 'user',
    },
  }),
}));

describe('Header', () => {
  it('keeps search tap navigation and exposes named header actions', () => {
    const onSearchTap = vi.fn();
    const onNotificationTap = vi.fn();
    const onProfileTap = vi.fn();

    render(
      <Header
        onSearchTap={onSearchTap}
        onNotificationTap={onNotificationTap}
        onProfileTap={onProfileTap}
      />
    );

    const input = screen.getByRole('textbox');

    fireEvent.mouseDown(input);

    expect(onSearchTap).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Open notifications' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open profile' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  });
});

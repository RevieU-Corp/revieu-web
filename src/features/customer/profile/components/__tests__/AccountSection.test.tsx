import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { AccountSection } from '../AccountSection';

describe('AccountSection', () => {
  it('shows requested account items and waitting text', () => {
    const handlers = {
      onAccountSecurity: vi.fn(),
      onNotification: vi.fn(),
      onStorage: vi.fn(),
      onSupport: vi.fn(),
      onLogout: vi.fn(),
    };

    render(<AccountSection {...handlers} />);

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('account security')).toBeInTheDocument();
    expect(screen.getByText('notification')).toBeInTheDocument();
    expect(screen.getByText('storage')).toBeInTheDocument();
    expect(screen.getByText('support')).toBeInTheDocument();
    expect(screen.getByText('logout')).toBeInTheDocument();
    expect(screen.getByText('waitting for extending')).toBeInTheDocument();

    fireEvent.click(screen.getByText('logout'));
    expect(handlers.onLogout).toHaveBeenCalledTimes(1);
  });
});

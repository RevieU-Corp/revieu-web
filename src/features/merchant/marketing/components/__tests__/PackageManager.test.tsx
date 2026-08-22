import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PackageManager from '../PackageManager';

describe('PackageManager', () => {
  it('clearly marks unsupported writes and never exposes local-only mutation controls', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<PackageManager isOpen onClose={onClose} packages={[]} />);

    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText(/No local-only changes can be saved/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /create|edit|delete|enable|disable/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close package management' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

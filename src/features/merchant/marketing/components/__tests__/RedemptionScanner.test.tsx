import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import RedemptionScanner from '../RedemptionScanner';

describe('RedemptionScanner', () => {
  it('closes the dialog on Escape and exposes a labelled close control', () => {
    const onClose = vi.fn();

    render(<RedemptionScanner isOpen onClose={onClose} onRedeem={vi.fn()} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close redemption dialog' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

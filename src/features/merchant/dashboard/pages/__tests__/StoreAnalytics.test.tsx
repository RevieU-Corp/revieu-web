import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe('StoreAnalytics', () => {
  it('marks illustrative metrics and date filters as coming soon', async () => {
    const { default: StoreAnalytics } = await import('../StoreAnalytics');

    render(
      <MemoryRouter>
        <StoreAnalytics />
      </MemoryRouter>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Demo / Coming soon');
    expect(screen.getByRole('button', { name: '7 Days (coming soon)' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '30 Days (coming soon)' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '90 Days (coming soon)' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '1 Year (coming soon)' })).toBeDisabled();
  });
});

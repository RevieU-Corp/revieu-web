import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BottomNav } from '..';

vi.mock('../../../../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
  }),
}));

describe('BottomNav', () => {
  it('hides Discover and Explore tabs, keeping only Home, Review, and Profile buttons', () => {
    render(
      <MemoryRouter initialEntries={['/customer/home']}>
        <BottomNav />
      </MemoryRouter>
    );

    expect(screen.queryByRole('button', { name: /discover/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /explore/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
});

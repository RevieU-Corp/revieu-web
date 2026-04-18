import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BottomNav } from '..';
import { PATHS } from '../../../../../../routes/paths';

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

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

  it('routes the add review button to the review target selector flow', () => {
    render(
      <MemoryRouter initialEntries={['/customer/home']}>
        <BottomNav />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole('button', { name: /add review/i })[0]);

    expect(navigateMock).toHaveBeenCalledWith(PATHS.CUSTOMER.WRITE_REVIEW_SELECT);
  });
});

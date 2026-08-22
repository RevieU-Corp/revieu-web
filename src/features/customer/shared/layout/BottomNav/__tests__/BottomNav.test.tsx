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
  it('renders all primary customer tabs around the add review action', () => {
    render(
      <MemoryRouter initialEntries={['/customer/home']}>
        <BottomNav />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /discover/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(5);
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

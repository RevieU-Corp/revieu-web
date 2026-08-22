import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetMe, mockGetProfile, mockSetUser } = vi.hoisted(() => ({
  mockGetMe: vi.fn(),
  mockGetProfile: vi.fn(),
  mockSetUser: vi.fn(),
}));

vi.mock('../../api/authService', () => ({
  authService: {
    getMe: mockGetMe,
  },
}));

vi.mock('../../../../api/userService', () => ({
  userService: {
    getProfile: mockGetProfile,
  },
}));

vi.mock('../../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    setUser: mockSetUser,
  }),
}));

import GoogleCallbackPage from '../GoogleCallbackPage';

describe('GoogleCallbackPage', () => {
  beforeEach(() => {
    localStorage.clear();
    mockGetMe.mockReset();
    mockGetProfile.mockReset();
    mockSetUser.mockReset();
    mockGetMe.mockResolvedValue({
      data: {
        user_id: 204,
        email: 'oauth@example.com',
        role: 'user',
      },
    });
    mockGetProfile.mockResolvedValue({
      data: {
        nickname: 'OAuth User',
        avatar_url: '',
      },
    });
  });

  it('uses the callback session cookie and never stores a URL token', async () => {
    render(
      <MemoryRouter initialEntries={['/auth/callback?token=attacker-token']}>
        <GoogleCallbackPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(mockGetMe).toHaveBeenCalledTimes(1));
    expect(mockSetUser).toHaveBeenCalledWith(expect.objectContaining({
      id: '204',
      email: 'oauth@example.com',
      name: 'OAuth User',
      role: 'user',
    }));
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});

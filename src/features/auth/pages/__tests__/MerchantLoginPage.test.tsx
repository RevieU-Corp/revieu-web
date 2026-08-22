import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const { loginMock, getGoogleLoginUrlMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  getGoogleLoginUrlMock: vi.fn(),
}));

vi.mock('../../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

vi.mock('../../api/authService', () => ({
  authService: {
    getGoogleLoginUrl: getGoogleLoginUrlMock,
  },
}));

import MerchantLoginPage from '../MerchantLoginPage';

describe('MerchantLoginPage', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    loginMock.mockReset();
    getGoogleLoginUrlMock.mockReset();
  });

  it('provides a keyboard-accessible password visibility toggle without changing the value', () => {
    render(
      <MemoryRouter initialEntries={['/merchant/login']}>
        <Routes>
          <Route path="/merchant/login" element={<MerchantLoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    const password = screen.getByLabelText('Password');
    const showButton = screen.getByRole('button', { name: 'Show password' });

    fireEvent.change(password, { target: { value: 'secret-password' } });
    expect(password).toHaveAttribute('type', 'password');
    expect(password).toHaveValue('secret-password');

    fireEvent.click(showButton);
    expect(password).toHaveAttribute('type', 'text');
    expect(password).toHaveValue('secret-password');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(password).toHaveAttribute('type', 'password');
    expect(password).toHaveValue('secret-password');
  });
});

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { loginMock, forgotPasswordMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  forgotPasswordMock: vi.fn(),
}));

vi.mock('../../api/authService', () => ({
  authService: {
    forgotPassword: forgotPasswordMock,
    getGoogleLoginUrl: () => '/api/v1/auth/login/google',
  },
}));

vi.mock('../../../../contexts/AuthContext', () => ({
  useAuth: () => ({ login: loginMock }),
}));

import LoginPage from '../LoginPage';
import MerchantLoginPage from '../MerchantLoginPage';
import ForgotPasswordPage from '../ForgotPasswordPage';

describe('auth form validation', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    loginMock.mockReset();
    forgotPasswordMock.mockReset();
  });

  it('blocks an invalid customer login email before calling the API', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'bad' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(loginMock).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('keeps forgot-password disabled until the email is valid', () => {
    render(
      <MemoryRouter initialEntries={['/forgot-password']}>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    const email = screen.getByLabelText('E-mail');
    const submit = screen.getByRole('button', { name: 'Reset Password' });
    fireEvent.change(email, { target: { value: 'bad' } });

    expect(submit).toBeDisabled();
    expect(forgotPasswordMock).not.toHaveBeenCalled();
  });

  it('exposes a password visibility control in the merchant login form', () => {
    render(
      <MemoryRouter initialEntries={['/merchant/login']}>
        <MerchantLoginPage />
      </MemoryRouter>
    );

    const password = screen.getByLabelText('Password');
    expect(password).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
  });
});

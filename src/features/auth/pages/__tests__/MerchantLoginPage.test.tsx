import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const { loginMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
}));

vi.mock('../../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

describe('MerchantLoginPage', () => {
  it('lets merchants reveal and hide the password without changing its value', async () => {
    const user = userEvent.setup();
    const { default: MerchantLoginPage } = await import('../MerchantLoginPage');

    render(
      <MemoryRouter>
        <MerchantLoginPage />
      </MemoryRouter>
    );

    const password = screen.getByPlaceholderText('Password');
    expect(password).toHaveAttribute('type', 'password');

    await user.type(password, 'merchant-secret');
    await user.click(screen.getByRole('button', { name: 'Show password' }));

    expect(password).toHaveAttribute('type', 'text');
    expect(password).toHaveValue('merchant-secret');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(password).toHaveAttribute('type', 'password');
    expect(password).toHaveValue('merchant-secret');
  });
});

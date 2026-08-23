import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

const { loginMock, getPrimaryStoreMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
  getPrimaryStoreMock: vi.fn(),
}));

vi.mock('../../../../contexts/AuthContext', () => ({
  useAuth: () => ({ login: loginMock }),
}));

vi.mock('../../api/authService', () => ({
  authService: {
    getGoogleLoginUrl: () => '/auth/login/google',
  },
}));

vi.mock('../../../merchant/profile/services/storeProfileService', () => ({
  storeProfileService: {
    getPrimaryStore: getPrimaryStoreMock,
  },
}));

const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}</output>;
};

describe('MerchantLoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset();
    getPrimaryStoreMock.mockReset();
    loginMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
  });

  const renderPage = async () => {
    const { default: MerchantLoginPage } = await import('../MerchantLoginPage');
    render(
      <MemoryRouter initialEntries={['/merchant/login']}>
        <Routes>
          <Route path="*" element={<><MerchantLoginPage /><LocationProbe /></>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('opens the dashboard for an authenticated account that owns a store', async () => {
    getPrimaryStoreMock.mockResolvedValue({ id: 321 });
    await renderPage();

    fireEvent.change(screen.getByLabelText('Business Email'), { target: { value: 'owner@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Merchant Sign in' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/merchant/dashboard'));
    expect(loginMock).toHaveBeenCalledWith('owner@example.com', 'secret123');
    expect(getPrimaryStoreMock).toHaveBeenCalledOnce();
  });

  it('routes an authenticated account without a store into merchant onboarding', async () => {
    getPrimaryStoreMock.mockResolvedValue(null);
    await renderPage();

    fireEvent.change(screen.getByLabelText('Business Email'), { target: { value: 'new@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Merchant Sign in' }));

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/merchant/verification'));
  });
});

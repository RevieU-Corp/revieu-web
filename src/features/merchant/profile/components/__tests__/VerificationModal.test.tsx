import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { getVerificationStatusMock, submitVerificationMock } = vi.hoisted(() => ({
  getVerificationStatusMock: vi.fn(),
  submitVerificationMock: vi.fn(),
}));

vi.mock('../../../shared/services/verificationService', () => ({
  verificationService: {
    getVerificationStatus: getVerificationStatusMock,
    submitVerification: submitVerificationMock,
  },
}));

vi.mock('../AccountSetupModal', () => ({
  default: () => null,
}));

describe('VerificationModal', () => {
  beforeEach(() => {
    getVerificationStatusMock.mockReset();
    submitVerificationMock.mockReset();
    getVerificationStatusMock.mockResolvedValue({
      status: 'unverified',
    });
    submitVerificationMock.mockResolvedValue({
      status: 'pending',
    });
  });

  it('submits verification data through the verification service', async () => {
    const { default: VerificationModal } = await import('../VerificationModal');

    const { container } = render(
      <MemoryRouter>
        <VerificationModal isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    const imageFile = new File(['front'], 'storefront.png', { type: 'image/png' });
    const pdfFile = new File(['pdf'], 'license.pdf', { type: 'application/pdf' });

    fireEvent.change(screen.getByLabelText(/business license number/i), {
      target: { value: 'LIC-123' },
    });
    fireEvent.change(screen.getByLabelText(/ein/i), {
      target: { value: '12-3456789' },
    });
    fireEvent.change(screen.getByLabelText(/legal company name/i), {
      target: { value: 'Revieu Demo LLC' },
    });
    fireEvent.change(screen.getByLabelText(/owner name/i), {
      target: { value: 'Merchant Jane' },
    });

    const storefrontInput = container.querySelector('#storefront-photo') as HTMLInputElement;
    const businessLicenseInput = container.querySelector('#business-license') as HTMLInputElement;
    const healthPermitInput = container.querySelector('#health-permit') as HTMLInputElement;
    const ownerIdInput = container.querySelector('#owner-id') as HTMLInputElement;

    fireEvent.change(storefrontInput, { target: { files: [imageFile] } });
    fireEvent.change(businessLicenseInput, { target: { files: [pdfFile] } });
    fireEvent.change(healthPermitInput, { target: { files: [pdfFile] } });
    fireEvent.change(ownerIdInput, { target: { files: [pdfFile] } });

    fireEvent.click(screen.getByRole('button', { name: /submit for verification/i }));

    await waitFor(() => {
      expect(submitVerificationMock).toHaveBeenCalled();
    });
  });
});

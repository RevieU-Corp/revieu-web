import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const { getVerificationStatusMock, submitVerificationMock, uploadDocumentMock } = vi.hoisted(() => ({
  getVerificationStatusMock: vi.fn(),
  submitVerificationMock: vi.fn(),
  uploadDocumentMock: vi.fn(),
}));

vi.mock('../../../shared/services/verificationService', () => ({
  verificationService: {
    getVerificationStatus: getVerificationStatusMock,
    submitVerification: submitVerificationMock,
    uploadDocument: uploadDocumentMock,
  },
}));

vi.mock('../AccountSetupModal', () => ({
  default: () => null,
}));

describe('VerificationModal', () => {
  beforeEach(() => {
    getVerificationStatusMock.mockReset();
    submitVerificationMock.mockReset();
    uploadDocumentMock.mockReset();
    getVerificationStatusMock.mockResolvedValue({
      status: 'unverified',
    });
    submitVerificationMock.mockResolvedValue({
      status: 'pending',
    });
    uploadDocumentMock.mockResolvedValue('https://cdn.revieu.com/uploads/license-real.pdf');
  });

  it('uploads the selected document and submits its real URL, not the filename', async () => {
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
      expect(uploadDocumentMock).toHaveBeenCalledWith(pdfFile);
    });
    // The backend rejects document_url unless it's an absolute http(s) URL — a
    // bare filename like "license.pdf" fails validation with a 400. Assert the
    // real uploaded URL is what actually gets submitted.
    expect(submitVerificationMock).toHaveBeenCalledWith(
      expect.objectContaining({ documentUrl: 'https://cdn.revieu.com/uploads/license-real.pdf' })
    );
  });
});

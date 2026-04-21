import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { PATHS } from '../../../../../routes/paths';
import { BusinessCategory } from '../../types';

const { navigateMock, getSelectionDataMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  getSelectionDataMock: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../../services/writeReviewTargetService', () => ({
  getWriteReviewTargetSelectionData: getSelectionDataMock,
}));

describe('WriteReviewSelectPage', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    getSelectionDataMock.mockReset();
    getSelectionDataMock.mockResolvedValue({
      recentMerchants: [
        {
          merchantId: '205',
          name: 'Revieu Demo Cafe',
          category: 'Cafe',
          image: 'https://example.com/205.jpg',
          rating: 4.6,
          reviewCount: 8,
        },
      ],
      otherMerchants: [
        {
          merchantId: '206',
          name: 'Mission Street Ramen',
          category: 'Ramen',
          image: 'https://example.com/206.jpg',
          rating: 4.8,
          reviewCount: 12,
        },
      ],
      storesByMerchant: {
        '205': [
          {
            storeId: '235',
            merchantId: '205',
            name: 'Revieu Demo Cafe - Main',
            image: 'https://example.com/store-235.jpg',
            category: 'Cafe',
            address: '123 Integration Ave, San Francisco, CA',
            rating: 4.6,
            reviewCount: 8,
            isRecent: true,
          },
          {
            storeId: '236',
            merchantId: '205',
            name: 'Revieu Demo Cafe - Annex',
            image: 'https://example.com/store-236.jpg',
            category: 'Cafe',
            address: '234 Integration Ave, San Francisco, CA',
            rating: 4.2,
            reviewCount: 3,
            isRecent: false,
          },
        ],
        '206': [
          {
            storeId: '277',
            merchantId: '206',
            name: 'Mission Street Ramen',
            image: 'https://example.com/store-277.jpg',
            category: 'Ramen',
            address: '777 Mission St, San Francisco, CA',
            rating: 4.8,
            reviewCount: 12,
            isRecent: false,
          },
        ],
      },
    });
  });

  it('filters all merchants by search', async () => {
    const { default: WriteReviewSelectPage } = await import('../WriteReviewSelectPage');

    render(
      <MemoryRouter>
        <WriteReviewSelectPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/choose a merchant/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/search merchants/i), {
      target: { value: 'ramen' },
    });

    expect(screen.queryByText('Revieu Demo Cafe')).not.toBeInTheDocument();
    expect(screen.getByText('Mission Street Ramen')).toBeInTheDocument();
  });

  it('navigates to write review after choosing merchant and store', async () => {
    const { default: WriteReviewSelectPage } = await import('../WriteReviewSelectPage');

    render(
      <MemoryRouter>
        <WriteReviewSelectPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Revieu Demo Cafe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /revieu demo cafe/i }));

    await waitFor(() => {
      expect(screen.getByText(/choose a location/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /revieu demo cafe - main/i }));

    expect(navigateMock).toHaveBeenCalledWith(PATHS.CUSTOMER.WRITE_REVIEW, {
      state: {
        merchantId: '205',
        merchantName: 'Revieu Demo Cafe',
        storeId: '235',
        storeName: 'Revieu Demo Cafe - Main',
        merchantCategory: BusinessCategory.RESTAURANT,
      },
    });
  });
});

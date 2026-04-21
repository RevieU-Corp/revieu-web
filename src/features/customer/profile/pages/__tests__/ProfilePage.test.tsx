import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode, SVGProps } from 'react';
import { PATHS } from '../../../../../routes/paths';

const { reviewsListMock, pendingMerchantsMock, userVouchersMock, logoutMock, navigateMock } = vi.hoisted(() => ({
  reviewsListMock: vi.fn(),
  pendingMerchantsMock: vi.fn(),
  userVouchersMock: vi.fn(),
  logoutMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function DummyIcon(props: SVGProps<SVGSVGElement>) {
  return <svg data-testid="icon" {...props} />;
}

vi.mock('../../components', () => ({
  Icons: {
    ChevronRight: DummyIcon,
    MapPin: DummyIcon,
    Camera: DummyIcon,
    Share: DummyIcon,
    Sparkles: DummyIcon,
    Wallet: DummyIcon,
  },
  ReviewCard: ({ review }: { review: { content: string } }) => <div>{review.content}</div>,
  CouponCard: () => <div>coupon</div>,
  StatsBar: () => <div>stats</div>,
  ProfileNavbar: () => <div>navbar</div>,
  SectionHeading: ({
    title,
    rightSlot,
  }: {
    title: string;
    rightSlot?: ReactNode;
  }) => (
    <div>
      <span>{title}</span>
      {rightSlot}
    </div>
  ),
  AccountSection: () => <div>account</div>,
  PendingReviewMerchants: ({
    merchants,
    onWriteReview,
  }: {
    merchants: Array<{
      merchantId: string;
      storeId: string;
      businessName: string;
      businessImage: string;
      lastVisitedAt: string;
      lastOrderItems: string[];
    }>;
    onWriteReview: (merchant: {
      merchantId: string;
      storeId: string;
      businessName: string;
      businessImage: string;
      lastVisitedAt: string;
      lastOrderItems: string[];
    }) => void;
  }) => (
    merchants.length > 0
      ? <button onClick={() => onWriteReview(merchants[0])}>Write pending review</button>
      : <div>pending</div>
  ),
  MyHistorySection: ({ onViewAllReviews }: { onViewAllReviews: () => void }) => (
    <button onClick={onViewAllReviews}>View all reviews</button>
  ),
}));

vi.mock('../../../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'tester@example.com',
      name: 'Tester',
      role: 'user',
    },
    logout: logoutMock,
  }),
}));

vi.mock('../../services/profileService', () => ({
  generateCreativeBio: vi.fn(),
  getLatestVisitedMerchantsWithoutReview: pendingMerchantsMock,
}));

vi.mock('../../../../../api/reviews', () => ({
  reviewsApi: {
    list: reviewsListMock,
  },
}));

vi.mock('../../../shared/services/voucherService', () => ({
  voucherService: {
    getUserVouchers: userVouchersMock,
  },
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    reviewsListMock.mockReset();
    pendingMerchantsMock.mockReset();
    userVouchersMock.mockReset();
    logoutMock.mockReset();
    navigateMock.mockReset();
    pendingMerchantsMock.mockResolvedValue([]);
    userVouchersMock.mockResolvedValue({
      active: [],
      used: [],
      expired: [],
      total: 0,
    });
  });

  it('loads my reviews with cursor pagination and appends more results', async () => {
    reviewsListMock
      .mockResolvedValueOnce({
        data: [
          {
            id: '21',
            merchantId: '9',
            userId: '1',
            overallRating: 4.5,
            text: 'First page review',
            images: [],
            tags: [],
            createdAt: '2026-03-01T10:00:00Z',
            businessName: 'Cafe One',
            likeCount: 3,
            commentCount: 2,
          },
        ],
        total: 2,
        cursor: '10',
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: '20',
            merchantId: '9',
            userId: '1',
            overallRating: 4,
            text: 'Second page review',
            images: [],
            tags: [],
            createdAt: '2026-02-28T10:00:00Z',
            businessName: 'Cafe One',
            likeCount: 1,
            commentCount: 0,
          },
        ],
        total: 2,
      });

    const { default: ProfilePage } = await import('../ProfilePage');

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(reviewsListMock).toHaveBeenNthCalledWith(1, { limit: 20 });
    });

    fireEvent.click(screen.getByRole('button', { name: /view all reviews/i }));

    expect(await screen.findByText('First page review')).toBeInTheDocument();
    expect(screen.getByText('2 total contributions')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /load more reviews/i }));

    await waitFor(() => {
      expect(reviewsListMock).toHaveBeenNthCalledWith(2, {
        cursor: '10',
        limit: 20,
      });
    });

    expect(await screen.findByText('Second page review')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /load more reviews/i })).not.toBeInTheDocument();
  });

  it('renders rewards from live vouchers instead of hard-coded coupons', async () => {
    reviewsListMock.mockResolvedValue({
      data: [],
      total: 0,
    });
    userVouchersMock.mockResolvedValue({
      active: [
        {
          id: 'voucher-1',
          code: 'REV-1',
          couponId: '9',
          userId: '1',
          merchantId: '205',
          status: 'active',
          generatedAt: new Date('2026-03-28T08:36:27.219542Z'),
          expiryDate: new Date('2026-09-24T08:35:25.232537Z'),
          usageInstructions: '',
          merchantName: 'Revieu Demo Cafe',
          dealTitle: 'Paid Demo Bundle',
          dealValue: '30 value for 9.99',
        },
      ],
      used: [],
      expired: [],
      total: 1,
    });

    const { default: ProfilePage } = await import('../ProfilePage');

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(userVouchersMock).toHaveBeenCalledWith('1');
    });

    expect(screen.getByText('1 Available')).toBeInTheDocument();
    expect(screen.getAllByText('coupon')).toHaveLength(1);
  });

  it('navigates to write review with merchant and store context from pending reviews', async () => {
    reviewsListMock.mockResolvedValue({
      data: [],
      total: 0,
    });
    pendingMerchantsMock.mockResolvedValue([
      {
        merchantId: '205',
        storeId: '235',
        businessName: 'Revieu Demo Cafe',
        businessImage: 'https://example.com/store.jpg',
        lastVisitedAt: 'Today',
        lastOrderItems: ['Paid Demo Bundle'],
      },
    ]);

    const { default: ProfilePage } = await import('../ProfilePage');

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: /write pending review/i }));

    expect(navigateMock).toHaveBeenCalledWith(PATHS.CUSTOMER.WRITE_REVIEW, {
      state: {
        merchantId: '205',
        merchantName: 'Revieu Demo Cafe',
        storeId: '235',
      },
    });
  });
});

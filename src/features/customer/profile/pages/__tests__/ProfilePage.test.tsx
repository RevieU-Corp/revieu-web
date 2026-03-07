import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode, SVGProps } from 'react';

const { reviewsListMock, pendingMerchantsMock, logoutMock } = vi.hoisted(() => ({
  reviewsListMock: vi.fn(),
  pendingMerchantsMock: vi.fn(),
  logoutMock: vi.fn(),
}));

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
  PendingReviewMerchants: () => <div>pending</div>,
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

describe('ProfilePage', () => {
  beforeEach(() => {
    reviewsListMock.mockReset();
    pendingMerchantsMock.mockReset();
    logoutMock.mockReset();
    pendingMerchantsMock.mockResolvedValue([]);
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
});

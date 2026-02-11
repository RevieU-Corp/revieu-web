import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { PendingReviewMerchants } from '../PendingReviewMerchants';
import { PendingReviewMerchant } from '../../types';

describe('PendingReviewMerchants', () => {
  it('renders Laet Merchant I Visit cards and handles write review action', () => {
    const merchants: PendingReviewMerchant[] = [
      {
        id: 'm1',
        businessName: 'Sushirrito',
        businessImage: 'https://picsum.photos/id/292/100/100',
        lastVisitedAt: 'Yesterday',
        lastOrderItems: ['Sumo Crunch', 'Lava Nachos'],
      },
      {
        id: 'm2',
        businessName: 'Philz Coffee',
        businessImage: 'https://picsum.photos/id/431/100/100',
        lastVisitedAt: 'Jan 22',
        lastOrderItems: ['Mint Mojito'],
      },
    ];
    const onWriteReview = vi.fn();

    render(<PendingReviewMerchants merchants={merchants} onWriteReview={onWriteReview} />);

    expect(screen.getByText('Laet Merchant I Visit')).toBeInTheDocument();
    expect(screen.getByText('Sushirrito')).toBeInTheDocument();
    expect(screen.getByText('Philz Coffee')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /write review/i })).toHaveLength(2);

    fireEvent.click(screen.getAllByRole('button', { name: /write review/i })[0]);
    expect(onWriteReview).toHaveBeenCalledWith(merchants[0]);
  });
});

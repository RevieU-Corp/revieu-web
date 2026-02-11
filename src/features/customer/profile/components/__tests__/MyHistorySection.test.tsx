import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { MyHistorySection } from '../MyHistorySection';
import { Review } from '../../types';

describe('MyHistorySection', () => {
  it('shows latest review card and opens all reviews when clicking arrow button', () => {
    const latestReview: Review = {
      id: 'r1',
      businessName: 'Sushirrito',
      businessImage: 'https://picsum.photos/id/292/100/100',
      location: 'San Francisco',
      rating: 5,
      date: '1d ago',
      content: 'Loved the crunch and fresh fish.',
      images: [],
      helpfulCount: 12,
      createdAt: '2026-02-10T12:00:00.000Z',
    };
    const onViewAllReviews = vi.fn();

    render(<MyHistorySection latestReview={latestReview} onViewAllReviews={onViewAllReviews} />);

    expect(screen.getByText('My History')).toBeInTheDocument();
    expect(screen.getByText('Sushirrito')).toBeInTheDocument();
    expect(screen.getByText(/Loved the crunch and fresh fish/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /view all reviews/i }));
    expect(onViewAllReviews).toHaveBeenCalledTimes(1);
  });
});

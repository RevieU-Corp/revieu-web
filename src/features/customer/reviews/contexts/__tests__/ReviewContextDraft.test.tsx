import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ReviewProvider, useReviewContext } from '../ReviewContext';

const DraftReader = () => {
  const { state } = useReviewContext();
  return (
    <div>
      <span data-testid="review-text">{state.reviewData.reviewText}</span>
      <span data-testid="image-count">{state.reviewData.images?.length ?? 0}</span>
    </div>
  );
};

afterEach(() => {
  localStorage.clear();
});

describe('ReviewContext draft loading', () => {
  it('loads draft from localStorage on mount', async () => {
    localStorage.setItem('review:draft', JSON.stringify({
      reviewText: 'hello',
      imageUrls: ['https://cdn.example.com/test.jpg'],
    }));

    render(
      <ReviewProvider merchantId="merchant-1">
        <DraftReader />
      </ReviewProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('review-text')).toHaveTextContent('hello');
    });

    expect(screen.getByTestId('image-count')).toHaveTextContent('1');
  });
});

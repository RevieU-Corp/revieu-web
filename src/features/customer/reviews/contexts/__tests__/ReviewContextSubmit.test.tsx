import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReviewProvider, useReviewContext } from '../ReviewContext';
import { BusinessCategory } from '../../types';

const { createReviewMock, aiAssistGenerateMock } = vi.hoisted(() => ({
  createReviewMock: vi.fn(),
  aiAssistGenerateMock: vi.fn(),
}));

vi.mock('../../../../../api/reviews', () => ({
  reviewsApi: {
    create: createReviewMock,
  },
}));

vi.mock('../../services/aiAssist', () => ({
  generateReviewSuggestions: aiAssistGenerateMock,
}));

vi.mock('../../../../../api/media', () => ({
  mediaApi: {
    getUploadUrls: vi.fn(),
  },
  uploadToR2: vi.fn(),
}));

const SubmitHarness = () => {
  const { actions, state } = useReviewContext();

  return (
    <div>
      <button type="button" onClick={() => void actions.submitReview()}>
        Submit
      </button>
      {state.submitError ? <span>{state.submitError}</span> : null}
    </div>
  );
};

const AIAssistHarness = () => {
  const { actions, state } = useReviewContext();

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          actions.updateText('Loved the noodles, but service was slower than expected.');
          actions.updateRating(4);
          actions.updateDetailedRating('quality', 4.5);
          actions.updateDetailedRating('environment', 4);
          actions.updateDetailedRating('service', 3.5);
          (actions.updateDetailedRating as (type: string, rating: number) => void)('value', 4);
        }}
      >
        Prepare AI Draft
      </button>
      <button type="button" onClick={() => void (actions.generateAISuggestions as () => Promise<void>)()}>
        Generate AI
      </button>
      <span data-testid="merchant-name">{state.reviewData.merchantName}</span>
      <span data-testid="store-name">{state.reviewData.storeName}</span>
      <span data-testid="merchant-category">{state.reviewData.merchantCategory}</span>
      <span data-testid="value-rating">{(state.reviewData.detailedRatings as { value?: number } | undefined)?.value ?? ''}</span>
      <span data-testid="candidate-count">{state.aiAssistantState.suggestions.length}</span>
      <span data-testid="review-text">{state.reviewData.reviewText}</span>
    </div>
  );
};

describe('ReviewContext submitReview', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    createReviewMock.mockReset();
    createReviewMock.mockResolvedValue({ id: '14' });
    aiAssistGenerateMock.mockReset();
  });

  it('blocks submission when store context is missing', async () => {
    render(
      <ReviewProvider merchantId="205">
        <SubmitHarness />
      </ReviewProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/store context is missing/i)).toBeInTheDocument();
    });

    expect(createReviewMock).not.toHaveBeenCalled();
  });

  it('seeds merchant/store context and value rating into review state', async () => {
    render(
      <ReviewProvider
        merchantId="205"
        merchantName="Revieu Demo Cafe"
        storeId="235"
        storeName={'Revieu Demo Cafe - Main' as never}
        merchantCategory={BusinessCategory.RESTAURANT}
      >
        <AIAssistHarness />
      </ReviewProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /prepare ai draft/i }));

    await waitFor(() => {
      expect(screen.getByTestId('merchant-name')).toHaveTextContent('Revieu Demo Cafe');
    });

    expect(screen.getByTestId('store-name')).toHaveTextContent('Revieu Demo Cafe - Main');
    expect(screen.getByTestId('merchant-category')).toHaveTextContent(BusinessCategory.RESTAURANT);
    expect(screen.getByTestId('value-rating')).toHaveTextContent('4');
  });

  it('builds AI suggestions from current review context instead of requiring an external request object', async () => {
    aiAssistGenerateMock.mockResolvedValue({
      candidates: ['Candidate one', 'Candidate two', 'Candidate three'],
    });

    render(
      <ReviewProvider
        merchantId="205"
        merchantName="Revieu Demo Cafe"
        storeId="235"
        storeName={'Revieu Demo Cafe - Main' as never}
        merchantCategory={BusinessCategory.RESTAURANT}
      >
        <AIAssistHarness />
      </ReviewProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /prepare ai draft/i }));

    await waitFor(() => {
      expect(screen.getByTestId('value-rating')).toHaveTextContent('4');
    });

    fireEvent.click(screen.getByRole('button', { name: /generate ai/i }));

    await waitFor(() => {
      expect(aiAssistGenerateMock).toHaveBeenCalledWith(expect.objectContaining({
        reviewText: 'Loved the noodles, but service was slower than expected.',
        overallRating: 4,
        merchantName: 'Revieu Demo Cafe',
        storeName: 'Revieu Demo Cafe - Main',
        businessCategory: BusinessCategory.RESTAURANT,
        detailedRatings: expect.objectContaining({
          quality: 4.5,
          environment: 4,
          service: 3.5,
          value: 4,
        }),
      }));
    });

    expect(screen.getByTestId('candidate-count')).toHaveTextContent('3');
  });

  it('keeps the original draft until the user explicitly selects a candidate', async () => {
    aiAssistGenerateMock.mockResolvedValue({
      candidates: ['Candidate one', 'Candidate two', 'Candidate three'],
    });

    render(
      <ReviewProvider
        merchantId="205"
        merchantName="Revieu Demo Cafe"
        storeId="235"
        storeName={'Revieu Demo Cafe - Main' as never}
        merchantCategory={BusinessCategory.RESTAURANT}
      >
        <AIAssistHarness />
      </ReviewProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /prepare ai draft/i }));

    await waitFor(() => {
      expect(screen.getByTestId('review-text')).toHaveTextContent(
        'Loved the noodles, but service was slower than expected.'
      );
    });

    fireEvent.click(screen.getByRole('button', { name: /generate ai/i }));

    await waitFor(() => {
      expect(screen.getByTestId('candidate-count')).toHaveTextContent('3');
    });

    expect(screen.getByTestId('review-text')).toHaveTextContent(
      'Loved the noodles, but service was slower than expected.'
    );
  });
});

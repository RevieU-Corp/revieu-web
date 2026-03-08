import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi, test, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PATHS } from '../../../../../routes/paths';

const { reviewProviderSpy } = vi.hoisted(() => ({
  reviewProviderSpy: vi.fn(({ children }: { children: React.ReactNode }) => <div>{children}</div>),
}));

vi.mock('../../contexts/ReviewContext', () => ({
  useReviewContext: () => ({
    state: {
      reviewData: { images: [], detailedRatings: {}, tags: [] },
      validationErrors: {},
      uploadState: { status: 'error', progress: 0, retryCount: 0, error: 'Upload failed' },
      draftState: { currentDraft: null, isAutoSaving: false, lastSaved: null, hasUnsavedChanges: false },
      aiState: { isStreaming: false, currentChunk: '', accumulatedText: '', error: null, progress: 0 },
      aiAssistantState: { isGenerating: false, suggestions: [], currentSuggestion: '', error: null, isVisible: false },
      isSubmitting: false,
      submitError: 'Submit failed',
      draftNotice: 'Draft restored',
    },
    actions: {
      updateImages: vi.fn(),
      updateText: vi.fn(),
      updateRating: vi.fn(),
      updateDetailedRating: vi.fn(),
      addTag: vi.fn(),
      removeTag: vi.fn(),
      validateForm: vi.fn(),
      uploadImages: vi.fn(),
      submitReview: vi.fn(),
      retryImage: vi.fn(),
      setUploadError: vi.fn(),
      clearUploadError: vi.fn(),
      clearSubmitError: vi.fn(),
      clearDraftNotice: vi.fn(),
    },
  }),
  ReviewProvider: reviewProviderSpy,
}));

test('renders upload, submit, and draft banners', async () => {
  reviewProviderSpy.mockClear();
  const { default: WriteReviewPage } = await import('../WriteReviewPage');
  render(
    <MemoryRouter>
      <WriteReviewPage />
    </MemoryRouter>
  );
  expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
  expect(screen.getByText(/submit failed/i)).toBeInTheDocument();
  expect(screen.getByText(/draft restored/i)).toBeInTheDocument();
});

test('passes merchant context from router state into ReviewProvider', async () => {
  reviewProviderSpy.mockClear();
  const { default: WriteReviewPage } = await import('../WriteReviewPage');

  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: PATHS.CUSTOMER.WRITE_REVIEW,
          state: {
            merchantId: '42',
            merchantName: 'Golden Spoon',
            storeId: '108',
          },
        },
      ]}
    >
      <Routes>
        <Route path={PATHS.CUSTOMER.WRITE_REVIEW} element={<WriteReviewPage />} />
      </Routes>
    </MemoryRouter>
  );

  expect(reviewProviderSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      merchantId: '42',
      merchantName: 'Golden Spoon',
      storeId: '108',
    }),
    expect.anything()
  );
});

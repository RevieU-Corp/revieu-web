import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

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
  ReviewProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

test('renders upload, submit, and draft banners', async () => {
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

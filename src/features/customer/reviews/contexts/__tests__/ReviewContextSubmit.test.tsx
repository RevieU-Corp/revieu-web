import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReviewProvider, useReviewContext } from '../ReviewContext';

const { createReviewMock } = vi.hoisted(() => ({
  createReviewMock: vi.fn(),
}));

vi.mock('../../../../../api/reviews', () => ({
  reviewsApi: {
    create: createReviewMock,
  },
}));

vi.mock('../../services/gemini', () => ({
  generateReviewSuggestions: vi.fn(),
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

describe('ReviewContext submitReview', () => {
  beforeEach(() => {
    createReviewMock.mockReset();
    createReviewMock.mockResolvedValue({ id: '14' });
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
});

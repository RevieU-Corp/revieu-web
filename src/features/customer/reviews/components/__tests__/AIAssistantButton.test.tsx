import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { generateAISuggestionsMock, setUseStyleMock, useReviewContextMock } = vi.hoisted(() => ({
  generateAISuggestionsMock: vi.fn(),
  setUseStyleMock: vi.fn(),
  useReviewContextMock: vi.fn(),
}));

vi.mock('../../contexts/ReviewContext', () => ({
  useReviewContext: useReviewContextMock,
}));

describe('AIAssistantButton', () => {
  beforeEach(() => {
    generateAISuggestionsMock.mockReset();
    setUseStyleMock.mockReset();
    useReviewContextMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('stays disabled until the user has a rating and at least 10 characters of text', async () => {
    useReviewContextMock.mockReturnValue({
      state: {
        aiAssistantState: { isGenerating: false },
        reviewData: {
          overallRating: 4,
          reviewText: 'too short',
        },
      },
      actions: {
        generateAISuggestions: generateAISuggestionsMock,
      },
    });

    const { default: AIAssistantButton } = await import('../AIAssistantButton');
    render(<AIAssistantButton />);

    expect(screen.getByRole('button', { name: /ai assist/i })).toBeDisabled();
  });

  it('triggers AI generation without requiring caller-provided request props', async () => {
    useReviewContextMock.mockReturnValue({
      state: {
        aiAssistantState: { isGenerating: false, useStyle: true },
        reviewData: {
          overallRating: 4,
          reviewText: 'Loved the noodles, but service was slower than expected.',
        },
      },
      actions: {
        generateAISuggestions: generateAISuggestionsMock,
        setUseStyle: setUseStyleMock,
      },
    });

    const { default: AIAssistantButton } = await import('../AIAssistantButton');
    render(<AIAssistantButton />);

    fireEvent.click(screen.getByRole('button', { name: /ai assist/i }));

    expect(generateAISuggestionsMock).toHaveBeenCalledWith();
  });

  it('flips the writing-style preference when the user toggles the switch', async () => {
    useReviewContextMock.mockReturnValue({
      state: {
        aiAssistantState: { isGenerating: false, useStyle: true },
        reviewData: {
          overallRating: 4,
          reviewText: 'Loved the noodles, but service was slower than expected.',
        },
      },
      actions: {
        generateAISuggestions: generateAISuggestionsMock,
        setUseStyle: setUseStyleMock,
      },
    });

    const { default: AIAssistantButton } = await import('../AIAssistantButton');
    render(<AIAssistantButton />);

    // The toggle is the first button rendered; AI Assist comes after.
    fireEvent.click(screen.getByRole('button', { name: /use my writing style/i }));

    expect(setUseStyleMock).toHaveBeenCalledWith(false);
    // Clicking the toggle must not kick off a generation request.
    expect(generateAISuggestionsMock).not.toHaveBeenCalled();
  });
});

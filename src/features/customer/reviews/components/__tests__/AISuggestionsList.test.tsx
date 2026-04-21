import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  clearAISuggestionsMock,
  selectAISuggestionMock,
  toggleAIAssistantMock,
  useReviewContextMock,
} = vi.hoisted(() => ({
  clearAISuggestionsMock: vi.fn(),
  selectAISuggestionMock: vi.fn(),
  toggleAIAssistantMock: vi.fn(),
  useReviewContextMock: vi.fn(),
}));

vi.mock('../../contexts/ReviewContext', () => ({
  useReviewContext: useReviewContextMock,
}));

describe('AISuggestionsList', () => {
  beforeEach(() => {
    clearAISuggestionsMock.mockReset();
    selectAISuggestionMock.mockReset();
    toggleAIAssistantMock.mockReset();
    useReviewContextMock.mockReset();
    useReviewContextMock.mockReturnValue({
      state: {
        aiAssistantState: {
          isVisible: true,
          isGenerating: false,
          suggestions: [
            'Candidate one',
            'Candidate two',
            'Candidate three',
          ],
          currentSuggestion: '',
          error: null,
        },
      },
      actions: {
        clearAISuggestions: clearAISuggestionsMock,
        selectAISuggestion: selectAISuggestionMock,
        toggleAIAssistant: toggleAIAssistantMock,
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('tells the user that choosing a candidate replaces the current draft and that closing keeps the original text', async () => {
    const { default: AISuggestionsList } = await import('../AISuggestionsList');

    render(<AISuggestionsList />);

    expect(
      screen.getByText(/select one candidate to replace your current draft/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/close this panel to keep your original text and publish it as-is/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /keep original/i })).toBeInTheDocument();
  });

  it('replaces the draft only when the user explicitly selects a candidate', async () => {
    const { default: AISuggestionsList } = await import('../AISuggestionsList');

    render(<AISuggestionsList />);

    fireEvent.click(screen.getByText('Candidate two'));

    expect(selectAISuggestionMock).toHaveBeenCalledWith('Candidate two');
    expect(toggleAIAssistantMock).toHaveBeenCalledTimes(1);
  });

  it('lets the user dismiss suggestions and keep the original text unchanged', async () => {
    const { default: AISuggestionsList } = await import('../AISuggestionsList');

    render(<AISuggestionsList />);

    fireEvent.click(screen.getByRole('button', { name: /keep original/i }));

    expect(selectAISuggestionMock).not.toHaveBeenCalled();
    expect(toggleAIAssistantMock).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';

export const AIAssistantButton: React.FC = () => {
  const { state, actions } = useReviewContext();
  const { aiAssistantState, reviewData } = state;

  const handleGenerateSuggestions = async () => {
    await actions.generateAISuggestions();
  };

  const hasEnoughText = (reviewData.reviewText || '').trim().length >= 10;
  const isDisabled = aiAssistantState.isGenerating || reviewData.overallRating === 0 || !hasEnoughText;

  // The toggle defaults to true on first render so existing users opt into
  // personalization automatically. Flipping it off only affects the next request —
  // it is not a persisted preference, by design (see backend discussion).
  const useStyle = aiAssistantState.useStyle;
  const handleToggleUseStyle = () => {
    actions.setUseStyle(!useStyle);
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={handleToggleUseStyle}
        disabled={aiAssistantState.isGenerating}
        aria-pressed={useStyle}
        title="When on, the AI Assist will polish your draft using the writing style learned from your past reviews."
        className={`
          inline-flex items-center space-x-2 text-xs font-medium select-none transition-colors
          ${aiAssistantState.isGenerating ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span
          className={`
            relative inline-flex h-4 w-7 items-center rounded-full transition-colors
            ${useStyle ? 'bg-[#990000]' : 'bg-gray-300'}
          `}
        >
          <span
            className={`
              inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform
              ${useStyle ? 'translate-x-3.5' : 'translate-x-0.5'}
            `}
          />
        </span>
        <span className={useStyle ? 'text-gray-700' : 'text-gray-400'}>
          Use my writing style
        </span>
      </button>

      <button
        onClick={handleGenerateSuggestions}
        disabled={isDisabled}
        className={`
          inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${isDisabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#990000] to-[#FFD700] text-white hover:shadow-lg hover:scale-105 active:scale-95'
          }
        `}
      >
        {aiAssistantState.isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>AI Assist</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AIAssistantButton;

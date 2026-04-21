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

  return (
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
  );
};

export default AIAssistantButton;

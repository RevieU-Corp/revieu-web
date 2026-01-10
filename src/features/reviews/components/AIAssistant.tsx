import React from 'react';
import { Sparkles, Loader2, Check, RefreshCw, X } from 'lucide-react';

// ============================================================================
// AI ASSISTANT BUTTON COMPONENT
// ============================================================================

export interface AIAssistantButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({
  onClick,
  isGenerating,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        disabled || isGenerating
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-[#990000] to-[#770000] text-white hover:shadow-lg hover:scale-105'
      }`}
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      <span>{isGenerating ? 'Generating...' : 'AI Assist'}</span>
    </button>
  );
};

// ============================================================================
// AI SUGGESTIONS LIST COMPONENT
// ============================================================================

export interface AISuggestionsListProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  onRegenerate: () => void;
  onClose: () => void;
  isGenerating: boolean;
  error?: string | null;
}

export const AISuggestionsList: React.FC<AISuggestionsListProps> = ({
  suggestions,
  onSelectSuggestion,
  onRegenerate,
  onClose,
  isGenerating,
  error
}) => {
  if (!isGenerating && suggestions.length === 0 && !error) {
    return null;
  }

  return (
    <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#990000]" />
          <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="text-xs text-[#990000] hover:text-[#770000] flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Generating suggestions...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isGenerating && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-red-700">{error}</span>
          </div>
          <button
            onClick={onRegenerate}
            className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Suggestions List */}
      {suggestions.length > 0 && !isGenerating && (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 bg-white rounded-lg border border-gray-200 hover:border-[#990000] cursor-pointer transition-all duration-200 group hover:shadow-sm"
              onClick={() => onSelectSuggestion(suggestion)}
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-700 flex-1 leading-relaxed">{suggestion}</p>
                <div className="ml-3 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-[#990000] flex items-center justify-center transition-colors">
                    <Check className="w-3 h-3 text-transparent group-hover:text-[#990000] transition-colors" />
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Click to use this suggestion
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {suggestions.length === 0 && !isGenerating && !error && (
        <div className="text-center py-4">
          <div className="text-gray-400 text-sm">
            No suggestions available. Try adjusting your rating and click regenerate.
          </div>
        </div>
      )}
    </div>
  );
};
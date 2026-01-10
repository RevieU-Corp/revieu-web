import React from 'react';
import { X, Copy, Check, AlertCircle } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';

export const AISuggestionsList: React.FC = () => {
  const { state, actions } = useReviewContext();
  const { aiAssistantState } = state;

  if (!aiAssistantState.isVisible) {
    return null;
  }

  const handleSelectSuggestion = (suggestion: string) => {
    actions.selectAISuggestion(suggestion);
    actions.toggleAIAssistant(); // 选择后隐藏建议列表
  };

  const handleClose = () => {
    actions.toggleAIAssistant();
  };

  const handleClearSuggestions = () => {
    actions.clearAISuggestions();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#990000] to-[#FFD700] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Review Suggestions</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {aiAssistantState.error ? (
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error generating suggestions</p>
                <p className="text-red-600 text-sm mt-1">{aiAssistantState.error}</p>
              </div>
            </div>
          ) : aiAssistantState.suggestions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Copy className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No suggestions available</p>
              <p className="text-gray-400 text-sm mt-1">Try rating the business first</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Choose a suggestion to use as your review, or use it as inspiration:
              </p>
              
              {aiAssistantState.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="group border border-gray-200 rounded-lg p-4 hover:border-[#990000] hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-gray-800 leading-relaxed flex-1 pr-4">
                      {suggestion}
                    </p>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-gray-500">Use this</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{suggestion.length} characters</span>
                      <span>Click to use</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500">
            AI suggestions are generated based on your ratings and business type
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleClearSuggestions}
              className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsList;
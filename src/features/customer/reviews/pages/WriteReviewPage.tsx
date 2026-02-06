import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Hash, X, Plus } from 'lucide-react';
import { useReviewContext } from '../contexts/ReviewContext';
import { ReviewProvider } from '../contexts/ReviewContext';
import { CombinedRatingComponent, ImageUploadGrid, AIAssistantButton, AISuggestionsList } from '../components';
import { BusinessCategory } from '../types';

// Internal component that uses the review context
const WriteReviewForm: React.FC = () => {
  const navigate = useNavigate();
  const { state, actions } = useReviewContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhotoPrompt, setShowPhotoPrompt] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');

  // Preset tags similar to Xiaohongshu (must select at least one)
  const presetTags = ['restaurant', 'drink', 'shoes', 'food', 'service', 'atmosphere'];
  const maxTags = 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using context
    actions.validateForm();

    const hasErrors = Object.keys(state.validationErrors).length > 0;
    const hasNoTags = (state.reviewData.tags || []).length === 0;

    if (hasErrors || hasNoTags) {
      return;
    }

    // Check if user has no photos and show prompt
    const hasPhotos = state.reviewData.images && state.reviewData.images.length > 0;
    if (!hasPhotos) {
      setShowPhotoPrompt(true);
      return;
    }

    // Proceed with submission
    submitReview();
  };

  const submitReview = async () => {
    setIsSubmitting(true);

    try {
      // Step 1: Upload images to R2
      const images = state.reviewData.images || [];
      const hasImagesToUpload = images.some(img => img.uploadState.status === 'pending');

      if (hasImagesToUpload) {
        const uploadSuccess = await actions.uploadImages();
        if (!uploadSuccess) {
          setIsSubmitting(false);
          console.error('Failed to upload images');
          return;
        }
      }

      // Step 2: Submit review to backend
      const submitSuccess = await actions.submitReview();

      if (submitSuccess) {
        navigate('/home');
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueWithoutPhoto = () => {
    setShowPhotoPrompt(false);
    submitReview();
  };

  const handleGoBackToAddPhoto = () => {
    setShowPhotoPrompt(false);
  };

  const handleAddTag = (tag: string) => {
    const currentTags = state.reviewData.tags || [];
    if (currentTags.length >= maxTags) return;

    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!currentTags.includes(formattedTag)) {
      actions.addTag(formattedTag);
    }
  };

  const handleRemoveTag = (tag: string) => {
    actions.removeTag(tag);
  };

  const handleCustomTagSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      const currentTags = state.reviewData.tags || [];
      if (currentTags.length >= maxTags) return;

      const trimmedTag = customTagInput.trim();
      if (trimmedTag && !currentTags.includes(`#${trimmedTag}`)) {
        handleAddTag(trimmedTag);
        setCustomTagInput('');
      }
    }
  };

  const isFormValid = (state.reviewData.overallRating || 0) > 0 &&
    state.reviewData.reviewText &&
    state.reviewData.reviewText.trim().length > 0 &&
    (state.reviewData.tags || []).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Center aligned title with symmetric padding */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-16 grid grid-cols-3 items-center z-20 shadow-sm">
        <div /> {/* Spacer for floating back button */}
        <h1 className="font-semibold text-gray-800 text-lg text-center truncate">Write Review</h1>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isFormValid && !isSubmitting
              ? 'bg-gradient-to-r from-[#990000] to-[#770000] text-white hover:shadow-lg active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isSubmitting ? '...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {(state.draftNotice || state.uploadState.error || state.submitError) && (
          <div className="space-y-2">
            {state.draftNotice && (
              <div className="flex items-start justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                <span>{state.draftNotice}</span>
                <button
                  onClick={actions.clearDraftNotice}
                  className="ml-3 text-blue-600 hover:text-blue-800"
                >
                  Dismiss
                </button>
              </div>
            )}
            {state.uploadState.error && (
              <div className="flex items-start justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <span>{state.uploadState.error}</span>
                <button
                  onClick={actions.clearUploadError}
                  className="ml-3 text-red-600 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            )}
            {state.submitError && (
              <div className="flex items-start justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <span>{state.submitError}</span>
                <button
                  onClick={actions.clearSubmitError}
                  className="ml-3 text-red-600 hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}
        {/* Enhanced Photo Upload - Xiaomi card style */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-5 bg-gradient-to-b from-[#990000] to-[#FFD700] rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">
              Add Photos/Videos
            </label>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
          </div>

          <ImageUploadGrid
            images={state.reviewData.images || []}
            onImagesChange={actions.updateImages}
            onRetry={actions.retryImage}
            onSelectionError={actions.setUploadError}
            maxImages={9}
            onImageAnalysis={(image: any, tags: any) => {
              console.log('Image analysis:', image, tags);
            }}
          />
        </div>

        {/* Review Text - Xiaomi style */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-5 bg-gradient-to-b from-[#990000] to-[#FFD700] rounded-full"></div>
            <label className="text-sm font-medium text-gray-700">
              Share Your Experience
            </label>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>
          </div>

          <textarea
            value={state.reviewData.reviewText || ''}
            onChange={(e) => actions.updateText(e.target.value)}
            placeholder="How was the taste? How's the environment? Was the service satisfactory? Write 15+ characters for a chance to be featured!"
            rows={4}
            maxLength={200}
            className="w-full p-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000] resize-none text-sm leading-relaxed transition-all duration-200"
          />

          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center space-x-1.5">
              <span className={`text-xs font-medium ${(state.reviewData.characterCount || 0) < 1
                ? 'text-red-500'
                : (state.reviewData.characterCount || 0) >= 20
                  ? 'text-green-500'
                  : 'text-gray-500'
                }`}>
                {state.reviewData.characterCount || 0}/200
              </span>
              {(state.reviewData.characterCount || 0) >= 20 && (
                <div className="flex items-center space-x-0.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-1.5 py-0.5 rounded-full">
                  <span className="text-xs text-white font-medium">✨ Eligible for points</span>
                </div>
              )}
            </div>

            {/* AI Assistant Button */}
            <AIAssistantButton
              merchantCategory={BusinessCategory.RESTAURANT}
              merchantName="this business"
            />
          </div>

          {/* AI Suggestions List Modal */}
          <AISuggestionsList />

          {state.validationErrors.text && (
            <p className="text-sm text-red-500 mt-2 flex items-center space-x-1">
              <span className="w-0.5 h-0.5 bg-red-500 rounded-full"></span>
              <span>{state.validationErrors.text}</span>
            </p>
          )}

          {/* Compact Hashtag System - 1/4 size */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <Hash className="w-1 h-1 text-[#990000]" />
                <span className="text-xs font-medium text-gray-700">Tags</span>
                <span className="text-xs text-red-400 bg-red-50 px-1.5 py-0.5 rounded-full">Required</span>
              </div>
              <span className="text-xs text-gray-400">
                {(state.reviewData.tags || []).length}/{maxTags}
              </span>
            </div>

            {/* Selected Tags - Very compact */}
            {state.reviewData.tags && state.reviewData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {(state.reviewData.tags || []).map((tag: string, index: number) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-gradient-to-r from-[#990000] to-[#770000] text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Preset Tags - Very small */}
            <div className="flex flex-wrap gap-1 mb-2">
              {presetTags.map((tag) => {
                const formattedTag = `#${tag}`;
                const isSelected = state.reviewData.tags?.includes(formattedTag);
                const canAdd = (state.reviewData.tags || []).length < maxTags;
                return (
                  <button
                    key={tag}
                    onClick={() => isSelected ? handleRemoveTag(formattedTag) : handleAddTag(tag)}
                    disabled={!isSelected && !canAdd}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 ${isSelected
                      ? 'bg-gradient-to-r from-[#990000] to-[#770000] text-white border-[#990000] shadow-sm'
                      : canAdd
                        ? 'bg-white text-gray-600 border-gray-200 hover:border-[#990000] hover:text-[#990000] hover:bg-[#990000]/5'
                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Input - Very compact */}
            {(state.reviewData.tags || []).length < maxTags && (
              <div className="flex items-center space-x-1.5">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={handleCustomTagSubmit}
                    placeholder="Custom tag..."
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#990000]/20 focus:border-[#990000] transition-all duration-200"
                    maxLength={15}
                  />
                  {customTagInput && (
                    <div className="absolute left-2.5 top-1.5 text-[#990000] text-xs pointer-events-none font-medium">
                      #
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (customTagInput.trim() && !state.reviewData.tags?.includes(`#${customTagInput.trim()}`)) {
                      handleAddTag(customTagInput.trim());
                      setCustomTagInput('');
                    }
                  }}
                  disabled={!customTagInput.trim()}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${customTagInput.trim()
                    ? 'bg-gradient-to-r from-[#990000] to-[#770000] text-white hover:shadow-md hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Tags help others discover your review (max {maxTags})
            </p>
          </div>
        </div>

        {/* Combined Rating System - Xiaomi style */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-5 bg-gradient-to-b from-[#990000] to-[#FFD700] rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Rating</span>
            <span className="text-xs text-red-400 bg-red-50 px-2 py-0.5 rounded-full">Required</span>
          </div>

          <CombinedRatingComponent
            overallRating={state.reviewData.overallRating || 0}
            detailedRatings={state.reviewData.detailedRatings || { quality: 0, environment: 0, service: 0 }}
            onOverallRatingChange={actions.updateRating}
            onDetailedRatingChange={actions.updateDetailedRating}
            businessCategory={BusinessCategory.RESTAURANT}
          />
        </div>

        {/* Validation Errors */}
        {(state.validationErrors.rating || (state.reviewData.tags || []).length === 0) && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            {state.validationErrors.rating && (
              <p className="text-sm text-red-600 flex items-center space-x-2">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                <span>{state.validationErrors.rating}</span>
              </p>
            )}
            {(state.reviewData.tags || []).length === 0 && (
              <p className="text-sm text-red-600 flex items-center space-x-2 mt-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                <span>Please select at least one tag</span>
              </p>
            )}
          </div>
        )}

        {/* Photo Prompt Modal - Xiaomi style */}
        {showPhotoPrompt && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#990000] to-[#770000] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Add Photos for Extra Points!
                </h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Posts with photos earn more points and help other users make better decisions
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleGoBackToAddPhoto}
                    className="w-full bg-gradient-to-r from-[#990000] to-[#770000] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Go Back & Add Photos
                  </button>
                  <button
                    onClick={handleContinueWithoutPhoto}
                    className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    Continue Without Photos
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WriteReviewPage: React.FC = () => {
  return (
    <ReviewProvider
      merchantId="temp-merchant-id"
      merchantName="Sample Restaurant"
      merchantCategory={BusinessCategory.RESTAURANT}
    >
      <WriteReviewForm />
    </ReviewProvider>
  );
};

export default WriteReviewPage;

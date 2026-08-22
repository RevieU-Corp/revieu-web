import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Star, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReviewReplyModal from '../components/ReviewReplyModal';
import ConfirmationDialog from '../../shared/components/ConfirmationDialog';
import type { MerchantReview } from '../../../../api/reviews';

interface AllReviewsProps {
  reviews: MerchantReview[];
  onReply: (reviewId: number, replyText: string) => Promise<boolean>;
  onDelete: (reviewId: number) => Promise<boolean>;
  error?: string | null;
  onClose?: () => void;
}

const AllReviews: React.FC<AllReviewsProps> = ({ reviews, onReply, onDelete, error, onClose }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unreplied' | 'negative' | 'positive' | 'recent'>('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<MerchantReview | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  // Helper function to check if a review is from today
  const isToday = (dateString: string) => {
    const reviewDate = new Date(dateString);
    const today = new Date();
    return reviewDate.toDateString() === today.toDateString();
  };

  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    const reviewDate = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  // Filter and search reviews
  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    // Apply filter
    switch (activeFilter) {
      case 'unreplied':
        filtered = filtered.filter(review => !review.hasReply);
        break;
      case 'negative':
        filtered = filtered.filter(review => review.rating <= 2);
        break;
      case 'positive':
        filtered = filtered.filter(review => review.rating === 5);
        break;
      case 'recent':
        filtered = filtered.filter(review => isToday(review.date));
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(review =>
        review.customerName.toLowerCase().includes(query) ||
        review.text.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reviews, activeFilter, searchQuery]);

  const handleReplyToReview = (review: MerchantReview) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleSubmitReply = async (reviewId: number, replyText: string) => {
    return onReply(reviewId, replyText);
  };

  const handleDeleteReview = (review: MerchantReview) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Review',
      message: `Are you sure you want to delete the review from ${review.customerName}? This action cannot be undone.`,
      onConfirm: () => {
        void (async () => {
          const didPersist = await onDelete(review.id);
          if (didPersist) {
            closeConfirmDialog();
          }
        })();
      }
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const filterCounts = {
    all: reviews.length,
    unreplied: reviews.filter(r => !r.hasReply).length,
    negative: reviews.filter(r => r.rating <= 2).length,
    positive: reviews.filter(r => r.rating === 5).length,
    recent: reviews.filter(r => isToday(r.date)).length
  };

  return (
    <>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 flex-shrink-0">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={onClose ? onClose : () => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Reviews</h1>
                <p className="text-gray-600">Manage and respond to customer feedback</p>
              </div>
            </div>

            {error && (
              <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews by customer name or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { key: 'all', label: 'All Reviews' },
                { key: 'unreplied', label: 'Unreplied' },
                { key: 'negative', label: 'Negative (1-2★)' },
                { key: 'positive', label: 'Positive (5★)' },
                { key: 'recent', label: 'Recent (Today)' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === filter.key
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                    }`}
                  style={activeFilter === filter.key ? { backgroundColor: '#FFBC0D' } : {}}
                >
                  {filter.label} ({filterCounts[filter.key as keyof typeof filterCounts]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Reviews List */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4">
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Star size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-600">
                  {searchQuery.trim()
                    ? `No reviews match your search "${searchQuery}"`
                    : activeFilter === 'all'
                      ? 'No reviews yet'
                      : `No reviews in the "${activeFilter}" category`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.text}</p>
                      </div>
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        {!review.hasReply && (
                          <button
                            onClick={() => handleReplyToReview(review)}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
                          >
                            Reply
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(review)}
                          aria-label="Delete review"
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Reply Section */}
                    {review.hasReply && review.replyText && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-600">Your Reply:</p>
                          <button
                            onClick={() => handleReplyToReview(review)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Edit Reply
                          </button>
                        </div>
                        <p className="text-gray-700">{review.replyText}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReviewReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        review={selectedReview}
        onSubmitReply={handleSubmitReply}
        error={error}
      />

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="danger"
      />
    </>
  );
};

export default AllReviews;

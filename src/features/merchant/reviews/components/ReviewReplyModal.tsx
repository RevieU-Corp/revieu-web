import React, { useState } from 'react';
import { X, Send, Star } from 'lucide-react';

interface Review {
  id: number;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  hasReply: boolean;
  replyText?: string;
}

interface ReviewReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  onSubmitReply: (reviewId: number, replyText: string) => Promise<boolean>;
  error?: string | null;
}

const ReviewReplyModal: React.FC<ReviewReplyModalProps> = ({ 
  isOpen, 
  onClose, 
  review, 
  onSubmitReply,
  error,
}) => {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !review) return null;

  const handleSubmit = async () => {
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    
    const didPersist = await onSubmitReply(review.id, replyText.trim());
    setIsSubmitting(false);
    if (didPersist) {
      setReplyText('');
      onClose();
    }
  };

  const handleClose = () => {
    setReplyText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reply to Review</h3>
            <p className="text-sm text-gray-600">Respond professionally to customer feedback</p>
          </div>

          {error && (
            <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Review Content */}
        <div className="p-6">
          {/* Original Review */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating 
                          ? "text-yellow-400 fill-current" 
                          : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
          </div>

          {/* Existing Reply (if any) */}
          {review.hasReply && review.replyText && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  M
                </div>
                <span className="font-medium text-gray-900">Your Current Reply</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{review.replyText}</p>
            </div>
          )}

          {/* Reply Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {review.hasReply ? 'Update Your Reply' : 'Your Reply'}
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Thank you for your feedback! We appreciate your business and would love to hear more about your experience..."
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {replyText.length}/500 characters
              </span>
              <div className="text-xs text-gray-500">
                💡 Tip: Keep replies professional, friendly, and constructive
              </div>
            </div>
          </div>

          {/* Quick Reply Templates */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Thank you for your feedback! We appreciate your business.",
                "We're sorry to hear about your experience. Please contact us directly so we can make this right.",
                "We're thrilled you enjoyed your visit! Thank you for choosing us.",
                "Your feedback helps us improve. Thank you for taking the time to share your experience."
              ].map((template, index) => (
                <button
                  key={index}
                  onClick={() => setReplyText(template)}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {template.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!replyText.trim() || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: replyText.trim() ? '#FFBC0D' : undefined }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                {review.hasReply ? 'Update Reply' : 'Send Reply'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewReplyModal;

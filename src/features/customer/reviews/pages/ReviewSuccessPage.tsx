import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Home, PenLine, Star } from 'lucide-react';
import { PATHS } from '../../../../routes/paths';

const ReviewSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="p-4 space-y-6 max-w-md mx-auto pt-16">
        {/* Success Header */}
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Review Published!</h1>
          <p className="text-gray-600 leading-relaxed">
            Thank you for sharing your experience. Your review helps others make better decisions.
          </p>
        </div>

        {/* Points Earned Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Points Earned</div>
              <div className="text-2xl font-bold text-[#990000]">+50</div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">
            Keep reviewing to earn more rewards!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => navigate(PATHS.CUSTOMER.HOME)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#990000] to-[#770000] text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            onClick={() => navigate(PATHS.CUSTOMER.WRITE_REVIEW_SELECT)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            <PenLine className="w-5 h-5" />
            Write Another Review
          </button>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Tips for Better Reviews</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>Add photos to earn extra points</li>
            <li>Write detailed descriptions (20+ characters)</li>
            <li>Include specific details about your experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReviewSuccessPage;

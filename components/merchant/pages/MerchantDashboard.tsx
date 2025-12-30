import React, { useState } from 'react';
import { Star, TrendingUp, Users, Gift, Trash2 } from 'lucide-react';
import MerchantLayout from '../layout/MerchantLayout';
import TrafficChart from '../components/TrafficChart';
import CouponManager from '../components/CouponManager';
import ReviewReplyModal from '../components/ReviewReplyModal';
import ConfirmationDialog from '../components/ConfirmationDialog';

const MerchantDashboard: React.FC = () => {
  // State management
  const [showTrafficChart, setShowTrafficChart] = useState(false);
  const [showCouponManager, setShowCouponManager] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Mock data for McDonald's USC
  const businessMetrics = {
    currentRating: 4.2,
    totalReviews: 1247,
    monthlyViews: 8934,
    viewsTrend: 'up' as const,
    trendPercentage: 12.5
  };

  const [reviews, setReviews] = useState([
    {
      id: 1,
      customerName: "Sarah Chen",
      rating: 5,
      text: "Perfect spot for late night study sessions! Fast service and the Wi-Fi is reliable.",
      date: "2 hours ago",
      hasReply: false,
      replyText: ""
    },
    {
      id: 2,
      customerName: "Mike Rodriguez",
      rating: 4,
      text: "Great location near campus. The staff is friendly and the food is consistent.",
      date: "1 day ago",
      hasReply: true,
      replyText: "Thank you for your feedback! We appreciate your business."
    },
    {
      id: 3,
      customerName: "Jessica Park",
      rating: 3,
      text: "Food was good but the wait time was longer than expected during lunch rush.",
      date: "2 days ago",
      hasReply: false,
      replyText: ""
    }
  ]);

  const [coupons, setCoupons] = useState([
    { id: 1, name: "Student Special", type: "20% Off", quantity: 45, used: 23, isActive: true, expiryDate: "2024-02-15" },
    { id: 2, name: "Late Night Deal", type: "Buy 1 Get 1", quantity: 30, used: 18, isActive: true, expiryDate: "2024-01-31" },
    { id: 3, name: "Finals Week", type: "$5 Off", quantity: 100, used: 67, isActive: true, expiryDate: "2024-01-20" }
  ]);

  // Handler functions
  const handleReplyToReview = (review: any) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleSubmitReply = (reviewId: number, replyText: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, hasReply: true, replyText }
        : review
    ));
  };

  const handleDeleteReview = (review: any) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Review',
      message: `Are you sure you want to delete the review from ${review.customerName}? This action cannot be undone.`,
      onConfirm: () => {
        setReviews(reviews.filter(r => r.id !== review.id));
      }
    });
  };

  const handleUpdateCoupons = (updatedCoupons: any[]) => {
    setCoupons(updatedCoupons);
    // Force a re-render to ensure the dashboard reflects changes immediately
    console.log('Coupons updated:', updatedCoupons);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <MerchantLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">USC Review Management</h1>
          <p className="text-gray-600">Welcome back! Here's how your business is performing.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rating Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900">{businessMetrics.currentRating}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(businessMetrics.currentRating) 
                          ? "text-yellow-400 fill-current" 
                          : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{businessMetrics.totalReviews} reviews</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Views Card - Clickable */}
          <div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setShowTrafficChart(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Views</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900">{businessMetrics.monthlyViews.toLocaleString()}</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp size={14} />
                    <span className="text-sm font-medium">+{businessMetrics.trendPercentage}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Click to view details</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Coupons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Coupons</h2>
            <button 
              onClick={() => setShowCouponManager(true)}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              style={{ backgroundColor: '#FFBC0D' }}
            >
              <Gift size={16} />
              Edit Coupons
            </button>
          </div>
          <div className="space-y-3">
            {coupons.filter(coupon => coupon.isActive).map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{coupon.name}</h3>
                  <p className="text-sm text-gray-600">{coupon.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {coupon.used}/{coupon.quantity} used
                  </p>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(coupon.used / coupon.quantity) * 100}%`,
                        backgroundColor: '#FFBC0D'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            {coupons.filter(coupon => coupon.isActive).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>No active coupons. Click "Edit Coupons" to create some!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
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
                  <div className="flex gap-2">
                    {!review.hasReply && (
                      <button 
                        onClick={() => handleReplyToReview(review)}
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
                      >
                        Reply
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteReview(review)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={10} />
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{review.text}</p>
                {review.hasReply && review.replyText && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-600">Your Reply:</p>
                      <button 
                        onClick={() => handleReplyToReview(review)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">{review.replyText}</p>
                  </div>
                )}
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TrafficChart
        isOpen={showTrafficChart}
        onClose={() => setShowTrafficChart(false)}
        totalViews={businessMetrics.monthlyViews}
        trendPercentage={businessMetrics.trendPercentage}
      />

      <CouponManager
        isOpen={showCouponManager}
        onClose={() => setShowCouponManager(false)}
        coupons={coupons}
        onUpdateCoupons={handleUpdateCoupons}
      />

      <ReviewReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        review={selectedReview}
        onSubmitReply={handleSubmitReply}
      />

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="danger"
      />
    </MerchantLayout>
  );
};

export default MerchantDashboard;
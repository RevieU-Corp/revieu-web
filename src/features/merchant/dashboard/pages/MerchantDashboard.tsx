import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, TrendingUp, Users, Gift, Trash2, ChevronDown, ChevronUp, Package, Plus, UtensilsCrossed } from 'lucide-react';
import TrafficChart from '../components/TrafficChart';
import CouponFormModal from '../../marketing/components/CouponFormModal';
import CouponHorizontalList from '../../marketing/components/CouponHorizontalList';
import { Coupon, couponService } from '../../marketing/services/couponService';
import { Dish, dishService } from '../../dishes/services/dishService';
import { storeProfileService } from '../../profile/services/storeProfileService';
import PackageManager from '../../marketing/components/PackageManager';
import RedemptionButton from '../../marketing/components/RedemptionButton';
import ReviewReplyModal from '../../reviews/components/ReviewReplyModal';
import ConfirmationDialog from '../../shared/components/ConfirmationDialog';
import AllReviews from '../../reviews/pages/AllReviews';
import { PATHS } from '../../../../routes/paths';
import { reviewsApi, type MerchantReview } from '../../../../api/reviews';

const MerchantDashboard: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [showTrafficChart, setShowTrafficChart] = useState(false);
  const [showPackageManager, setShowPackageManager] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<MerchantReview | null>(null);
  const [expandedPackages, setExpandedPackages] = useState<Set<number>>(new Set());
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

  const businessMetrics = {
    currentRating: 0,
    totalReviews: 0,
    monthlyViews: 0,
    trendPercentage: 0,
  };

  const [reviews, setReviews] = useState<MerchantReview[]>([]);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
  const packages: any[] = [];

  useEffect(() => {
    let isMounted = true;
    const loadReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const fetchedReviews = await reviewsApi.listMerchant();
        if (isMounted) {
          setReviews(fetchedReviews);
          setReviewError(null);
        }
      } catch (error) {
        console.error('Failed to load merchant reviews:', error);
        if (isMounted) {
          setReviewError('Unable to load reviews. Please retry after confirming your merchant session.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingReviews(false);
        }
      }
    };
    void loadReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const loadStoreAndCoupons = async () => {
      setIsLoadingCoupons(true);
      try {
        const store = await storeProfileService.getPrimaryStore();
        if (!store) return;
        setStoreId(String(store.id));
        const [fetchedCoupons, fetchedDishes] = await Promise.all([
          couponService.list(String(store.id)),
          dishService.list(),
        ]);
        setCoupons(fetchedCoupons);
        setDishes(fetchedDishes);
      } catch (error) {
        console.error('Failed to load coupons:', error);
        setCouponError('Failed to load coupons.');
      } finally {
        setIsLoadingCoupons(false);
      }
    };
    void loadStoreAndCoupons();
  }, []);

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

  // Handler functions
  const handleReplyToReview = (review: MerchantReview) => {
    setSelectedReview(review);
    setReviewError(null);
    setShowReplyModal(true);
  };

  const togglePackageExpansion = (packageId: number) => {
    setExpandedPackages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  };

  const handleSubmitReply = async (reviewId: number, replyText: string): Promise<boolean> => {
    try {
      const updatedReview = await reviewsApi.replyMerchant(reviewId, replyText);
      setReviews((currentReviews) => currentReviews.map((review) => (
        review.id === reviewId ? updatedReview : review
      )));
      setReviewError(null);
      return true;
    } catch (error) {
      console.error('Failed to persist merchant reply:', error);
      setReviewError('Reply was not saved. Check your connection and merchant permissions, then try again.');
      return false;
    }
  };

  const deleteReview = async (reviewId: number): Promise<boolean> => {
    try {
      await reviewsApi.deleteMerchant(reviewId);
      setReviews((currentReviews) => currentReviews.filter((review) => review.id !== reviewId));
      setReviewError(null);
      return true;
    } catch (error) {
      console.error('Failed to archive merchant review:', error);
      setReviewError('Review was not deleted. Check your connection and merchant permissions, then try again.');
      return false;
    }
  };

  const handleDeleteReview = (review: MerchantReview) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Review',
      message: `Are you sure you want to delete the review from ${review.customerName}? This action cannot be undone.`,
      onConfirm: () => {
        void (async () => {
          const didPersist = await deleteReview(review.id);
          if (didPersist) {
            closeConfirmDialog();
          }
        })();
      },
    });
  };

  const refreshCoupons = async () => {
    if (!storeId) return;
    try {
      setCoupons(await couponService.list(storeId));
    } catch (error) {
      console.error('Failed to load coupons:', error);
      setCouponError('Failed to load coupons.');
    }
  };

  const handleCreateOrUpdateCoupon = async (payload: Parameters<typeof couponService.create>[1]) => {
    if (!storeId) return;
    setCouponError(null);
    try {
      if (editingCoupon) {
        await couponService.update(storeId, editingCoupon.id, payload);
      } else {
        await couponService.create(storeId, payload);
      }
      setIsCouponFormOpen(false);
      setEditingCoupon(null);
      await refreshCoupons();
    } catch (error) {
      console.error('Failed to save coupon:', error);
      setCouponError('Failed to save coupon.');
    }
  };

  const handleToggleCouponEnabled = async (coupon: Coupon) => {
    if (!storeId) return;
    setCouponError(null);
    try {
      await couponService.setEnabled(storeId, coupon.id, coupon.status === 'disabled');
      await refreshCoupons();
    } catch (error) {
      console.error('Failed to update coupon status:', error);
      setCouponError('Failed to update coupon status.');
    }
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    if (!storeId) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Coupon',
      message: `Are you sure you want to delete "${coupon.title}"? This action cannot be undone.`,
      onConfirm: () => {
        void (async () => {
          setCouponError(null);
          try {
            await couponService.remove(storeId, coupon.id);
            await refreshCoupons();
          } catch (error) {
            console.error('Failed to delete coupon:', error);
            setCouponError('Failed to delete coupon.');
          } finally {
            closeConfirmDialog();
          }
        })();
      },
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="p-4 space-y-6 relative">
      {/* Redemption Button - Dashboard Only */}
      <div className="fixed top-4 right-4 z-[60]">
        <RedemptionButton />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Store</h1>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(PATHS.MERCHANT.CREATE_POST)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={16} />
          Create Post
        </button>
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

        {/* Store Analytics Card - Clickable */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(PATHS.MERCHANT.ANALYTICS)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Store Analytics</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900">{businessMetrics.monthlyViews.toLocaleString()}</span>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={14} />
                  <span className="text-sm font-medium">+{businessMetrics.trendPercentage}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Monthly views • Click for detailed analytics</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Dish Management Card - Clickable */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate(PATHS.MERCHANT.DISHES)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Menu / Dishes</p>
              <p className="text-xs text-gray-500 mt-1">Manage your dishes and their images</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <UtensilsCrossed className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Coupons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Coupons</h2>
          <button
            onClick={() => { setEditingCoupon(null); setIsCouponFormOpen(true); }}
            disabled={!storeId}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#FFBC0D' }}
          >
            <Gift size={16} />
            Create Coupon
          </button>
        </div>
        {couponError && (
          <div className="mb-4 px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {couponError}
          </div>
        )}
        {isLoadingCoupons ? (
          <p className="text-gray-500 text-center py-4">Loading...</p>
        ) : (
          <CouponHorizontalList
            coupons={coupons}
            dishes={dishes}
            onEdit={(coupon) => { setEditingCoupon(coupon); setIsCouponFormOpen(true); }}
            onToggleEnabled={handleToggleCouponEnabled}
            onDelete={handleDeleteCoupon}
          />
        )}
      </div>

      {/* Packages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Packages</h2>
          <button
            onClick={() => setShowPackageManager(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors bg-green-500"
          >
            <Package size={16} />
            View Availability
          </button>
        </div>
        <div className="space-y-3">
          {packages.filter(pkg => pkg.isActive).map((pkg) => {
            const isExpanded = expandedPackages.has(pkg.id);
            const savings = pkg.originalPrice - pkg.bundlePrice;
            const savingsPercentage = Math.round((savings / pkg.originalPrice) * 100);

            return (
              <div key={pkg.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Main Package Card */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => togglePackageExpansion(pkg.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{pkg.name}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        ${pkg.bundlePrice.toFixed(2)}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium line-through">
                        ${pkg.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {pkg.bundleItems.length} items • Save ${savings.toFixed(2)} ({savingsPercentage}% off)
                    </p>
                  </div>
                  <div className="ml-4 text-gray-400">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expandable Details Section */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    <div className="pt-4 space-y-4">
                      {/* Package Image */}
                      {pkg.productImage && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Package Image</h4>
                          <img
                            src={pkg.productImage}
                            alt={pkg.name}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}

                      {/* Description Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                        <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                          <p className="whitespace-pre-wrap">{pkg.description}</p>
                        </div>
                      </div>

                      {/* Bundle Items */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">What's Included</h4>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="space-y-2">
                            {pkg.bundleItems.map((item: any) => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="text-gray-500">${item.price.toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-gray-900">Bundle Total</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-red-500 line-through">${pkg.originalPrice.toFixed(2)}</span>
                                  <span className="text-green-600">${pkg.bundlePrice.toFixed(2)}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-green-600 font-medium">
                                  You save ${savings.toFixed(2)}!
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {packages.filter(pkg => pkg.isActive).length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p>Package creation is coming soon. This screen does not save local-only changes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
          <button
            onClick={() => setShowAllReviews(true)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </button>
        </div>
        {reviewError && (
          <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {reviewError}
          </div>
        )}
        <div className="space-y-4">
          {isLoadingReviews ? (
            <p className="py-8 text-center text-gray-500">Loading reviews...</p>
          ) : reviews.filter(review => isToday(review.date)).map((review) => (
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
                    <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
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
          {!isLoadingReviews && reviews.filter(review => isToday(review.date)).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No reviews today yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TrafficChart
        isOpen={showTrafficChart}
        onClose={() => setShowTrafficChart(false)}
        totalViews={businessMetrics.monthlyViews}
        trendPercentage={businessMetrics.trendPercentage}
      />

      <CouponFormModal
        isOpen={isCouponFormOpen}
        coupon={editingCoupon}
        dishes={dishes}
        error={couponError}
        onClose={() => { setIsCouponFormOpen(false); setEditingCoupon(null); }}
        onSubmit={handleCreateOrUpdateCoupon}
      />

      <PackageManager
        isOpen={showPackageManager}
        onClose={() => setShowPackageManager(false)}
        packages={packages}
      />

      <ReviewReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        review={selectedReview}
        onSubmitReply={handleSubmitReply}
        error={reviewError}
      />

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="danger"
      />

      {/* All Reviews Modal */}
      {showAllReviews && (
        <div className="fixed inset-0 z-50 bg-white">
          <AllReviews
            reviews={reviews}
            onReply={handleSubmitReply}
            onDelete={deleteReview}
            error={reviewError}
            onClose={() => setShowAllReviews(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;

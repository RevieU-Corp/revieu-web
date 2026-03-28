import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { PATHS } from '../../../../routes/paths';
import {
  Icons,
  ReviewCard,
  CouponCard,
  StatsBar,
  ProfileNavbar,
  SectionHeading,
  AccountSection,
  PendingReviewMerchants,
  MyHistorySection
} from '../components';
import {
  generateCreativeBio,
  getLatestVisitedMerchantsWithoutReview,
} from '../services/profileService';
import { UserProfile, Review, Coupon, PendingReviewMerchant } from '../types';
import { reviewsApi, ReviewResponse } from '../../../../api/reviews';
import { getContextualMockImage } from '../../../../utils/mockImages';
import { voucherService } from '../../shared/services/voucherService';
import { Voucher as CustomerVoucher } from '../../shared/types/coupons';

const REVIEW_PAGE_SIZE = 20;

// Helper function to format date as relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  return `${diffMonths}mo ago`;
}

// Transform API response to Review type
function transformReviewResponse(response: ReviewResponse): Review {
  const businessImage = response.businessImage?.trim()
    ? response.businessImage
    : getContextualMockImage(`business-${response.id}`, response.businessName);

  const images = (response.images || []).map((image, index) =>
    image?.trim() ? image : getContextualMockImage(`review-${response.id}-${index}`, response.businessName || response.text)
  );

  return {
    id: response.id,
    businessName: response.businessName || 'Unknown Business',
    businessImage,
    location: response.location || '',
    rating: response.overallRating,
    date: formatRelativeTime(response.createdAt),
    content: response.text || '',
    images,
    helpfulCount: response.likeCount || 0,
    createdAt: response.createdAt,
  };
}

const REWARD_COLORS = ['#C41111', '#F97316', '#F7CD46', '#0F766E'];

const mapVoucherToRewardCoupon = (voucher: CustomerVoucher, index: number): Coupon => ({
  id: voucher.id,
  businessName: voucher.merchantName || 'RevieU Merchant',
  offerTitle: voucher.dealTitle || 'Reward Voucher',
  expiryDate:
    voucher.status === 'expired'
      ? 'Expired'
      : `Expires ${voucher.expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
  code: voucher.code,
  status: voucher.status === 'expired' ? 'expired' : 'active',
  logo: voucher.qrCode || `https://api.dicebear.com/7.x/shapes/svg?seed=${voucher.merchantId || voucher.id}`,
  color: REWARD_COLORS[index % REWARD_COLORS.length],
});

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'profile' | 'reviews'>('profile');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsLoadingMore, setReviewsLoadingMore] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewsCursor, setReviewsCursor] = useState<string | undefined>(undefined);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [pendingReviewMerchants, setPendingReviewMerchants] = useState<PendingReviewMerchant[]>([]);
  const [pendingMerchantsLoading, setPendingMerchantsLoading] = useState(false);
  const [rewardCoupons, setRewardCoupons] = useState<Coupon[]>([]);

  const applyReviewPage = (responses: ReviewResponse[], total: number, cursor?: string, append = false) => {
    const transformedReviews = responses.map(transformReviewResponse);
    setReviews(previousReviews =>
      append ? [...previousReviews, ...transformedReviews] : transformedReviews
    );
    setReviewsTotal(total);
    setReviewsCursor(cursor);
  };

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const response = await reviewsApi.list({ limit: REVIEW_PAGE_SIZE });
        applyReviewPage(response.data, response.total, response.cursor);
      } catch (err) {
        setReviewsError('Failed to load reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchPendingReviewMerchants = async () => {
      setPendingMerchantsLoading(true);
      try {
        const merchants = await getLatestVisitedMerchantsWithoutReview();
        setPendingReviewMerchants(merchants);
      } catch (err) {
        console.error('Error fetching pending review merchants:', err);
        setPendingReviewMerchants([]);
      } finally {
        setPendingMerchantsLoading(false);
      }
    };

    fetchPendingReviewMerchants();
  }, []);

  useEffect(() => {
    const fetchRewardCoupons = async () => {
      if (!authUser?.id) {
        setRewardCoupons([]);
        return;
      }

      try {
        const vouchers = await voucherService.getUserVouchers(String(authUser.id));
        const mappedCoupons = [...vouchers.active, ...vouchers.expired].map((voucher, index) =>
          mapVoucherToRewardCoupon(voucher, index)
        );
        setRewardCoupons(mappedCoupons);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        setRewardCoupons([]);
      }
    };

    fetchRewardCoupons();
  }, [authUser?.id]);

  // Create UserProfile from AuthContext user data
  const [user, setUser] = useState<UserProfile>({
    name: authUser?.name || 'User',
    handle: `@${authUser?.email?.split('@')[0] || 'user'}`,
    location: 'Los Angeles, CA', // TODO: Get from user profile API
    level: 5, // TODO: Get from API
    points: 8450, // TODO: Get from API
    nextLevelPoints: 10000, // TODO: Get from API
    joinDate: '2024', // TODO: Get from user creation date
    bio: `Exploring the city one bite at a time! 🍜🎟️`,
    avatar: authUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (authUser?.name || 'default'),
    coverImage: 'https://picsum.photos/id/431/1000/600',
    stats: {
      totalReviews: 142, // TODO: Get from API
      photosUploaded: 856, // TODO: Get from API
      helpfulVotes: 4205, // TODO: Get from API
      views: '2.4M', // TODO: Get from API
      following: 318, // TODO: Get from API
    }
  });

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    const newBio = await generateCreativeBio(user, ['Coffee', 'Photography', 'Asian Fusion', 'Urban Hiking']);
    setUser(prev => ({ ...prev, bio: newBio }));
    setIsGeneratingBio(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleWriteReviewFromMerchant = (merchant: PendingReviewMerchant) => {
    navigate(PATHS.CUSTOMER.WRITE_REVIEW, {
      state: {
        merchantId: merchant.id,
        merchantName: merchant.businessName,
      },
    });
  };

  const handleStorageClick = () => {
    // Placeholder entry reserved for future storage feature.
  };

  const handleLoadMoreReviews = async () => {
    if (!reviewsCursor || reviewsLoadingMore) {
      return;
    }

    setReviewsLoadingMore(true);
    setReviewsError(null);
    try {
      const response = await reviewsApi.list({ limit: REVIEW_PAGE_SIZE, cursor: reviewsCursor });
      applyReviewPage(response.data, response.total, response.cursor, true);
    } catch (err) {
      setReviewsError('Failed to load reviews');
      console.error('Error loading more reviews:', err);
    } finally {
      setReviewsLoadingMore(false);
    }
  };

  const activeCoupons = rewardCoupons.filter(c => c.status === 'active');
  const latestReview = useMemo(() => {
    if (reviews.length === 0) {
      return null;
    }

    return [...reviews].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [reviews]);

  // --- REVIEWS PAGE VIEW ---
  if (currentView === 'reviews') {
    return (
      <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-[#C41111]/8 rounded-full blur-[80px] mix-blend-multiply opacity-45"></div>
        </div>

        <ProfileNavbar />

        <div className="max-w-[800px] mx-auto min-h-screen flex flex-col relative z-10 animate-fade-in-right">
          {/* Header */}
          <div className="sticky top-14 z-20 bg-[#FDFDFD]/90 backdrop-blur-xl p-4 md:px-6 md:py-6 flex items-center gap-4">
            <button
              onClick={() => setCurrentView('profile')}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-brand-red hover:shadow-md transition-all active:scale-95"
            >
              <Icons.ChevronRight className="rotate-180" size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-xs text-gray-500 font-medium">{reviewsTotal} total contributions</p>
            </div>
          </div>

          {/* List */}
          <div className="px-4 md:px-6 pb-20 space-y-4">
            {reviewsLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C41111]"></div>
              </div>
            )}
            {reviewsError && (
              <div className="text-center py-8 text-red-500">{reviewsError}</div>
            )}
            {!reviewsLoading && !reviewsError && reviews.length === 0 && (
              <div className="text-center py-8 text-gray-500">No reviews yet</div>
            )}
            {!reviewsLoading && !reviewsError && reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {!reviewsLoading && !reviewsError && reviewsCursor && reviews.length > 0 && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleLoadMoreReviews}
                  disabled={reviewsLoadingMore}
                  className="rounded-full border border-[#C41111]/15 bg-white px-5 py-2 text-sm font-semibold text-[#C41111] shadow-sm transition-colors hover:bg-[#C41111]/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reviewsLoadingMore ? 'Loading more reviews...' : 'Load more reviews'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- PROFILE VIEW ---
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 relative selection:bg-[#C41111]/20 selection:text-[#C41111]">

      {/* 1. Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-[#F7CD46]/12 rounded-full blur-[100px] mix-blend-multiply opacity-60 animate-pulse-slow"></div>
        <div className="absolute top-[10%] -right-[10%] w-[500px] h-[500px] bg-[#C41111]/8 rounded-full blur-[80px] mix-blend-multiply opacity-60"></div>
      </div>

      <ProfileNavbar />

      <main className="w-full max-w-[1400px] mx-auto md:px-6 md:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-start">

          {/* --- Left Column: Profile --- */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24">

            <div className="bg-white/80 backdrop-blur-md pb-6 rounded-b-[32px] md:rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-white/50 overflow-hidden relative transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              {/* Cover */}
              <div className="h-44 md:h-60 w-full relative group">
                <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-gray-900 transition-all shadow-lg">
                    <Icons.Share size={18} />
                  </button>
                </div>
              </div>

              {/* Avatar & Identity */}
              <div className="px-6">
                <div className="flex justify-between items-end -mt-14 mb-5">
                  <div className="relative group cursor-pointer">
                    <div className="w-[104px] h-[104px] rounded-full p-1 bg-white shadow-xl">
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover bg-gray-100 border border-gray-100"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <div className="bg-black/50 p-2 rounded-full text-white backdrop-blur-sm">
                        <Icons.Camera size={20} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(PATHS.CUSTOMER.ME.PROFILE)}
                    className="bg-gradient-to-r from-[#C41111] via-[#B20808] to-[#930404] text-white px-6 py-2.5 rounded-full text-[13px] font-bold shadow-lg shadow-[#C41111]/25 active:scale-95 transition-all hover:brightness-110 hover:shadow-xl"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="mb-6">
                  <h1 className="text-[28px] font-bold text-gray-900 leading-tight tracking-tight mb-1">{user.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                      <Icons.MapPin size={12} className="text-[#C41111]" /> {user.location}
                    </span>
                    <span>•</span>
                    <span className="text-[#C41111] font-semibold">Level {user.level} Guide</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="relative group mb-8">
                  <p className="text-gray-600 text-[15px] leading-relaxed">
                    {user.bio}
                  </p>
                  <button
                    onClick={handleGenerateBio}
                    disabled={isGeneratingBio}
                    className="absolute -right-2 -top-2 p-2 text-[#C41111]/60 hover:text-[#C41111] bg-transparent hover:bg-[#C41111]/5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="AI Enhance"
                  >
                    <Icons.Sparkles size={16} className={isGeneratingBio ? "animate-spin" : ""} />
                  </button>
                </div>

                <StatsBar stats={user.stats} />

                {/* Desktop Account Menu */}
                <div className="hidden lg:block mt-8">
                  <AccountSection
                    onAccountSecurity={() => navigate(PATHS.CUSTOMER.ME.PRIVACY)}
                    onNotification={() => navigate(PATHS.CUSTOMER.ME.NOTIFICATIONS)}
                    onStorage={handleStorageClick}
                    onSupport={() => navigate(PATHS.CUSTOMER.ME.HELP)}
                    onLogout={handleLogout}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Content Feed --- */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-10 px-4 md:px-0 py-6 md:py-0 pb-20">

            <PendingReviewMerchants
              merchants={pendingReviewMerchants}
              loading={pendingMerchantsLoading}
              onWriteReview={handleWriteReviewFromMerchant}
            />

            {/* 2. Wallet Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <SectionHeading
                icon={<Icons.Wallet />}
                title="My Rewards"
                rightSlot={(
                  <span className="text-xs font-bold text-[#C41111] bg-[#C41111]/5 px-3 py-1.5 rounded-full border border-[#C41111]/15">
                    {activeCoupons.length} Available
                  </span>
                )}
              />

              <div className="flex overflow-x-auto gap-5 pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-2 xl:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
                {activeCoupons.map((coupon) => (
                  <div key={coupon.id} className="min-w-[85%] sm:min-w-[320px] md:min-w-0 snap-center h-full">
                    <CouponCard coupon={coupon} className="h-full" />
                  </div>
                ))}
                <div className="min-w-[120px] snap-center flex flex-col items-center justify-center bg-white rounded-[24px] border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#F7CD46] hover:text-[#F59E0B] transition-all cursor-pointer md:h-full min-h-[200px] hover:bg-[#F7CD46]/10 group">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#F7CD46]/20 group-hover:scale-110 transition-transform">
                    <Icons.ChevronRight size={24} />
                  </div>
                  <span className="text-xs font-bold tracking-wide">VIEW ALL</span>
                </div>
              </div>
            </section>

            <MyHistorySection
              latestReview={latestReview}
              loading={reviewsLoading}
              onViewAllReviews={() => setCurrentView('reviews')}
            />

            {/* Mobile Settings */}
            <section className="lg:hidden mt-8 mb-12">
              <AccountSection
                onAccountSecurity={() => navigate(PATHS.CUSTOMER.ME.PRIVACY)}
                onNotification={() => navigate(PATHS.CUSTOMER.ME.NOTIFICATIONS)}
                onStorage={handleStorageClick}
                onSupport={() => navigate(PATHS.CUSTOMER.ME.HELP)}
                onLogout={handleLogout}
              />
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

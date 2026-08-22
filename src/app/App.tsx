import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { PATHS } from '../routes/paths';

const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const MerchantLoginPage = lazy(() => import('../features/auth/pages/MerchantLoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const GoogleCallbackPage = lazy(() => import('../features/auth/pages/GoogleCallbackPage'));

const CustomerLayout = lazy(() => import('../features/customer/shared/layout/CustomerLayout'));
const HomePage = lazy(() => import('../features/customer/home/pages/HomePage'));
const DiscoverPage = lazy(() => import('../features/customer/discover/pages/DiscoverPage'));
const ExplorePage = lazy(() => import('../features/customer/explore/pages/ExplorePage'));
const ProfilePage = lazy(() => import('../features/customer/profile/pages/ProfilePage'));
const ProfileSettingsPage = lazy(() => import('../features/customer/profile/pages/ProfileSettingsPage'));
const ReviewsPage = lazy(() => import('../features/customer/reviews/pages/ReviewsPage'));
const WriteReviewPage = lazy(() => import('../features/customer/reviews/pages/WriteReviewPage'));
const WriteReviewSelectPage = lazy(() => import('../features/customer/reviews/pages/WriteReviewSelectPage'));
const ReviewSuccessPage = lazy(() => import('../features/customer/reviews/pages/ReviewSuccessPage'));
const PostPage = lazy(() => import('../features/customer/reviews/pages/PostPage'));
const MerchantDetailPage = lazy(() => import('../features/customer/pages/MerchantDetailPage/RestaurantDetailPage'));
const MerchantReviewsPage = lazy(() => import('../features/customer/pages/MerchantDetailPage/MerchantReviewsPage'));
const MerchantProfileCouponPage = lazy(() => import('../features/customer/pages/MerchantDetailPage/MerchantProfileCouponPage'));
const DealQrPage = lazy(() => import('../features/customer/pages/DealQrPage'));
const PaymentPage = lazy(() => import('../features/customer/pages/PaymentPage'));
const PaymentSuccessPage = lazy(() => import('../features/customer/pages/PaymentSuccessPage'));
const CouponPaymentSuccessPage = lazy(() => import('../features/customer/pages/CouponPaymentSuccessPage'));
const VoucherDisplay = lazy(() => import('../features/customer/vouchers/components/VoucherDisplay'));

const MerchantLayout = lazy(() => import('../features/merchant/shared/layout/MerchantLayout'));
const MerchantDashboard = lazy(() => import('../features/merchant/dashboard/pages/MerchantDashboard'));
const VerificationPage = lazy(() => import('../features/merchant/profile/pages/VerificationPage'));
const PostCreation = lazy(() => import('../features/merchant/marketing/pages/PostCreation'));
const StoreAnalytics = lazy(() => import('../features/merchant/dashboard/pages/StoreAnalytics'));
const AdManager = lazy(() => import('../features/merchant/dashboard/pages/AdManager'));
const StoreProfile = lazy(() => import('../features/merchant/profile/pages/StoreProfile'));
const DishManagementPage = lazy(() => import('../features/merchant/dishes/pages/DishManagementPage'));
const Messages = lazy(() => import('../features/merchant/messages/pages/Messages'));
const ChatDetail = lazy(() => import('../features/merchant/messages/pages/ChatDetail'));
const SearchMessages = lazy(() => import('../features/merchant/messages/pages/SearchMessages'));
const Notifications = lazy(() => import('../features/merchant/dashboard/pages/Notifications'));

const RouteFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-white px-6 text-sm text-gray-600" role="status" aria-live="polite">
    Loading page…
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to={PATHS.CUSTOMER.HOME} replace />} />
        <Route path={PATHS.AUTH.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.AUTH.REGISTER} element={<RegisterPage />} />
        <Route path={PATHS.AUTH.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={PATHS.AUTH.GOOGLE_CALLBACK} element={<GoogleCallbackPage />} />
        <Route path={PATHS.MERCHANT.LOGIN} element={<MerchantLoginPage />} />
        <Route path={PATHS.MERCHANT.VERIFICATION} element={<VerificationPage />} />

      {/* Customer Routes (under CustomerLayout) */}
        <Route path={PATHS.CUSTOMER.ROOT} element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path={PATHS.CUSTOMER.HOME} element={<HomePage />} />
          <Route path={PATHS.CUSTOMER.DISCOVER} element={<DiscoverPage />} />
          <Route path={PATHS.CUSTOMER.EXPLORE} element={<ExplorePage />} />
          <Route path={PATHS.CUSTOMER.ME.ROOT} element={<ProfilePage />} />
          <Route path={PATHS.CUSTOMER.ME.PROFILE} element={<ProfileSettingsPage />} />
          <Route path={PATHS.CUSTOMER.ME.EDIT_PROFILE} element={<ProfileSettingsPage />} />
          <Route path={PATHS.CUSTOMER.ME.SETTINGS} element={<ProfileSettingsPage />} />
          <Route path={PATHS.CUSTOMER.ME.REVIEWS} element={<ReviewsPage />} />
          <Route path={PATHS.CUSTOMER.ME.COMMUNITY} element={<ProfilePage />} />
          <Route path={PATHS.CUSTOMER.ME.PAYMENTS} element={<ProfileSettingsPage />} />
          <Route path={PATHS.CUSTOMER.ME.PRIVACY} element={<ProfileSettingsPage />} />
          <Route path={PATHS.CUSTOMER.ME.NOTIFICATIONS} element={<ProfileSettingsPage />} />
          <Route path={PATHS.CUSTOMER.ME.HELP} element={<ProfileSettingsPage />} />
          <Route path={PATHS.CUSTOMER.POST_DETAIL} element={<PostPage />} />
          <Route path={PATHS.CUSTOMER.MERCHANT_DETAIL} element={<MerchantDetailPage />} />
          <Route path={PATHS.CUSTOMER.MERCHANT_PROFILE_COUPON_DETAIL} element={<MerchantProfileCouponPage />} />
          <Route path={PATHS.CUSTOMER.MERCHANT_DEAL_QR_DETAIL} element={<DealQrPage />} />
          <Route path="/customer/merchant/:id/reviews" element={<MerchantReviewsPage />} />
          <Route path={PATHS.CUSTOMER.WRITE_REVIEW_SELECT} element={<WriteReviewSelectPage />} />
          <Route path={PATHS.CUSTOMER.WRITE_REVIEW} element={<WriteReviewPage />} />
          <Route path={PATHS.CUSTOMER.REVIEW_SUCCESS} element={<ReviewSuccessPage />} />
          <Route path="/customer/payment" element={<PaymentPage />} />
          <Route path="/customer/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/customer/payment/coupon-success" element={<CouponPaymentSuccessPage />} />
          <Route path="/customer/voucher/display" element={<VoucherDisplay />} />
        </Route>
        <Route path={PATHS.MERCHANT.ROOT} element={<MerchantLayout />}>
          <Route path={PATHS.MERCHANT.DASHBOARD} element={<MerchantDashboard />} />
          <Route path={PATHS.MERCHANT.CREATE_POST} element={<PostCreation />} />
          <Route path={PATHS.MERCHANT.ANALYTICS} element={<StoreAnalytics />} />
          <Route path={PATHS.MERCHANT.DISHES} element={<DishManagementPage />} />
          <Route path={PATHS.MERCHANT.ADS} element={<AdManager />} />
          <Route path={PATHS.MERCHANT.PROFILE} element={<StoreProfile />} />
          <Route path={PATHS.MERCHANT.MESSAGES} element={<Messages />} />
          <Route path={PATHS.MERCHANT.CHAT_DETAIL} element={<ChatDetail />} />
          <Route path={PATHS.MERCHANT.CHAT_SEARCH} element={<SearchMessages />} />
          <Route path={PATHS.MERCHANT.NOTIFICATIONS} element={<Notifications />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen font-sans">
        <AppRouter />
      </div>
    </AuthProvider>
  );
};

export default App;

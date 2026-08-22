import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { PATHS } from '../routes/paths';
import { LoginPage, MerchantLoginPage, RegisterPage, ForgotPasswordPage, GoogleCallbackPage } from '../features/auth';
import {
  HomePage, DiscoverPage, ExplorePage, ProfilePage, ProfileSettingsPage,
  CustomerLayout, VoucherDisplay, ReviewsPage, WriteReviewPage, WriteReviewSelectPage, ReviewSuccessPage, PostPage, MerchantDetailPage, MerchantReviewsPage,
  RestaurantDetailPage, PaymentPage, PaymentSuccessPage, CouponPaymentSuccessPage, DealQrPage
} from '../features/customer';

// Merchant Portal Components
import {
  MerchantLayout,
  MerchantDashboard,
  VerificationPage,
  PostCreation,
  StoreAnalytics,
  AdManager,
  StoreProfile,
  DishManagementPage,
  Messages,
  ChatDetail,
  SearchMessages,
  Notifications
} from '../features/merchant';

const AppRouter: React.FC = () => {
  return (
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
        <Route path={PATHS.CUSTOMER.MERCHANT_PROFILE_COUPON_DETAIL} element={<RestaurantDetailPage />} />
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

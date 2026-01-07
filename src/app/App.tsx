import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { PATHS } from '../routes/paths';
import { LoginPage, MerchantLoginPage, RegisterPage, ForgotPasswordPage, GoogleCallbackPage } from '../features/auth';
import { HomePage } from '../features/home';
import { PostPage, WriteReviewPage } from '../features/reviews';
import { DiscoverPage } from '../features/discover';
import { ProfilePage } from '../features/profile';

// Common Components

// Customer Components
import CustomerLayout from '../components/layout/CustomerLayout';

// Merchant Portal Components
import MerchantLayout from '../features/merchant/layout/MerchantLayout';
import MerchantDashboard from '../features/merchant/pages/MerchantDashboard';
import AdManager from '../features/merchant/pages/AdManager';
import StoreProfile from '../features/merchant/pages/StoreProfile';
import Messages from '../features/merchant/pages/Messages';
import Notifications from '../features/merchant/pages/Notifications';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path={PATHS.AUTH.LOGIN} element={<LoginPage />} />
      <Route path={PATHS.AUTH.REGISTER} element={<RegisterPage />} />
      <Route path={PATHS.AUTH.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
      <Route path={PATHS.AUTH.GOOGLE_CALLBACK} element={<GoogleCallbackPage />} />

      {/* Merchant Auth */}
      <Route path={PATHS.MERCHANT.LOGIN} element={<MerchantLoginPage />} />

      {/* Customer Routes (under CustomerLayout) */}
      <Route path={PATHS.CUSTOMER.ROOT} element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path={PATHS.CUSTOMER.HOME} element={<HomePage />} />
        <Route path={PATHS.CUSTOMER.DISCOVER} element={<DiscoverPage />} />
        <Route path={PATHS.CUSTOMER.PROFILE} element={<ProfilePage />} />
        <Route path={PATHS.CUSTOMER.POST_DETAIL} element={<PostPage />} />
        <Route path={PATHS.CUSTOMER.WRITE_REVIEW} element={<WriteReviewPage />} />
      </Route>

      {/* Merchant Portal Routes (under MerchantLayout) */}
      <Route path={PATHS.MERCHANT.ROOT} element={<MerchantLayout />}>
        <Route path={PATHS.MERCHANT.DASHBOARD} element={<MerchantDashboard />} />
        <Route path={PATHS.MERCHANT.ADS} element={<AdManager />} />
        <Route path={PATHS.MERCHANT.PROFILE} element={<StoreProfile />} />
        <Route path={PATHS.MERCHANT.MESSAGES} element={<Messages />} />
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
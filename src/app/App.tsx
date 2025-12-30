import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LoginPage, RegisterPage, ForgotPasswordPage, GoogleCallbackPage } from '../features/auth';
import { HomePage } from '../features/home';
import { PostPage, WriteReviewPage } from '../features/reviews';
import { DiscoverPage } from '../features/discover';
import { ProfilePage } from '../features/profile';

// Common Components
import EntryPage from '../components/common/EntryPage';

// Customer Components
import CustomerLayout from '../components/customer/CustomerLayout';

// Merchant Portal Components
import MerchantDashboard from '../components/merchant/pages/MerchantDashboard';
import AdManager from '../components/merchant/pages/AdManager';
import StoreProfile from '../components/merchant/pages/StoreProfile';
import Messages from '../components/merchant/pages/Messages';
import Notifications from '../components/merchant/pages/Notifications';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Entry Point */}
      <Route path="/" element={<EntryPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

      {/* Customer Routes */}
      <Route path="/customer" element={
        <CustomerLayout>
          <HomePage />
        </CustomerLayout>
      } />
      <Route path="/customer/home" element={
        <CustomerLayout>
          <HomePage />
        </CustomerLayout>
      } />
      <Route path="/customer/discover" element={
        <CustomerLayout>
          <DiscoverPage />
        </CustomerLayout>
      } />
      <Route path="/customer/profile" element={
        <CustomerLayout>
          <ProfilePage />
        </CustomerLayout>
      } />
      <Route path="/customer/post/:id" element={
        <CustomerLayout>
          <PostPage />
        </CustomerLayout>
      } />
      <Route path="/customer/write-review" element={
        <CustomerLayout>
          <WriteReviewPage />
        </CustomerLayout>
      } />

      {/* Legacy Customer Routes (for backward compatibility) */}
      <Route path="/home" element={
        <CustomerLayout>
          <HomePage />
        </CustomerLayout>
      } />
      <Route path="/discover" element={
        <CustomerLayout>
          <DiscoverPage />
        </CustomerLayout>
      } />
      <Route path="/profile" element={
        <CustomerLayout>
          <ProfilePage />
        </CustomerLayout>
      } />
      <Route path="/post/:id" element={
        <CustomerLayout>
          <PostPage />
        </CustomerLayout>
      } />
      <Route path="/write-review" element={
        <CustomerLayout>
          <WriteReviewPage />
        </CustomerLayout>
      } />

      {/* Merchant Portal Routes */}
      <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
      <Route path="/merchant/ads" element={<AdManager />} />
      <Route path="/merchant/profile" element={<StoreProfile />} />
      <Route path="/merchant/messages" element={<Messages />} />
      <Route path="/merchant/notifications" element={<Notifications />} />
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
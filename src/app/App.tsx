import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LoginPage, MerchantLoginPage, RegisterPage, ForgotPasswordPage, GoogleCallbackPage } from '../features/auth';
import { HomePage } from '../features/home';
import { PostPage, WriteReviewPage } from '../features/reviews';
import { DiscoverPage } from '../features/discover';
import { ProfilePage } from '../features/profile';

// Common Components

// Customer Components
import CustomerLayout from '../components/customer/CustomerLayout';

// Merchant Portal Components
import MerchantLayout from '../components/merchant/layout/MerchantLayout';
import MerchantDashboard from '../components/merchant/pages/MerchantDashboard';
import AdManager from '../components/merchant/pages/AdManager';
import StoreProfile from '../components/merchant/pages/StoreProfile';
import Messages from '../components/merchant/pages/Messages';
import ChatDetail from '../components/merchant/pages/ChatDetail';
import SearchMessages from '../components/merchant/pages/SearchMessages';
import Notifications from '../components/merchant/pages/Notifications';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

      {/* Merchant Auth */}
      <Route path="/merchant/login" element={<MerchantLoginPage />} />

      {/* Customer Routes (under CustomerLayout) */}
      <Route path="/customer" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="post/:id" element={<PostPage />} />
        <Route path="write-review" element={<WriteReviewPage />} />
      </Route>

      {/* Legacy Customer Routes (backward compatibility) */}
      <Route element={<CustomerLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/write-review" element={<WriteReviewPage />} />
      </Route>

      {/* Merchant Portal Routes (under MerchantLayout) */}
      <Route path="/merchant" element={<MerchantLayout />}>
        <Route path="dashboard" element={<MerchantDashboard />} />
        <Route path="ads" element={<AdManager />} />
        <Route path="profile" element={<StoreProfile />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:chatId" element={<ChatDetail />} />
        <Route path="messages/:chatId/search" element={<SearchMessages />} />
        <Route path="notifications" element={<Notifications />} />
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
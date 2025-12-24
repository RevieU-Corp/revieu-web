
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import GoogleCallbackPage from './components/auth/GoogleCallbackPage';
import HomePage from './components/content/HomePage';
import PostPage from './components/content/PostPage';
import DiscoverPage from './components/content/DiscoverPage';
import ProfilePage from './components/content/ProfilePage';
import WriteReviewPage from './components/content/WriteReviewPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen font-sans">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/write-review" element={<WriteReviewPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;

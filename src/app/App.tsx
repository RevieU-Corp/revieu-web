import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { LoginPage, RegisterPage, ForgotPasswordPage, GoogleCallbackPage } from '../features/auth';
import { HomePage } from '../features/home';
import { PostPage, WriteReviewPage } from '../features/reviews';
import { DiscoverPage } from '../features/discover';
import { ProfilePage } from '../features/profile';

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
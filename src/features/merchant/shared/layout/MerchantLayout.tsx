import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { BackButton } from '../../../../components/common';
import BottomNavigation from './BottomNavigation';
import VerificationModal from '../../profile/components/VerificationModal';
import { useAuth } from '../../../../contexts/AuthContext';
import { PATHS } from '../../../../routes/paths';
import { verificationService } from '../services/verificationService';

const MerchantLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, isMerchant } = useAuth();
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isMerchant && user) {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/verification')) {
        return;
      }

      void verificationService.getVerificationStatus()
        .then((status) => {
          if (status.status !== 'verified') {
            setShowVerificationModal(true);
          } else {
            setShowVerificationModal(false);
          }
        })
        .catch((error) => {
          console.error('Failed to load merchant verification status:', error);
          setShowVerificationModal(true);
        });
    }
  }, [isAuthenticated, isMerchant, user]);

  const handleCloseVerificationModal = () => {
    setShowVerificationModal(false);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    console.log('🔄 MerchantLayout: Loading authentication...');
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If still not authenticated after trying to create demo user, redirect to login
  if (!isAuthenticated) {
    console.log('❌ MerchantLayout: Not authenticated, redirecting to login');
    return <Navigate to={PATHS.MERCHANT.LOGIN} replace />;
  }

  // Redirect to merchant login if authenticated but not a merchant
  if (isAuthenticated && !isMerchant) {
    console.log('❌ MerchantLayout: User is not a merchant, redirecting to login');
    return <Navigate to={PATHS.MERCHANT.LOGIN} replace />;
  }

  console.log('✅ MerchantLayout: Rendering dashboard for merchant:', {
    user: user?.name,
    isAuthenticated,
    isMerchant,
    showVerificationModal
  });

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50 flex flex-col relative">
      {/* Floating Elements */}
      <BackButton />

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <div className="shrink-0 z-40">
        <BottomNavigation />
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={handleCloseVerificationModal}
      />
    </div>
  );
};

export default MerchantLayout;

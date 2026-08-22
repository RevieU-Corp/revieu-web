import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import { MerchantSidebar } from './MerchantSidebar';
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

  if (isLoading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.MERCHANT.LOGIN} replace />;
  }

  if (!isMerchant) {
    return <Navigate to={PATHS.MERCHANT.LOGIN} replace />;
  }

  return (
    <div className="min-h-dvh bg-slate-100 lg:flex">
      <MerchantSidebar />

      <div className="min-w-0 flex-1">
        <main className="min-h-dvh overflow-y-auto pb-20 lg:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>

        <div className="lg:hidden">
          <BottomNavigation />
        </div>
      </div>

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={handleCloseVerificationModal}
      />
    </div>
  );
};

export default MerchantLayout;

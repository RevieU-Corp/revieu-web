import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import VerificationModal from '../components/VerificationModal';
import { PATHS } from '../../../../routes/paths';
import { useAuth } from '../../../../contexts/AuthContext';

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, isMerchant } = useAuth();
  const [showModal, setShowModal] = useState(true);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(PATHS.MERCHANT.LOGIN);
  };

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isMerchant)) {
      setShowModal(false);
    }
  }, [isAuthenticated, isLoading, isMerchant]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading verification...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isMerchant) {
    return <Navigate to={PATHS.MERCHANT.LOGIN} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <VerificationModal
        isOpen={showModal}
        onClose={handleCloseModal}
      />
      
      {/* Background content when modal is closed */}
      {!showModal && (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Verification</h1>
          <p className="text-gray-600 mb-6">Complete your business verification to get started.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Verification
          </button>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;

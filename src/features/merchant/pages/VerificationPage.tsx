import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerificationModal from '../components/VerificationModal';
import { PATHS } from '../../../routes/paths';
import { useAuth } from '../../../contexts/AuthContext';

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // Create a new merchant user for verification if none exists
    const userData = localStorage.getItem('user');
    if (!userData) {
      const newMerchantUser = {
        id: 'new_merchant_' + Date.now(),
        email: 'newmerchant@demo.com',
        name: 'New Merchant',
        avatar: 'NM',
        role: 'merchant' as const,
        merchantProfile: {
          businessId: 'new_biz_' + Date.now(),
          verificationStatus: 'pending' as const,
          subscriptionTier: 'basic' as const,
          joinDate: new Date()
        }
      };
      
      localStorage.setItem('authToken', 'new-merchant-token');
      localStorage.setItem('user', JSON.stringify(newMerchantUser));
      
      // Update auth context
      setUser(newMerchantUser);
    }
  }, [setUser]);

  const handleCloseModal = () => {
    setShowModal(false);
    // Navigate back to merchant login if they close the modal
    navigate(PATHS.MERCHANT.LOGIN);
  };

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
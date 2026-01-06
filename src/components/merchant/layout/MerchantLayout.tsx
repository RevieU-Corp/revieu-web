import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import BottomNavigation from './BottomNavigation';
import VerificationModal from '../components/VerificationModal';
import RedemptionButton from '../components/RedemptionButton';

const MerchantLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    // Check if we're on the dashboard route and verification hasn't been completed
    const isOnDashboard = location.pathname === '/merchant/dashboard';
    
    // Get current user info to make verification user-specific
    const userData = localStorage.getItem('user');
    let userId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.id;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Create user-specific verification key
    const verificationKey = userId ? `merchantVerificationCompleted_${userId}` : 'merchantVerificationCompleted';
    const verificationCompleted = localStorage.getItem(verificationKey) === 'true';
    
    if (isOnDashboard && !verificationCompleted && userId) {
      // Small delay to ensure the page has loaded
      const timer = setTimeout(() => {
        setShowVerificationModal(true);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setShowVerificationModal(false);
    }
  }, [location.pathname]);

  const handleBackToEntry = () => {
    navigate('/');
  };

  const handleCloseVerificationModal = () => {
    setShowVerificationModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header with back button and redemption */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToEntry}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Entry</span>
          </button>
          
          <RedemptionButton />
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Fixed bottom navigation */}
      <BottomNavigation />

      {/* Verification Modal */}
      <VerificationModal 
        isOpen={showVerificationModal} 
        onClose={handleCloseVerificationModal}
      />
    </div>
  );
};

export default MerchantLayout;
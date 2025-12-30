import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BottomNavigation from './BottomNavigation';

interface MerchantLayoutProps {
  children: React.ReactNode;
}

const MerchantLayout: React.FC<MerchantLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleBackToEntry = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header with back button */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={handleBackToEntry}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Entry</span>
        </button>
      </header>

      {/* Main content area */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Fixed bottom navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MerchantLayout;
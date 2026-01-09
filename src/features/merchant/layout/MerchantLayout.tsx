import { Outlet } from 'react-router-dom';
import { BackButton } from '../../../components/common';
import BottomNavigation from './BottomNavigation';
import RedemptionButton from '../components/RedemptionButton';

const MerchantLayout: React.FC = () => {

  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50 flex flex-col relative">
      {/* Floating Elements */}
      <BackButton />

      {/* Redemption button typically stays at top-right if floating */}
      <div className="fixed top-4 right-4 z-[60]">
        <RedemptionButton />
      </div>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <div className="shrink-0 z-40">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default MerchantLayout;
import { useLocation, Outlet } from 'react-router-dom';
import { BottomNav, FAB } from './index';
import { BackButton } from '../../../components/common';
import { PATHS } from '../../../routes/paths';

const CustomerLayout: React.FC = () => {
  const location = useLocation();

  // Main tabs where bottom navigation and FAB should be visible
  const mainTabPaths = [
    PATHS.CUSTOMER.ROOT,
    PATHS.CUSTOMER.HOME,
    PATHS.CUSTOMER.DISCOVER,
    PATHS.CUSTOMER.PROFILE,
  ];

  const isMainTab = mainTabPaths.includes(location.pathname);

  return (
    <div className="h-screen w-full overflow-hidden bg-white flex flex-col relative">
      {/* Floating Back Button */}
      <BackButton />

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <Outlet />
      </main>

      {/* Navigation bar - Stay outside scroll */}
      {isMainTab && (
        <div className="shrink-0 z-40">
          <FAB />
          <BottomNav />
        </div>
      )}
    </div>
  );
};

export default CustomerLayout;
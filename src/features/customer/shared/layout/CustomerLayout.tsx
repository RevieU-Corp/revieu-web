import { matchPath, Outlet, useLocation } from 'react-router-dom';
import { BackButton } from '../../../../components/common';
import { BottomNav } from './index';
import { CustomerSidebar } from './CustomerSidebar';
import { customerNavigation } from './navigation';

const CustomerLayout = () => {
  const location = useLocation();
  const isPrimaryPage = customerNavigation.some(({ path, end }) =>
    matchPath({ path, end: end ?? false }, location.pathname),
  );
  const hideGlobalBackButton = /^\/customer\/merchant\/[^/]+(?:\/coupon)?$/.test(location.pathname);

  return (
    <div className="min-h-dvh bg-slate-100 lg:flex">
      <CustomerSidebar />

      <div className="min-w-0 flex-1 bg-white">
        {!isPrimaryPage && !hideGlobalBackButton && <BackButton />}

        <main className="min-h-dvh overflow-y-auto pb-20 lg:pb-0">
          <Outlet />
        </main>

        {isPrimaryPage && (
          <div className="lg:hidden">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerLayout;

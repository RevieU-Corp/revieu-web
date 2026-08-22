import { Plus } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../contexts/AuthContext';
import { PATHS } from '../../../../../routes/paths';
import { customerNavigation } from '../navigation';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handlePostClick = () => {
    if (isAuthenticated) {
      navigate(PATHS.CUSTOMER.WRITE_REVIEW_SELECT);
    } else {
      setShowLoginModal(true);
    }
  };

  const renderNavTab = (item: (typeof customerNavigation)[number]) => {
    const active = Boolean(matchPath({ path: item.path, end: item.end ?? false }, location.pathname));
    const Icon = item.icon;

    return (
      <button
        key={item.path}
        type="button"
        onClick={() => navigate(item.path)}
        className={`flex min-w-0 flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${
          active ? 'text-brand-600' : 'text-slate-500'
        }`}
        aria-current={active ? 'page' : undefined}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
        <span className="truncate">{item.label}</span>
      </button>
    );
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-safe-area-inset-bottom backdrop-blur lg:hidden">
      <div className="relative mx-auto grid h-20 w-full max-w-2xl grid-cols-5 items-end px-4 pb-3 sm:px-8">
        {customerNavigation.slice(0, 2).map(renderNavTab)}
        <div aria-hidden="true" />
        {customerNavigation.slice(2).map(renderNavTab)}

        <button
          type="button"
          onClick={handlePostClick}
          className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition-transform hover:bg-brand-700 active:scale-95"
          aria-label="Add review"
        >
          <Plus className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>

      {showLoginModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-600">
                <Plus className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">Login Required</h3>
              <p className="mb-6 text-slate-500">Please login to share your review with the community.</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate(PATHS.AUTH.LOGIN);
                  }}
                  className="flex-1 rounded-xl bg-brand-600 px-4 py-3 font-medium text-white hover:bg-brand-700"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

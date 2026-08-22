import { NavLink, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { PATHS } from '../../../../routes/paths';
import { customerNavigation } from './navigation';

export function CustomerSidebar() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleReviewClick = () => {
    navigate(isAuthenticated ? PATHS.CUSTOMER.WRITE_REVIEW_SELECT : PATHS.AUTH.LOGIN);
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-20 items-center border-b border-slate-100 px-6">
        <span className="text-xl font-black tracking-tight text-brand-600">RevieU</span>
      </div>

      <nav aria-label="Customer navigation" className="flex-1 space-y-1 p-4">
        {customerNavigation.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={handleReviewClick}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          Add review
        </button>
      </nav>

      <div className="border-t border-slate-100 p-4 text-xs text-slate-500">
        Discover places. Share experiences.
      </div>
    </aside>
  );
}

import { BarChart3, Bell, FilePlus2, LayoutDashboard, MessageSquare, Settings, Store, Tags } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';

const navigation = [
  { label: 'Dashboard', path: PATHS.MERCHANT.DASHBOARD, icon: LayoutDashboard },
  { label: 'Analytics', path: PATHS.MERCHANT.ANALYTICS, icon: BarChart3 },
  { label: 'Create post', path: PATHS.MERCHANT.CREATE_POST, icon: FilePlus2 },
  { label: 'Ads', path: PATHS.MERCHANT.ADS, icon: Tags },
  { label: 'Messages', path: PATHS.MERCHANT.MESSAGES, icon: MessageSquare },
  { label: 'Notifications', path: PATHS.MERCHANT.NOTIFICATIONS, icon: Bell },
  { label: 'Store profile', path: PATHS.MERCHANT.PROFILE, icon: Store },
];

export function MerchantSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-20 items-center border-b border-slate-100 px-6">
        <span className="text-xl font-black tracking-tight text-brand-600">RevieU Merchant</span>
      </div>

      <nav aria-label="Merchant navigation" className="flex-1 space-y-1 p-4">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === PATHS.MERCHANT.DASHBOARD}
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
      </nav>

      <NavLink
        to={PATHS.MERCHANT.PROFILE}
        className="m-4 flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
        Settings
      </NavLink>
    </aside>
  );
}

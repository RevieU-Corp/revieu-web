import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';
import {
  Home,
  Megaphone,
  Store,
  MessageCircle,
  Bell,
  LucideIcon
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: PATHS.MERCHANT.DASHBOARD
  },
  {
    id: 'ads',
    label: 'Ad Manager',
    icon: Megaphone,
    path: PATHS.MERCHANT.ADS
  },
  {
    id: 'profile',
    label: 'Store Profile',
    icon: Store,
    path: PATHS.MERCHANT.PROFILE
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageCircle,
    path: PATHS.MERCHANT.MESSAGES,
    badge: 3 // Mock unread count
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    path: PATHS.MERCHANT.NOTIFICATIONS,
    badge: 5 // Mock unread count
  }
];

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative ${isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="relative">
                <Icon size={20} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
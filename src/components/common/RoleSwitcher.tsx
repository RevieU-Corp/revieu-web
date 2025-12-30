import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Store } from 'lucide-react';

const RoleSwitcher: React.FC = () => {
  const { user, setUser } = useAuth();

  const switchToMerchant = () => {
    if (user) {
      const merchantUser = {
        ...user,
        role: 'merchant' as const,
        name: 'Business Owner',
        avatar: 'BO',
        merchantProfile: {
          businessId: 'biz_123',
          verificationStatus: 'verified' as const,
          subscriptionTier: 'basic' as const,
          joinDate: new Date()
        }
      };
      setUser(merchantUser);
      localStorage.setItem('user', JSON.stringify(merchantUser));
    }
  };

  const switchToCustomer = () => {
    if (user) {
      const customerUser = {
        ...user,
        role: 'user' as const,
        name: 'Tommy Trojan',
        avatar: 'TJ',
        merchantProfile: undefined
      };
      setUser(customerUser);
      localStorage.setItem('user', JSON.stringify(customerUser));
    }
  };

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-3">
      <div className="text-xs text-gray-500 mb-2">Demo Role Switcher</div>
      <div className="flex gap-2">
        <button
          onClick={switchToCustomer}
          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            user.role === 'user'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <User size={16} />
          Customer
        </button>
        <button
          onClick={switchToMerchant}
          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            user.role === 'merchant'
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Store size={16} />
          Merchant
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        Current: {user.role === 'merchant' ? 'Merchant' : 'Customer'}
      </div>
    </div>
  );
};

export default RoleSwitcher;
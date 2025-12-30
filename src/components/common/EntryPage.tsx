import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Store } from 'lucide-react';

const EntryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    navigate('/customer');
  };

  const handleMerchantClick = () => {
    navigate('/merchant/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Revieu</h1>
          <p className="text-gray-600">Choose your experience</p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          {/* Customer Button */}
          <button
            onClick={handleCustomerClick}
            className="w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-blue-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">I am a Customer</h2>
                <p className="text-gray-600 text-sm">Discover and review local businesses</p>
              </div>
              <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </div>
          </button>

          {/* Merchant Button */}
          <button
            onClick={handleMerchantClick}
            className="w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-green-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-200 transition-colors">
                <Store className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">I am a Merchant</h2>
                <p className="text-gray-600 text-sm">Manage your business and connect with customers</p>
              </div>
              <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Student-focused review platform for local businesses
          </p>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
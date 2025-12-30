import React from 'react';
import MerchantLayout from '../layout/MerchantLayout';

const Notifications: React.FC = () => {
  return (
    <MerchantLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
        
        {/* Placeholder content */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">System Notifications</h2>
            <p className="text-gray-600">Profile verification, campaign updates</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Operations</h2>
            <p className="text-gray-600">Event registrations and platform updates</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Transactions & Interactions</h2>
            <p className="text-gray-600">New reviews, views, and customer activity</p>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default Notifications;
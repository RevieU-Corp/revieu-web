import React from 'react';
import MerchantLayout from '../layout/MerchantLayout';

const AdManager: React.FC = () => {
  return (
    <MerchantLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Ad Manager</h1>
        
        {/* Placeholder content */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Campaign Goals</h2>
            <p className="text-gray-600">Choose between Exposure and Conversion campaigns</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Ad Creative</h2>
            <p className="text-gray-600">Create headlines and preview your ads</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Budget & Payment</h2>
            <p className="text-gray-600">Set duration and budget for your campaigns</p>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default AdManager;
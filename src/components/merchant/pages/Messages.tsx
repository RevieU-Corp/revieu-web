import React from 'react';
import MerchantLayout from '../layout/MerchantLayout';

const Messages: React.FC = () => {
  return (
    <MerchantLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
        
        {/* Placeholder content */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Customer Conversations</h2>
            <p className="text-gray-600">List of all customer chats and inquiries</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Chat Interface</h2>
            <p className="text-gray-600">Real-time messaging with customers</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Quick Replies</h2>
            <p className="text-gray-600">Pre-set messages for common inquiries</p>
          </div>
        </div>
      </div>
    </MerchantLayout>
  );
};

export default Messages;
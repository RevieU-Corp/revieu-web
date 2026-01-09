import React from 'react';
import { Camera, ChevronRight } from 'lucide-react';
import { userData } from '../constants/index';

const ProfileSettingsPage: React.FC = () => {
    const settingsItems = [
        { label: 'Nickname', value: userData.name, type: 'text' },
        { label: 'Gender', value: 'Male', type: 'select' },
        { label: 'Birthday', value: '1995-03-12', type: 'date' },
        { label: 'Location', value: 'Los Angeles, CA', type: 'text' },
        { label: 'Bio', value: 'Tech enthusiast & food lover.', type: 'textarea' },
    ];

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-4 py-4 border-b border-gray-100 flex items-center justify-center">
                <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center py-8 bg-gray-50/30">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full p-1 bg-white shadow-xl ring-4 ring-gray-50">
                        <img
                            src={userData.avatar}
                            alt={userData.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg ring-2 ring-white hover:bg-blue-700 transition-all scale-90 group-hover:scale-100">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <p className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                    Change Profile Photo
                </p>
            </div>

            {/* Info List */}
            <div className="mt-4 px-4">
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    {settingsItems.map((item, idx) => (
                        <button
                            key={idx}
                            className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${idx !== 0 ? 'border-t border-gray-50' : ''
                                }`}
                        >
                            <span className="text-sm font-medium text-gray-500">{item.label}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Account Info */}
            <div className="mt-8 px-4">
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Linked Accounts
                </h3>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between p-4 border-b border-gray-50">
                        <span className="text-sm font-medium text-gray-500">Phone</span>
                        <span className="text-sm font-semibold text-gray-900">+1 (555) 000-1234</span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <span className="text-sm font-medium text-gray-500">Email</span>
                        <span className="text-sm font-semibold text-gray-900">{userData.name.toLowerCase()}@example.com</span>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="fixed bottom-6 left-0 right-0 z-10 px-4">
                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 active:scale-[0.98] transition-all">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ProfileSettingsPage;

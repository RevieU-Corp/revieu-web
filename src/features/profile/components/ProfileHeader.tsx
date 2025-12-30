import React from 'react';
import { Settings, MapPin, LogOut } from 'lucide-react';
import { UserData } from '../types';

interface ProfileHeaderProps {
  userData: UserData;
  onLogout: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData, onLogout }) => {
  return (
    <div className="bg-white pb-4 border-b border-gray-200">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-3 sticky top-0 bg-white/95 backdrop-blur-md z-30">
        <h1 className="text-lg font-bold text-gray-900">{userData.handle}</h1>
        <div className="flex gap-4">
          <button className="text-gray-600 hover:text-gray-900">
            <Settings className="w-6 h-6" />
          </button>
          <button onClick={onLogout} className="text-gray-600 hover:text-red-600">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 mt-2">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full p-1 bg-white border-2 border-gray-100 shadow-sm">
              <img src={userData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 bg-[#FFC72C] text-[#990000] p-1.5 rounded-full border-2 border-white text-xs font-bold">
              ✌️
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 flex justify-around items-center pt-4 ml-4">
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{userData.stats.reviews}</div>
              <div className="text-xs text-gray-500">Reviews</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{userData.stats.followers}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">{userData.stats.following}</div>
              <div className="text-xs text-gray-500">Following</div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <h2 className="font-bold text-xl text-gray-900">{userData.name}</h2>
          <div className="flex items-center gap-1 text-[#990000] text-sm font-medium">
            <MapPin className="w-3.5 h-3.5" />
            {userData.major}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{userData.bio}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-5">
          <button className="flex-1 bg-gray-100 text-gray-900 font-semibold py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
            Edit Profile
          </button>
          <button className="flex-1 bg-gray-100 text-gray-900 font-semibold py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
            Share Profile
          </button>
        </div>
      </div>
    </div>
  );
};
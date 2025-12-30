import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../../components/layout';
import { useAuth } from '../../../contexts/AuthContext';
import { StudentPost } from '../../home/components';
import { ProfileHeader, ProfileTabs, SavedPlaceCard } from '../components';
import { userData, userPosts, savedPlaces } from '../constants/mockData';
import { ProfileTab } from '../types';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('reviews');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSavedPlaceClick = () => {
    // Navigate to place detail or show development alert
    alert('此功能正在开发中');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
      {/* Profile Header */}
      <ProfileHeader userData={userData} onLogout={handleLogout} />

      {/* Tabs */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Area */}
      <div className="p-4">
        {activeTab === 'reviews' ? (
          <div className="space-y-4">
            {userPosts.map(post => (
              <StudentPost key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {savedPlaces.map(place => (
              <SavedPlaceCard 
                key={place.id} 
                place={place} 
                onClick={handleSavedPlaceClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { StudentPost, ProfileHeader, ProfileTabs, SavedPlaceCard } from '../components';
import { userData, userPosts, savedPlaces } from '../constants/index';
import { ProfileTab } from '../types/index';

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
    <div className="bg-white pb-6 pl-14">
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

    </div>
  );
};

export default ProfilePage;
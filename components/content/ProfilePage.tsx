
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, MapPin, Grid, Bookmark, LogOut } from 'lucide-react';
import { StudentPost } from '../features/Posts';
import { BottomNav } from '../layout/BottomNav';
import { useAuth } from '../../contexts/AuthContext';

// Mock User Data
const userData = {
  name: "Tommy Trojan",
  handle: "@fighton_tommy",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
  major: "Computer Science '25",
  bio: "Always looking for the best boba in LA 🧋 | USC Viterbi",
  stats: {
    reviews: 42,
    followers: 856,
    following: 124
  }
};

// Mock User Posts (Reusing structure for 'Reviews' tab)
const userPosts = [
  {
    id: 101,
    avatar: "✌️",
    username: "Tommy Trojan",
    timestamp: "2d ago",
    text: "Finally tried the new spot at the Village. The pasta was solid but a bit pricey for a student budget. 🍝",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&auto=format&fit=crop&q=60",
    likes: 45,
    comments: 5
  },
  {
    id: 102,
    avatar: "✌️",
    username: "Tommy Trojan",
    timestamp: "1w ago",
    text: "Hidden gem alert! 💎 Found a quiet study cafe with amazing cold brew just 5 mins from campus.",
    image: "https://images.unsplash.com/photo-1461023058943-716030f9b263?w=500&auto=format&fit=crop&q=60",
    likes: 128,
    comments: 12
  }
];

// Mock Saved Places
const savedPlaces = [
  { id: 1, name: "Dulce", category: "Cafe", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60" },
  { id: 2, name: "Marugame Udon", category: "Japanese", image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&auto=format&fit=crop&q=60" },
  { id: 3, name: "Trader Joe's", category: "Grocery", image: "https://images.unsplash.com/photo-1604719312566-b7ce1232a7e9?w=500&auto=format&fit=crop&q=60" },
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'reviews' | 'saved'>('reviews');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
      {/* Header / Cover */}
      <div className="bg-white pb-4 border-b border-gray-200">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-4 py-3 sticky top-0 bg-white/95 backdrop-blur-md z-30">
          <h1 className="text-lg font-bold text-gray-900">{userData.handle}</h1>
          <div className="flex gap-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Settings className="w-6 h-6" />
            </button>
            <button onClick={handleLogout} className="text-gray-600 hover:text-red-600">
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

      {/* Tabs */}
      <div className="sticky top-[52px] bg-white z-20 border-b border-gray-200 mt-2">
        <div className="flex">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="w-4 h-4" />
            My Reviews
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 flex justify-center items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'saved' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <Bookmark className="w-4 h-4" />
            Saved
          </button>
        </div>
      </div>

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
              <div key={place.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
                <div className="h-32 bg-gray-200">
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-sm">{place.name}</h3>
                  <p className="text-xs text-gray-500">{place.category}</p>
                </div>
              </div>
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

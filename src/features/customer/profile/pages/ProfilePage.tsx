import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { PATHS } from '../../../../routes/paths';
import {
  Icons,
  ReviewCard,
  CouponCard,
  OrderCard,
  StatsBar,
  ProfileNavbar,
  SettingItem,
  NavCard
} from '../components';
import { generateCreativeBio } from '../services/profileService';
import { UserProfile, Review, Coupon, Order } from '../types';

// --- MOCK DATA ---
// TODO: Replace with API calls
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    businessName: 'Golden Gate Bakery',
    businessImage: 'https://picsum.photos/id/292/100/100',
    location: 'Chinatown',
    rating: 5,
    date: '2d ago',
    content: 'Best egg tarts in the city, hands down! The line was long but totally worth the wait. Make sure to bring cash as they do not accept cards.',
    images: ['https://picsum.photos/id/493/400/300', 'https://picsum.photos/id/30/400/300'],
    helpfulCount: 24
  },
  {
    id: '2',
    businessName: 'Blue Bottle Coffee',
    businessImage: 'https://picsum.photos/id/1060/100/100',
    location: 'Ferry Building',
    rating: 4,
    date: '1w ago',
    content: 'Great atmosphere and solid espresso. A bit pricey compared to other local spots, but the view of the bay is unbeatable.',
    images: [],
    helpfulCount: 8
  },
  {
    id: '3',
    businessName: 'Arsicault Bakery',
    businessImage: 'https://picsum.photos/id/102/100/100',
    location: 'Inner Richmond',
    rating: 5,
    date: '2w ago',
    content: 'The croissants here are life-changing. Flaky, buttery perfection.',
    images: ['https://picsum.photos/id/430/400/300'],
    helpfulCount: 156
  },
  {
    id: '4',
    businessName: 'Mister Jiu\'s',
    businessImage: 'https://picsum.photos/id/338/100/100',
    location: 'Chinatown',
    rating: 5,
    date: '3w ago',
    content: 'An absolute gem. The roast duck is a must-order. The cocktail program is also top-tier.',
    images: [],
    helpfulCount: 42
  }
];

const MOCK_COUPONS: Coupon[] = [
  {
    id: 'c1',
    businessName: 'Urban Ritual',
    offerTitle: 'Buy 1 Get 1 Free',
    expiryDate: 'Expires in 3 days',
    code: 'BOGO-URBAN',
    status: 'active',
    logo: 'https://picsum.photos/id/63/100/100',
    color: '#990000'
  },
  {
    id: 'c2',
    businessName: 'Booksmith',
    offerTitle: '15% Off Any Hardcover',
    expiryDate: 'Oct 30',
    code: 'READMORE15',
    status: 'active',
    logo: 'https://picsum.photos/id/24/100/100',
    color: '#1A1A1A'
  },
  {
    id: 'c3',
    businessName: 'Tony\'s Pizza',
    offerTitle: '$5 Off Large Pizza',
    expiryDate: 'Expired',
    code: 'PIZZA5',
    status: 'expired',
    logo: 'https://picsum.photos/id/338/100/100',
    color: '#D4A000'
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    businessName: 'Sushirrito',
    businessImage: 'https://picsum.photos/id/292/100/100',
    date: 'Yesterday',
    items: ['Sumo Crunch', 'Lava Nachos'],
    total: '$18.50',
    status: 'completed'
  },
  {
    id: 'o2',
    businessName: 'Philz Coffee',
    businessImage: 'https://picsum.photos/id/431/100/100',
    date: 'Oct 24',
    items: ['Mint Mojito', 'Avocado Toast'],
    total: '$12.00',
    status: 'completed'
  }
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'profile' | 'reviews'>('profile');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  // Create UserProfile from AuthContext user data
  const [user, setUser] = useState<UserProfile>({
    name: authUser?.name || 'User',
    handle: `@${authUser?.email?.split('@')[0] || 'user'}`,
    location: 'Los Angeles, CA', // TODO: Get from user profile API
    level: 5, // TODO: Get from API
    points: 8450, // TODO: Get from API
    nextLevelPoints: 10000, // TODO: Get from API
    joinDate: '2024', // TODO: Get from user creation date
    bio: `Exploring the city one bite at a time! 🍜🎟️`,
    avatar: authUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (authUser?.name || 'default'),
    coverImage: 'https://picsum.photos/id/431/1000/600',
    stats: {
      totalReviews: 142, // TODO: Get from API
      photosUploaded: 856, // TODO: Get from API
      helpfulVotes: 4205, // TODO: Get from API
      views: '2.4M' // TODO: Get from API
    }
  });

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    const newBio = await generateCreativeBio(user, ['Coffee', 'Photography', 'Asian Fusion', 'Urban Hiking']);
    setUser(prev => ({ ...prev, bio: newBio }));
    setIsGeneratingBio(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const activeCoupons = MOCK_COUPONS.filter(c => c.status === 'active');

  // --- REVIEWS PAGE VIEW ---
  if (currentView === 'reviews') {
    return (
      <div className="min-h-screen bg-[#F2F2F7] font-sans text-gray-900">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[80px] mix-blend-multiply opacity-40"></div>
        </div>

        <ProfileNavbar />

        <div className="max-w-[800px] mx-auto min-h-screen flex flex-col relative z-10 animate-fade-in-right">
          {/* Header */}
          <div className="sticky top-14 z-20 bg-[#F2F2F7]/90 backdrop-blur-xl p-4 md:px-6 md:py-6 flex items-center gap-4">
            <button
              onClick={() => setCurrentView('profile')}
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-brand-red hover:shadow-md transition-all active:scale-95"
            >
              <Icons.ChevronRight className="rotate-180" size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-xs text-gray-500 font-medium">{user.stats.totalReviews} total contributions</p>
            </div>
          </div>

          {/* List */}
          <div className="px-4 md:px-6 pb-20 space-y-4">
            {MOCK_REVIEWS.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- PROFILE VIEW ---
  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans text-gray-900 relative selection:bg-brand-red/20 selection:text-brand-red">

      {/* 1. Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[100px] mix-blend-multiply opacity-60 animate-pulse-slow"></div>
        <div className="absolute top-[10%] -right-[10%] w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[80px] mix-blend-multiply opacity-60"></div>
      </div>

      <ProfileNavbar />

      <main className="w-full max-w-[1400px] mx-auto md:px-6 md:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 items-start">

          {/* --- Left Column: Profile --- */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24">

            <div className="bg-white/80 backdrop-blur-md pb-6 rounded-b-[32px] md:rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-white/50 overflow-hidden relative transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              {/* Cover */}
              <div className="h-44 md:h-60 w-full relative group">
                <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>

                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-gray-900 transition-all shadow-lg">
                    <Icons.Share size={18} />
                  </button>
                </div>
              </div>

              {/* Avatar & Identity */}
              <div className="px-6">
                <div className="flex justify-between items-end -mt-14 mb-5">
                  <div className="relative group cursor-pointer">
                    <div className="w-[104px] h-[104px] rounded-full p-1 bg-white shadow-xl">
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover bg-gray-100 border border-gray-100"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <div className="bg-black/50 p-2 rounded-full text-white backdrop-blur-sm">
                        <Icons.Camera size={20} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(PATHS.CUSTOMER.ME.PROFILE)}
                    className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-[13px] font-bold shadow-lg shadow-gray-200 active:scale-95 transition-all hover:bg-black hover:shadow-xl"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="mb-6">
                  <h1 className="text-[28px] font-bold text-gray-900 leading-tight tracking-tight mb-1">{user.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                      <Icons.MapPin size={12} className="text-brand-red" /> {user.location}
                    </span>
                    <span>•</span>
                    <span className="text-brand-red font-semibold">Level {user.level} Guide</span>
                  </div>
                </div>

                {/* Bio */}
                <div className="relative group mb-8">
                  <p className="text-gray-600 text-[15px] leading-relaxed">
                    {user.bio}
                  </p>
                  <button
                    onClick={handleGenerateBio}
                    disabled={isGeneratingBio}
                    className="absolute -right-2 -top-2 p-2 text-brand-red/60 hover:text-brand-red bg-transparent hover:bg-brand-red/5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="AI Enhance"
                  >
                    <Icons.Sparkles size={16} className={isGeneratingBio ? "animate-spin" : ""} />
                  </button>
                </div>

                <StatsBar stats={user.stats} />

                {/* Desktop Settings Menu */}
                <div className="hidden lg:block mt-8">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Preferences</h3>
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div onClick={() => navigate(PATHS.CUSTOMER.ME.NOTIFICATIONS)}>
                      <SettingItem icon={<Icons.Bell />} label="Notifications" badge="2" />
                    </div>
                    <div onClick={() => navigate(PATHS.CUSTOMER.ME.PRIVACY)}>
                      <SettingItem icon={<Icons.Shield />} label="Privacy & Security" />
                    </div>
                    <div className="h-[1px] bg-gray-100 mx-5 my-1"></div>
                    <div onClick={handleLogout}>
                      <SettingItem icon={<Icons.LogOut />} label="Sign Out" isDestructive />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Content Feed --- */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-10 px-4 md:px-0 py-6 md:py-0 pb-20">

            {/* 1. Share & Orders Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Activity</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Featured Card */}
                <div className="rounded-[24px] p-7 text-white shadow-[0_12px_30px_-8px_rgba(153,0,0,0.3)] relative overflow-hidden flex flex-col justify-between min-h-[180px] group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(153,0,0,0.4)]">
                  <div className="absolute inset-0 bg-[#990000]"></div>
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FFCC00] rounded-full blur-[80px] opacity-40 -translate-y-1/2 translate-x-1/3"></div>
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-900 rounded-full blur-[60px] opacity-30 translate-y-1/2 -translate-x-1/3"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-white/20 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide">Featured Mission</span>
                    </div>
                    <h3 className="font-bold text-2xl mb-2 leading-tight">Share your vibe</h3>
                    <p className="text-white/80 text-sm mb-6 max-w-[85%] font-medium">Rate {MOCK_ORDERS[0].businessName} to unlock the "Taste Maker" badge.</p>
                    <button className="bg-white text-brand-red px-6 py-2.5 rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm active:scale-95 transform">Write Review</button>
                  </div>
                  <Icons.MessageSquare className="absolute -bottom-6 -right-6 text-white/10 w-40 h-40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700" />
                </div>
                {/* Latest Order */}
                <OrderCard order={MOCK_ORDERS[0]} />
              </div>
            </section>

            {/* 2. Wallet Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-gray-900 to-black text-white p-2 rounded-xl shadow-md">
                    <Icons.Wallet size={18} className="fill-current" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">My Rewards</h2>
                </div>
                <span className="text-xs font-bold text-brand-red bg-brand-red/5 px-3 py-1.5 rounded-full border border-brand-red/10">{activeCoupons.length} Available</span>
              </div>

              <div className="flex overflow-x-auto gap-5 pb-6 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-2 xl:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
                {activeCoupons.map((coupon) => (
                  <div key={coupon.id} className="min-w-[85%] sm:min-w-[320px] md:min-w-0 snap-center h-full">
                    <CouponCard coupon={coupon} className="h-full" />
                  </div>
                ))}
                <div className="min-w-[120px] snap-center flex flex-col items-center justify-center bg-white rounded-[24px] border-2 border-dashed border-gray-200 text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-all cursor-pointer md:h-full min-h-[200px] hover:bg-brand-bg/50 group">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-brand-gold/10 group-hover:scale-110 transition-transform">
                    <Icons.ChevronRight size={24} />
                  </div>
                  <span className="text-xs font-bold tracking-wide">VIEW ALL</span>
                </div>
              </div>
            </section>

            {/* 3. My Content Grid */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-5">Contributions</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                {/* REVIEWS BOX */}
                <NavCard
                  icon={<Icons.Review />}
                  title="My Reviews"
                  subtitle={`${user.stats.totalReviews} posted • 80k views`}
                  onClick={() => setCurrentView('reviews')}
                />

                {/* PHOTOS BOX */}
                <NavCard
                  icon={<Icons.Camera />}
                  title="Photos"
                  subtitle={`${user.stats.photosUploaded} uploaded • 2.1M views`}
                  colorClass="text-brand-darkGold"
                  onClick={() => {}} // TODO: Implement photos view
                />
              </div>
            </section>

            {/* Mobile Settings */}
            <section className="lg:hidden mt-8 mb-12">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Account</h3>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div onClick={() => navigate(PATHS.CUSTOMER.ME.NOTIFICATIONS)}>
                  <SettingItem icon={<Icons.Bell />} label="Notifications" badge="2" />
                </div>
                <div onClick={() => navigate(PATHS.CUSTOMER.ME.PRIVACY)}>
                  <SettingItem icon={<Icons.Shield />} label="Security" />
                </div>
                <div onClick={handleLogout}>
                  <SettingItem icon={<Icons.LogOut />} label="Log Out" isDestructive />
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

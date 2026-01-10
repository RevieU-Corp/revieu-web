import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  MeHeader,
  MeOptionItem
} from '../components';
import {
  HelpCircle,
  LogOut,
  Star,
  Users,
  Settings,
  X,
  Share2
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showQr, setShowQr] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handleNavigate = (label: string) => {
    console.log(`Navigating to ${label}`);
    const navMap: Record<string, string> = {
      'Edit Profile': PATHS.CUSTOMER.ME.PROFILE,
      'Settings': PATHS.CUSTOMER.ME.SETTINGS,
      'My Reviews': PATHS.CUSTOMER.ME.REVIEWS,
      'Community': PATHS.CUSTOMER.ME.COMMUNITY,
      'Profile Settings': PATHS.CUSTOMER.ME.PROFILE,
      'Payment Methods': PATHS.CUSTOMER.ME.PAYMENTS,
      'Privacy': PATHS.CUSTOMER.ME.PRIVACY,
      'Notifications': PATHS.CUSTOMER.ME.NOTIFICATIONS,
      'Help': PATHS.CUSTOMER.ME.HELP,
    };

    const targetPath = navMap[label];
    if (targetPath) {
      navigate(targetPath);
    }
  };

  const handleVoucherNavigate = () => {
    navigate(PATHS.CUSTOMER.VOUCHERS);
  };

  const LotteryTicketPreview = ({ color, merchant, deal }: { color: string, merchant: string, deal: string }) => {
    return (
      <div className={`flex-shrink-0 w-56 h-24 ${color} rounded-[20px] p-0 flex relative overflow-hidden shadow-lg shadow-gray-200/50`}>
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full z-10" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full z-10" />
        <div className="flex-1 flex flex-col justify-center pl-6 pr-2 border-r border-dashed border-white/30 relative">
          <span className="text-[9px] font-black uppercase opacity-70 tracking-widest text-left text-white/90">{merchant}</span>
          <span className="text-xl font-black italic text-left text-white drop-shadow-md">{deal}</span>
        </div>
        <div className="w-12 h-full flex items-center justify-center bg-black/5">
          <div className="w-1 h-8 bg-white/20 rounded-full" />
        </div>
      </div>
    );
  };

  const meUser = {
    name: 'Wayne Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wayne',
    handle: 'wayne_dev',
    bio: 'Finding the best deals & reviews near USC! 🍜🎟️',
  };

  return (
    <div className="bg-[#FBFCFD] min-h-screen pb-32">
      {/* 1. Profile Context Area (Back & Settings removed to MeHeader) */}
      <div className="h-10" />

      {/* 2. Consolidated User Hub (Stats & Shortcuts Integrated) */}
      <MeHeader
        user={meUser}
        onEdit={() => handleNavigate('Edit Profile')}
        onSettings={() => handleNavigate('Settings')}
        onQr={() => setShowQr(true)}
      />

      {/* 3. My Review Hub */}
      <div className="px-4 mb-8">
        <button
          onClick={() => handleNavigate('My Reviews')}
          className="w-full bg-white rounded-[40px] p-6 shadow-xl shadow-gray-200/40 border border-gray-100/50 flex items-center justify-between relative overflow-hidden group active:scale-[0.98] transition-all text-left"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-yellow-400/10 transition-colors" />
          <div className="relative z-10">
            <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">My Review</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Manage your feedback & points</p>
          </div>

          {/* Advanced 3D Liquid Glass Icon Container */}
          <div className="relative z-10 w-14 h-14 transition-transform duration-500 group-hover:scale-110">
            {/* Glass Shell */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[22px] shadow-xl overflow-hidden">
              {/* Liquid inside */}
              <div className="absolute bottom-[-20%] inset-x-[-10%] h-[70%] bg-gradient-to-t from-[#990000] to-[#b80000] rounded-[100%] blur-[2px] opacity-80" />
              {/* Surface reflection */}
              <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-gradient-to-br from-white/40 to-transparent rounded-full blur-md" />
              {/* Top highlight */}
              <div className="absolute top-1 left-2 right-2 h-2 bg-white/30 rounded-full blur-[1px]" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-700 group-hover:rotate-[360deg]" />
            </div>
          </div>
        </button>
      </div>

      {/* 4. Voucher Preview Hub (Entry Point) */}
      <div className="px-4 mb-8">
        <button
          onClick={handleVoucherNavigate}
          className="w-full bg-white rounded-[40px] p-5 shadow-xl shadow-gray-200/40 border border-gray-100/50 overflow-hidden text-left active:scale-[0.98] transition-all group"
        >
          <div className="flex items-center justify-between px-3 mb-5">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.15em]">My Vouchers</h3>
            <span className="text-[10px] font-black text-[#990000] bg-red-50 px-3 py-1 rounded-full group-hover:bg-[#990000] group-hover:text-white transition-colors">12 ACTIVE</span>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1 pointer-events-none">
            <LotteryTicketPreview
              color="bg-gradient-to-br from-[#FF4D4D] to-[#FF8C42]"
              merchant="Noda Ramen"
              deal="80% OFF"
            />
            <LotteryTicketPreview
              color="bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70]"
              merchant="Cafe Dulce"
              deal="BOGO FREE"
            />
          </div>
        </button>
      </div>

      {/* 6. Settings & Info - Clean Groups */}
      <div className="space-y-6 px-4">
        <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
          <MeOptionItem
            icon={<Users className="w-5 h-5 text-orange-500" />}
            label="Community Ranking"
            onClick={() => handleNavigate('Community')}
          />
          <MeOptionItem
            icon={<Settings className="w-5 h-5 text-gray-500" />}
            label="Account Settings"
            onClick={() => handleNavigate('Profile Settings')}
            className="border-t border-gray-50"
          />
          <MeOptionItem
            icon={<HelpCircle className="w-5 h-5 text-emerald-500" />}
            label="Support Center"
            onClick={() => handleNavigate('Help')}
            className="border-t border-gray-50"
          />
          <MeOptionItem
            icon={<LogOut className="w-5 h-5 text-red-500" />}
            label="Sign Out"
            onClick={handleLogout}
            className="border-t border-gray-50"
          />
        </div>
      </div>

      {/* Version Tag */}
      <div className="mt-12 mb-8 text-center text-gray-300 text-[10px] font-black tracking-[0.3em] uppercase">
        RevieU • NEXT GEN 2026
      </div>

      {/* QR Code Modal Overlay */}
      {showQr && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setShowQr(false)}
        >
          <div
            className="bg-white rounded-[50px] w-full max-w-sm overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close */}
            <div className="p-6 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">My Share Code</h3>
              <button
                onClick={() => setShowQr(false)}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* QR Content */}
            <div className="p-10 flex flex-col items-center">
              <div className="relative p-4 bg-white border-4 border-gray-50 rounded-[40px] shadow-inner mb-6 group">
                {/* Simulated QR Code (Geometric Pattern) */}
                <div className="w-48 h-48 bg-gray-900 p-2 rounded-2xl flex flex-wrap gap-1 relative overflow-hidden">
                  {/* Decorative blocks inside QR */}
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-sm ${i % 3 === 0 ? 'bg-white' : 'bg-transparent'}`} />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-500/20" />

                  {/* Center Face */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-xl">
                      <img
                        src={meUser.avatar}
                        className="w-full h-full rounded-xl object-cover"
                        alt="Avatar"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-base font-black text-gray-900 mb-1">{meUser.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">Scan to follow me on RevieU</p>

                <button className="flex items-center gap-3 bg-[#990000] text-white px-8 py-4 rounded-full font-black text-sm shadow-xl shadow-red-200 hover:scale-105 active:scale-95 transition-all">
                  <Share2 className="w-5 h-5" />
                  SHARE PROFILE
                </button>
              </div>
            </div>

            <div className="h-4 bg-gradient-to-r from-[#990000] via-[#E5B80B] to-[#990000] opacity-20" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
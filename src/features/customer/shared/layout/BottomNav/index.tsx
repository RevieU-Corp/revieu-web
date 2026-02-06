import { Home, Search, Compass, User, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { PATHS } from "../../../../../routes/paths";
import { useAuth } from "../../../../../contexts/AuthContext";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handlePostClick = () => {
    if (isAuthenticated) {
      navigate(PATHS.CUSTOMER.WRITE_REVIEW);
    } else {
      setShowLoginModal(true);
    }
  };

  const NavTab = ({ path, icon: Icon, label }: { path: string; icon: any; label: string }) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => navigate(path)}
        className="flex flex-col items-center justify-center gap-1 group relative flex-1 h-full"
      >
        <div className={`
          relative w-11 h-11 rounded-[16px] flex items-center justify-center transition-all duration-300
          ${active
            ? 'bg-gradient-to-br from-white to-gray-50 shadow-[0_8px_15px_rgba(153,0,0,0.15),inset_0_-2px_4px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-red-50/50 translate-y-[-2px]'
            : 'bg-transparent active:scale-95 active:translate-y-1'}
        `}>
          {/* Liquid Glass Icon Effect */}
          <div className={`
            p-2 rounded-[12px] flex items-center justify-center transition-colors duration-300
            ${active ? 'bg-red-50/80 backdrop-blur-md' : 'bg-transparent'}
          `}>
            <Icon className={`w-5 h-5 transition-all duration-300 ${active ? 'text-[#990000] drop-shadow-sm' : 'text-gray-400 group-hover:text-gray-600'}`} />
          </div>

          {/* 3D Depth Shadow for active state */}
          {active && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-red-900/10 rounded-full blur-[4px]" />
          )}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors duration-300 ${active ? 'text-gray-900' : 'text-gray-400'}`}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl safe-area-bottom z-50">
      {/* Top Glass Glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />

      <div className="flex items-end justify-around h-24 max-w-md mx-auto px-4 pb-4">
        <NavTab path={PATHS.CUSTOMER.HOME} icon={Home} label="Home" />
        <NavTab path={PATHS.CUSTOMER.DISCOVER} icon={Search} label="Discover" />

        {/* 3D Sphere FAB Integrated */}
        <div className="relative w-16 h-16 flex flex-col items-center justify-end pb-1">
          <button
            onClick={handlePostClick}
            className="relative group w-14 h-14 rounded-full transition-all duration-500 active:scale-90 hover:scale-110 z-10"
          >
            {/* The 3D Sphere Body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E5B80B] via-[#b80000] to-[#660000] shadow-[0_12px_25px_rgba(153,0,0,0.4),inset_0_-4px_12px_rgba(0,0,0,0.3),inset_0_4px_12px_rgba(255,255,255,0.4)]">
              {/* Top Specular Highlights */}
              <div className="absolute top-[15%] left-[15%] w-[35%] h-[25%] bg-white/40 rounded-[100%] blur-[2px] -rotate-[35deg]" />
              <div className="absolute top-[5%] left-[20%] w-[15%] h-[10%] bg-white/60 rounded-full blur-[1px]" />
              {/* Bottom Ambient Rim Light */}
              <div className="absolute bottom-[10%] inset-x-[20%] h-[15%] bg-[#E5B80B]/20 rounded-[100%] blur-[4px]" />

              <div className="relative w-full h-full flex items-center justify-center">
                <Plus className="w-8 h-8 text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)] group-hover:rotate-90 transition-transform duration-700 ease-out" />
              </div>
            </div>
            {/* Sphere Drop Shadow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[70%] h-3 bg-black/20 rounded-[100%] blur-lg group-hover:bg-black/30 transition-all duration-500" />
          </button>
          <span className="text-[8px] font-black text-gray-900 mt-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Review</span>
        </div>

        <NavTab path={PATHS.CUSTOMER.EXPLORE} icon={Compass} label="Explore" />
        <NavTab path={PATHS.CUSTOMER.ME.ROOT} icon={User} label="Profile" />
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E5B80B] via-[#b80000] to-[#660000] flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
              <p className="text-gray-500 mb-6">Please login to share your review with the community.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate(PATHS.AUTH.LOGIN);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#990000] to-[#660000] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
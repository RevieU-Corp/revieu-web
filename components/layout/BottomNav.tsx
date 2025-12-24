import { Home, Search, Map, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-40">
      <div className="flex items-center justify-around h-14 max-w-sm mx-auto px-2">
        <button 
          onClick={() => navigate('/home')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full ${
            isActive('/') || isActive('/home') ? 'text-[#990000]' : 'text-gray-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={() => navigate('/discover')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full ${
            isActive('/discover') ? 'text-[#990000]' : 'text-gray-500'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium">Discover</span>
        </button>
        <div className="flex-1" />
        <button className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-gray-500">
          <Map className="w-5 h-5" />
          <span className="text-[10px] font-medium">Map</span>
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full ${
            isActive('/profile') ? 'text-[#990000]' : 'text-gray-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}

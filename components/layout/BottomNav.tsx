import { Home, Search, Map, User } from "lucide-react";

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-40">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        <button className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[#990000]">
          <Home className="w-6 h-6" />
          <span className="text-[11px]">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-gray-500">
          <Search className="w-6 h-6" />
          <span className="text-[11px]">Search</span>
        </button>
        <div className="flex-1" />
        <button className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-gray-500">
          <Map className="w-6 h-6" />
          <span className="text-[11px]">Map</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-gray-500">
          <User className="w-6 h-6" />
          <span className="text-[11px]">Profile</span>
        </button>
      </div>
    </div>
  );
}

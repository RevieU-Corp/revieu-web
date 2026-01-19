import React from 'react';
import { Icons } from './Icons';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Left: Empty as requested (Removed Back btn and Logo) */}
        <div className="flex items-center gap-3">
           {/* Placeholder for spacing if needed, or just empty */}
        </div>

        {/* Center: Title (Optional, hidden on desktop usually) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 font-semibold text-sm opacity-0 md:opacity-100 transition-opacity text-gray-900 pointer-events-none">
          LocalGuide<span className="text-brand-red">Pro</span>
        </div>

        {/* Right: Global Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-black/5 text-gray-500 hover:text-gray-900 transition-colors relative">
            <Icons.Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full border border-white"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-black/5 text-gray-500 hover:text-gray-900 transition-colors md:hidden">
            <Icons.More size={20} />
          </button>
          <div className="hidden md:flex items-center gap-3 ml-2">
             <div className="h-8 w-[1px] bg-gray-200"></div>
             <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                    <img src="https://picsum.photos/id/64/100/100" className="w-full h-full object-cover" />
                </div>
                <span>Alex Rivera</span>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
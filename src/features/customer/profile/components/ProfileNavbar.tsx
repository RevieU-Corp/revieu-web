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
          <button className="p-2 rounded-full hover:bg-black/5 text-gray-500 hover:text-gray-900 transition-colors md:hidden">
            <Icons.More size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
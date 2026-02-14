import React, { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

interface HeaderProps {
    onSearch?: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch = () => { } }) => {
    const [isFocused, setIsFocused] = useState(false);
    const { user } = useAuth();

    // Use user avatar from AuthContext, fallback to placeholder
    const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`;

    return (
        <header className="px-4 pt-3 pb-3 bg-white/80 backdrop-blur-xl sticky top-0 z-40 transition-all border-b border-black/[0.03]">
            {/* Brand & User Profile - Compact */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                    <h1 className="text-[22px] font-[900] tracking-[-0.05em] text-[#1A1A1A] leading-none">
                        Discovery
                    </h1>
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-[#990000]/5 rounded-full border border-[#990000]/10">
                        <div className="w-1 h-1 rounded-full bg-[#990000] animate-pulse" />
                        <span className="text-[9px] font-black text-[#990000] uppercase tracking-widest">Village</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 bg-gray-50 rounded-full border border-gray-100 hover:scale-105 active:scale-95 transition-all">
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    <div className="w-8 h-8 rounded-full p-0.5 border border-[#990000]/20 overflow-hidden shadow-sm">
                        <img src={avatarUrl} className="w-full h-full rounded-full object-cover" alt="Profile" />
                    </div>
                </div>
            </div>

            {/* Compact Search Bar */}
            <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
                <div className={`flex items-center bg-gray-100/60 rounded-2xl transition-all duration-300 border ${
                    isFocused ? 'bg-white border-[#990000]/30 shadow-lg shadow-[#990000]/5' : 'border-transparent'
                }`}>
                    <div className="pl-3 pr-2">
                        <svg className={`w-4 h-4 transition-colors ${isFocused ? 'text-[#990000]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        type="text"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search USC..."
                        onChange={(e) => onSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none py-2.5 text-[14px] font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                    />

                    <div className="pr-2 flex items-center space-x-2">
                        <div className="w-[1px] h-3 bg-gray-300" />
                        <button className="text-[#990000] p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

import React, { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import revieUIcon from '../../../../assets/images/customer/home/revieUIcon.svg';
import notificationIcon from '../../../../assets/images/customer/home/notification.svg';
import defaultAvatar from '../../../../assets/images/customer/home/avatar.svg';
import micIcon from '../../../../assets/images/customer/home/searchBar/mic.svg';
import searchIcon from '../../../../assets/images/customer/home/searchBar/search.svg';

interface HeaderProps {
    onSearch?: (q: string) => void;
    onSearchTap?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch = () => { }, onSearchTap }) => {
    const [isFocused, setIsFocused] = useState(false);
    const { user } = useAuth();

    // Use user avatar from AuthContext, fallback to local default avatar image
    const avatarUrl = user?.avatar || defaultAvatar;

    return (
        <header className="px-8 pt-11 pb-3 bg-white/80 backdrop-blur-xl sticky top-0 z-40 transition-all border-b border-black/[0.03]">
            {/* Brand & User Profile - Compact */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <div
                            className="w-10 h-10 rounded-[40px] flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(243, 240, 240, 1)' }}
                        >
                            <img src={revieUIcon} alt="revieU icon" className="h-6 w-auto" />
                        </div>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                    <button className="p-1 mr-3 rounded-full hover:scale-105 active:scale-95 transition-all">
                        <img src={notificationIcon} className="w-[25px] h-[25px]" alt="Notifications" />
                    </button>
                    <div className="w-[42px] h-[42px] overflow-hidden rounded-full flex items-center justify-center cursor-pointer">
                        <img src={avatarUrl} className="w-[38px] h-[38px]" alt="Profile" />
                    </div>
                </div>
            </div>

            {/* Compact Search Bar */}
            <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className={`flex flex-1 min-w-0 h-[50px] items-center bg-gray-100/60 rounded-[18px] transition-all duration-300 border ${
                        isFocused ? 'bg-white border-[#990000]/30 shadow-lg shadow-[#990000]/5' : 'border-transparent'
                    }`}>
                        <div className="pl-3 pr-2">
                            <img src={searchIcon} className=''/>
                        </div>

                    <input
                        type="text"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search USC..."
                        readOnly={Boolean(onSearchTap)}
                        onMouseDown={(e) => {
                            if (!onSearchTap) {
                                return;
                            }

                            e.preventDefault();
                            onSearchTap();
                        }}
                        onKeyDown={(e) => {
                            if (!onSearchTap) {
                                return;
                            }

                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSearchTap();
                            }
                        }}
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
                    <button className="w-[50px] h-[50px] shrink-0 rounded-[18px] bg-[linear-gradient(48.58deg,_#990000_6.33%,_#CB3232_96.68%)] text-white flex items-center justify-center">
                        <img src={micIcon} className="w-[25px] h-[25px]">
                        </img>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;

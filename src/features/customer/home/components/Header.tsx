import React, { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import revieUIcon from '../../../../assets/images/customer/home/revieUIcon.svg';
import notificationIcon from '../../../../assets/images/customer/home/notification.svg';
import defaultAvatar from '../../../../assets/images/customer/home/avatar.svg';
import micIcon from '../../../../assets/images/customer/home/searchBar/mic.svg';
import searchIcon from '../../../../assets/images/customer/home/searchBar/search.svg';

interface HeaderProps {
    onSearch?: (q: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch = () => { } }) => {
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
                            placeholder="Search"
                            onChange={(e) => onSearch(e.target.value)}
                            className="h-full flex-1 bg-transparent border-none py-0 text-[14px] font-semibold text-gray-900 outline-none placeholder:text-gray-400"
                        />
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

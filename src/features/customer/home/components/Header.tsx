import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import defaultAvatar from '../../../../assets/images/customer/home/avatar.svg';

interface HeaderProps {
    onSearch?: (q: string) => void;
    onSearchTap?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch = () => {}, onSearchTap }) => {
    const [isFocused, setIsFocused] = useState(false);
    const { user } = useAuth();
    const avatarUrl = user?.avatar || defaultAvatar;

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
                <div className="flex items-center justify-between gap-4 lg:min-w-[15rem]">
                    <div>
                        <p className="text-lg font-black tracking-tight text-brand-600 lg:hidden">RevieU</p>
                        <p className="hidden text-sm font-semibold text-slate-500 lg:block">Welcome back</p>
                        <h1 className="hidden text-xl font-bold tracking-tight text-slate-900 lg:block">
                            Discover your next favorite place
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 lg:order-3">
                        <button
                            type="button"
                            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <img
                            src={avatarUrl}
                            className="h-10 w-10 rounded-full object-cover"
                            alt="Profile"
                        />
                    </div>
                </div>

                <div className="relative flex-1 lg:mx-8">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                        type="text"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search businesses, categories, or places"
                        readOnly={Boolean(onSearchTap)}
                        onMouseDown={(event) => {
                            if (!onSearchTap) return;
                            event.preventDefault();
                            onSearchTap();
                        }}
                        onKeyDown={(event) => {
                            if (!onSearchTap) return;
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                onSearchTap();
                            }
                        }}
                        onChange={(event) => onSearch(event.target.value)}
                        className={`h-12 w-full rounded-2xl border bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition ${
                            isFocused
                                ? 'border-brand-600 bg-white ring-4 ring-brand-600/10'
                                : 'border-transparent hover:border-slate-300'
                        }`}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;

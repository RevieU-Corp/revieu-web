import React from 'react';
import {
    QrCode,
    Settings,
    Edit2,
    Ticket,
    Wallet,
    Heart,
    ShoppingBag
} from 'lucide-react';

interface MeHeaderProps {
    user: {
        name: string;
        handle: string;
        avatar: string;
        bio: string;
    };
    onEdit: () => void;
    onSettings: () => void;
    onQr?: () => void;
}

export const MeHeader: React.FC<MeHeaderProps> = ({ user, onEdit, onSettings, onQr }) => {
    return (
        <div className="relative pt-4 pb-6 px-4">
            {/* Background Aesthetic */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#990000]/10 to-transparent -z-10" />

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-[#990000] tracking-tighter italic">REVIEU.</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onQr}
                        className="p-2 text-gray-700 hover:bg-gray-100 rounded-2xl transition-all active:scale-95 flex items-center justify-center bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm"
                    >
                        <QrCode className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onSettings}
                        className="p-2 text-gray-700 hover:bg-gray-100 rounded-2xl transition-all active:scale-95 flex items-center justify-center bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Premium User Hub Card - Integrated Shortcuts */}
            <div className="relative overflow-hidden bg-white border-2 border-[#990000]/10 rounded-[40px] p-6 shadow-[0_20px_50px_rgba(153,0,0,0.05)]">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5B80B]/5 rounded-full -mr-12 -mt-12 blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-[22px] p-0.5 bg-gradient-to-tr from-[#990000] to-[#E5B80B]">
                                <div className="w-full h-full rounded-[20px] bg-white p-0.5">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full rounded-[18px] object-cover"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={onEdit}
                                className="absolute -bottom-1 -right-1 p-1.5 bg-[#990000] shadow-lg rounded-xl text-white hover:scale-110 transition-transform ring-2 ring-white"
                            >
                                <Edit2 className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                                <h1 className="text-xl font-black text-gray-900 leading-tight">{user.name}</h1>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="text-[9px] bg-[#990000]/5 text-[#990000] border border-[#990000]/10 px-2 py-0.5 rounded-full font-black tracking-tighter">GOLD MEMBER</span>
                                <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-500/10 px-2 py-0.5 rounded-full font-black tracking-tighter">2,450 PTS</span>
                            </div>
                        </div>
                    </div>

                    {/* Integrated Shortcuts Row - 3D Liquid Glass Grid */}
                    <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-100/80">
                        {[
                            { label: 'Vouchers', icon: <Ticket className="w-5 h-5" />, color: 'from-orange-500 to-orange-400', hot: true, value: '12' },
                            { label: 'Wallet', icon: <Wallet className="w-5 h-5" />, color: 'from-amber-500 to-yellow-500', value: '$428' },
                            { label: 'Favorites', icon: <Heart className="w-5 h-5" />, color: 'from-rose-500 to-pink-500' },
                            { label: 'Orders', icon: <ShoppingBag className="w-5 h-5" />, color: 'from-emerald-500 to-teal-500' },
                        ].map((item, idx) => (
                            <button key={idx} className="flex flex-col items-center gap-3 group relative transition-all active:scale-95 active:translate-y-0.5">
                                {/* 3D Liquid Glass Square Container */}
                                <div className="relative w-14 h-14">
                                    {/* 3D Base/Shadow */}
                                    <div className="absolute inset-0 bg-gray-100 rounded-[18px] translate-y-[4px] blur-[1px]" />

                                    {/* Main Glass Body */}
                                    <div className={`absolute inset-0 bg-white rounded-[18px] border border-gray-100 shadow-[0_4px_10px_rgba(0,0,0,0.05)] overflow-hidden group-hover:border-${item.color.split('-')[1]}/30 transition-colors`}>
                                        {/* Liquid Layer */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-[0.08] group-hover:opacity-20 transition-opacity`} />

                                        {/* Subtle Gradient Glow */}
                                        <div className={`absolute bottom-[-20%] inset-x-[-20%] h-[70%] bg-gradient-to-t ${item.color} rounded-full blur-xl opacity-20`} />

                                        {/* Specular Glint */}
                                        <div className="absolute top-1 left-1.5 right-1.5 h-1 bg-white/60 rounded-full blur-[0.5px]" />
                                        <div className="absolute top-1 left-1.5 w-3 h-3 bg-white/20 rounded-full blur-[2px]" />

                                        {/* Icon */}
                                        <div className={`absolute inset-0 flex items-center justify-center ${item.color.replace('from-', 'text-').split(' ')[0]} transition-transform duration-500 group-hover:scale-110`}>
                                            {item.icon}
                                        </div>
                                    </div>

                                    {item.hot && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3 z-20">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border-2 border-white"></span>
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black text-gray-900 group-hover:text-[#990000] transition-colors">{item.value || (idx > 1 ? '0' : '')}</span>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter group-hover:text-gray-600 transition-colors">{item.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

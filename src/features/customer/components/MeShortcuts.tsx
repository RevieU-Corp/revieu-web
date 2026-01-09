import React from 'react';
import { MessageSquare, Heart, Ticket, Wallet, ShoppingBag } from 'lucide-react';

export const MeShortcuts: React.FC = () => {
    const shortcuts = [
        { label: 'Vouchers', icon: <Ticket className="w-6 h-6" />, color: 'bg-orange-50 text-orange-600', hot: true },
        { label: 'Reviews', icon: <MessageSquare className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
        { label: 'Wallet', icon: <Wallet className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600' },
        { label: 'Favorites', icon: <Heart className="w-6 h-6" />, color: 'bg-rose-50 text-rose-600' },
        { label: 'Orders', icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600' },
    ];

    return (
        <div className="grid grid-cols-5 gap-1 px-2 mb-8">
            {shortcuts.map((item, idx) => (
                <button
                    key={idx}
                    className="flex flex-col items-center gap-2 group py-2"
                >
                    <div className={`w-12 h-12 ${item.color} rounded-[22px] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform active:scale-95 relative`}>
                        {item.icon}
                        {item.hot && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce" />
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 text-center">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

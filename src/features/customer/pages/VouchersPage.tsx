import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Ticket } from 'lucide-react';

const VouchersPage: React.FC = () => {
    const navigate = useNavigate();
    const [slidingId, setSlidingId] = useState<number | null>(null);

    const handleBack = () => navigate(-1);

    const handleVoucherClick = (id: number) => {
        setSlidingId(id);
        // Simulate "Opening" or "Redeeming" a ticket
        setTimeout(() => {
            alert('Voucher Activated! Showing detail...');
            setSlidingId(null);
        }, 600);
    };

    const vouchers = [
        { id: 1, merchant: 'Noda Ramen', deal: '80% OFF', color: 'bg-gradient-to-br from-[#FF4D4D] to-[#FF8C42]', type: 'FOOD' },
        { id: 2, merchant: 'Cafe Dulce', deal: 'BOGO FREE', color: 'bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70]', type: 'DRINK' },
        { id: 3, merchant: 'Sushi King', deal: '$20 CREDIT', color: 'bg-gradient-to-br from-[#11998e] to-[#38ef7d]', type: 'FOOD' },
        { id: 4, merchant: 'USC Bookstore', deal: '15% DISCOUNT', color: 'bg-gradient-to-br from-[#8E2DE2] to-[#4A00E0]', type: 'SHOP' },
    ];

    return (
        <div className="bg-[#FBFCFD] min-h-screen pb-10">
            {/* Minimalist Header */}
            <div className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl z-50 px-6 flex items-center justify-between border-b border-gray-50">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <h1 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Voucher Wallet</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="pt-24 px-6 space-y-4">
                {/* Summary Info */}
                <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-50 mb-8">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Savings available</p>
                    <p className="text-3xl font-black text-[#990000]">$124.50</p>
                    <div className="mt-4 flex gap-2">
                        <span className="text-[9px] bg-red-50 text-[#990000] px-3 py-1 rounded-full font-black uppercase tracking-tighter">12 Active Tickets</span>
                        <span className="text-[9px] bg-gray-50 text-gray-400 px-3 py-1 rounded-full font-black uppercase tracking-tighter">4 Expired</span>
                    </div>
                </div>

                {/* Vertical Lottery List */}
                <div className="space-y-6">
                    {vouchers.map((v) => (
                        <div key={v.id} className="relative">
                            <button
                                onClick={() => handleVoucherClick(v.id)}
                                className={`
                                    w-full h-32 ${v.color} rounded-[32px] p-0 flex relative overflow-hidden transition-all duration-500 shadow-xl shadow-gray-200/50
                                    ${slidingId === v.id ? 'translate-x-[-150%] opacity-0 rotate-[-8deg] pointer-events-none' : 'active:scale-[0.97] hover:brightness-105'}
                                `}
                            >
                                {/* Perforated Edges */}
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FBFCFD] rounded-full z-10 shadow-inner" />
                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FBFCFD] rounded-full z-10 shadow-inner" />

                                {/* Main Content */}
                                <div className="flex-1 flex flex-col justify-center pl-10 pr-4 border-r-2 border-dashed border-white/20 relative">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-md font-bold tracking-tighter">{v.type}</span>
                                        <span className="text-[10px] font-black uppercase opacity-70 tracking-widest text-white/90">{v.merchant}</span>
                                    </div>
                                    <span className="text-3xl font-black italic text-white drop-shadow-lg">{v.deal}</span>
                                    {/* Glass reflection */}
                                    <div className="absolute top-0 right-0 w-24 h-full bg-white/5 skew-x-[-20deg] translate-x-12" />
                                </div>

                                {/* Stub Section */}
                                <div className="w-20 h-full flex flex-col items-center justify-center bg-black/5 gap-2">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <Ticket className="w-5 h-5 text-white/80" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/60">OPEN</span>
                                </div>
                            </button>

                            {/* Background reveal state (when card slides out) */}
                            {slidingId === v.id && (
                                <div className="absolute inset-0 bg-red-50 rounded-[32px] flex items-center justify-center border-2 border-dashed border-[#990000]/20 -z-10 animate-in fade-in zoom-in-95">
                                    <span className="text-[#990000] font-black italic text-sm">REDEEMING...</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Tip */}
                <div className="text-center pt-8 pb-10">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">Tap to slide and reveal ticket</p>
                </div>
            </div>
        </div>
    );
};

export default VouchersPage;

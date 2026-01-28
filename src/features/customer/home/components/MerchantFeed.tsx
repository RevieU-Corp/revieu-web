
import React from 'react';
import { HomeMerchant } from '../../shared/types';

interface MerchantFeedProps {
    merchants: HomeMerchant[];
}

const MerchantFeed: React.FC<MerchantFeedProps> = ({ merchants }) => {
    return (
        <div className="space-y-8">
            {merchants.map((merchant) => (
                <div
                    key={merchant.id}
                    className="group cursor-pointer bg-white rounded-[28px] p-3 border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
                >
                    <div className="relative aspect-[16/9] rounded-[22px] overflow-hidden mb-4 bg-gray-100">
                        <img
                            src={merchant.image}
                            alt={merchant.name}
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute top-3 right-3">
                            <div className="flex items-center bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                <span className="text-[#FFCC00] text-[16px] mr-1">★</span>
                                <span className="text-white text-[13px] font-black">{merchant.rating}</span>
                            </div>
                        </div>

                        {merchant.offer && (
                            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-[#990000] rounded-xl text-[9px] font-black text-white uppercase tracking-wider">
                                {merchant.offer}
                            </div>
                        )}
                    </div>

                    <div className="px-1 pb-1">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <h3 className="text-[19px] font-[900] text-gray-900 tracking-tight leading-none mb-1.5">
                                    {merchant.name}
                                </h3>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    {merchant.category.split(' ')[0]} • {merchant.distance}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                <svg className="w-5 h-5 text-[#990000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 pt-3 border-t border-gray-50">
                            <div className="flex items-center space-x-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">Active Heat</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <svg className="w-3.5 h-3.5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-10a4 4 0 11-8 0 4 4 0 018 0zm2 10V9m-3 3l3-3 3 3" />
                                </svg>
                                <span className="text-[11px] font-bold text-gray-500">{merchant.reviewCount} Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MerchantFeed;

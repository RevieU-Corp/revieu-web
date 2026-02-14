import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExtendedMerchant } from '../hooks/useMerchantFilter';
import { getTrojanMetricColor, getTrojanMetricBadge } from '../utils/merchantUtils';
import { PATHS } from '../../../../routes/paths';

interface MerchantFeedProps {
    merchants: ExtendedMerchant[];
}

const MerchantFeed: React.FC<MerchantFeedProps> = ({ merchants }) => {
    const navigate = useNavigate();

    const handleMerchantClick = (merchantId: string) => {
        navigate(PATHS.CUSTOMER.MERCHANT_INFO(merchantId));
    };

    if (merchants.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No merchants found</h3>
                <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {merchants.map((merchant) => (
                <div
                    key={merchant.id}
                    onClick={() => handleMerchantClick(merchant.id)}
                    className="group cursor-pointer bg-white rounded-[28px] p-3 border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
                >
                    <div className="relative aspect-[16/9] rounded-[22px] overflow-hidden mb-4 bg-gray-100">
                        <img
                            src={merchant.image}
                            alt={merchant.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Rating Badge */}
                        <div className="absolute top-3 right-3">
                            <div className="flex items-center bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                <span className="text-[#FFCC00] text-[16px] mr-1">★</span>
                                <span className="text-white text-[13px] font-black">{merchant.rating}</span>
                            </div>
                        </div>

                        {/* Trojan Metric Badge */}
                        <div className="absolute top-3 left-3">
                            <div className="flex items-center bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-200">
                                <span className={`text-[13px] font-black ${getTrojanMetricColor(merchant.trojanMetric)}`}>
                                    {merchant.trojanMetric}
                                </span>
                                <span className="text-gray-400 text-[10px] font-bold ml-1">TM</span>
                            </div>
                        </div>

                        {/* Offer Badge */}
                        {merchant.offer && (
                            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-[#990000] rounded-xl text-[9px] font-black text-white uppercase tracking-wider">
                                {merchant.offer}
                            </div>
                        )}

                        {/* Status Badge */}
                        {!merchant.isOpen && (
                            <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-gray-900/80 backdrop-blur-md rounded-xl text-[9px] font-black text-white uppercase tracking-wider">
                                Closed
                            </div>
                        )}
                    </div>

                    <div className="px-1 pb-1">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <h3 className="text-[19px] font-[900] text-gray-900 tracking-tight leading-none">
                                        {merchant.name}
                                    </h3>
                                    {merchant.trojanMetric >= 80 && (
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-black uppercase tracking-wider rounded">
                                            {getTrojanMetricBadge(merchant.trojanMetric)}
                                        </span>
                                    )}
                                </div>
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
                                <div className={`w-1.5 h-1.5 rounded-full ${merchant.isOpen ? 'bg-green-500' : 'bg-gray-400'}`} />
                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                                    {merchant.isOpen ? 'Active Heat' : 'Closed'}
                                </span>
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

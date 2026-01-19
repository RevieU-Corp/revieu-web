import React from 'react';
import { Order } from '../types';
import { Icons } from './Icons';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-white p-5 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col gap-5 h-full transition-all hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.08)] group">
       {/* Header: Business Info */}
       <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gray-50 p-0.5 border border-gray-100">
                    <img src={order.businessImage} alt={order.businessName} className="w-full h-full rounded-[10px] object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white shadow-sm">
                    <Icons.ShoppingBag size={10} className="text-white" />
                </div>
            </div>
            <div>
               <h3 className="font-bold text-gray-900 text-[15px] leading-tight group-hover:text-blue-600 transition-colors">{order.businessName}</h3>
               <p className="text-xs text-gray-400 font-medium mt-0.5">{order.date}</p>
            </div>
          </div>
          <div className="text-right">
              <span className="block font-bold text-gray-900 text-sm">{order.total}</span>
              <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Completed</span>
          </div>
       </div>

       {/* Order Summary */}
       <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            <span className="font-semibold text-gray-700 block mb-0.5 text-[10px] uppercase tracking-wide">Ordered items</span> 
            {order.items.join(', ')}
          </p>
       </div>
       
       {/* Action Area: Rate */}
       <div className="mt-auto">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-bold text-gray-900">Rate & Earn</span>
            <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">+50 pts</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Star Bar */}
            <div className="flex-1 flex justify-between bg-white border border-gray-200 rounded-xl p-2.5 px-3 cursor-pointer hover:border-brand-gold/50 transition-colors group/stars shadow-sm">
                {[1,2,3,4,5].map(s => (
                    <Icons.Star key={s} size={18} className="text-gray-200 group-hover/stars:text-brand-gold transition-colors" />
                ))}
            </div>
          </div>
       </div>
    </div>
  )
}

export default OrderCard;
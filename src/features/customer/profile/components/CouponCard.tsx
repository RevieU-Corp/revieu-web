import React, { useState } from 'react';
import { Coupon } from '../types';
import { Icons } from './Icons';

interface CouponCardProps {
  coupon: Coupon;
  className?: string;
  compact?: boolean;
  onDelete?: (id: string) => Promise<void>;
}

const CouponCard: React.FC<CouponCardProps> = ({ coupon, className = '', compact = false, onDelete }) => {
  const isExpired = coupon.status === 'expired';
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = () => setConfirming(true);

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(coupon.id);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };
  
  return (
    <div className={`group relative flex flex-col w-full bg-white rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-transform active:scale-[0.98] ${isExpired ? 'opacity-60 grayscale' : ''} ${className}`}>
      
      {/* Top Section - Header */}
      <div 
        className={`${compact ? 'h-20' : 'h-32'} relative p-5 flex flex-col justify-between transition-all`}
        style={{ backgroundColor: coupon.color || '#990000' }}
      >
        <div className="flex justify-between items-start z-10">
          <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
             <img src={coupon.logo} alt="Logo" className="w-8 h-8 rounded-lg bg-white object-cover shadow-sm" />
          </div>
          {coupon.status === 'active' && !compact && (
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 tracking-wide">
              ACTIVE
            </span>
          )}
        </div>
        
        <div className="text-white z-10 mt-2">
           <h3 className="font-medium text-white/80 text-xs uppercase tracking-wider mb-0.5">{coupon.businessName}</h3>
           <h2 className={`${compact ? 'text-lg' : 'text-2xl'} font-bold leading-none tracking-tight`}>{coupon.offerTitle}</h2>
        </div>

        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
      </div>

      {/* Middle Punch out effect */}
      <div className="relative h-5 bg-white flex items-center">
         <div className="absolute left-0 w-5 h-5 bg-[#F2F2F7] rounded-full -translate-x-1/2 shadow-inner"></div>
         <div className="w-full border-b-2 border-dashed border-gray-100 mx-5"></div>
         <div className="absolute right-0 w-5 h-5 bg-[#F2F2F7] rounded-full translate-x-1/2 shadow-inner"></div>
      </div>

      {/* Bottom Section - Details */}
      <div className="bg-white p-5 pt-1 flex items-center justify-between">
         <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Expires</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5 flex items-center gap-1.5">
               <Icons.Clock size={14} className="text-brand-red"/> {coupon.expiryDate}
            </p>
         </div>

         <div className="flex items-center gap-2">
           {!compact && (
             <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 px-4 py-2.5 rounded-xl border border-gray-100 transition-colors shadow-sm">
                <Icons.QrCode size={18} />
                <span className="text-xs font-bold">Use</span>
             </button>
           )}

           {onDelete && !confirming && (
             <button
               onClick={handleDeleteClick}
               className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
               title="Remove coupon"
             >
               <Icons.Trash size={16} />
             </button>
           )}

           {onDelete && confirming && (
             <div className="flex items-center gap-1">
               <button
                 onClick={handleConfirmDelete}
                 disabled={deleting}
                 className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-60"
               >
                 {deleting ? '...' : 'Delete'}
               </button>
               <button
                 onClick={() => setConfirming(false)}
                 disabled={deleting}
                 className="text-[10px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors"
               >
                 Cancel
               </button>
             </div>
           )}
         </div>
      </div>
    </div>
  );
};

export default CouponCard;
import { Compass, User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../../../routes/paths';

interface GlossyBottomNavProps {
  onBack?: () => void;
  onWriteReview?: () => void;
}

export function GlossyBottomNav({ onBack, onWriteReview }: GlossyBottomNavProps) {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(PATHS.CUSTOMER.EXPLORE);
    }
  };

  const handleWriteReviewClick = () => {
    if (onWriteReview) {
      onWriteReview();
    } else {
      navigate(PATHS.CUSTOMER.WRITE_REVIEW_SELECT);
    }
  };

  const handleProfileClick = () => {
    navigate(PATHS.CUSTOMER.ME.ROOT);
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-6 relative">
        {/* Explore Icon */}
        <button 
          onClick={handleExploreClick}
          className="flex flex-col items-center justify-center w-14 h-14 touch-manipulation active:scale-95 transition-transform"
        >
          <Compass className="w-6 h-6 text-gray-600 stroke-[2]" />
        </button>

        {/* Glossy 3D FAB - Center */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <button 
            onClick={handleWriteReviewClick}
            className="relative w-16 h-16 rounded-full touch-manipulation active:scale-95 transition-transform"
            style={{
              background: 'linear-gradient(135deg, #E5B80B 0%, #b80000 70%, #660000 100%)',
              boxShadow: `0 8px 16px rgba(184, 0, 0, 0.4),
                         0 4px 8px rgba(184, 0, 0, 0.3),
                         inset 0 2px 4px rgba(255, 255, 255, 0.4),
                         inset 0 -2px 4px rgba(0, 0, 0, 0.3)`
            }}
          >
            {/* Top highlight - glossy effect */}
            <div 
              className="absolute top-2 left-3 right-3 h-4 rounded-full"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)',
                filter: 'blur(2px)'
              }}
            />
            
            {/* Bottom rim lighting */}
            <div 
              className="absolute bottom-1 left-2 right-2 h-2 rounded-full"
              style={{
                background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
                filter: 'blur(1px)'
              }}
            />
            
            {/* Plus Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Plus className="w-7 h-7 text-white stroke-[3]" />
            </div>
            
            {/* Specular highlight - top left */}
            <div 
              className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 40%, transparent 70%)',
              }}
            />
          </button>
        </div>

        {/* Profile Icon */}
        <button 
          onClick={handleProfileClick}
          className="flex flex-col items-center justify-center w-14 h-14 touch-manipulation active:scale-95 transition-transform"
        >
          <User className="w-6 h-6 text-gray-600 stroke-[2]" />
        </button>
      </div>
    </div>
  );
}

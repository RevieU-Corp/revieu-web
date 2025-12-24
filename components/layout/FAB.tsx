import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FAB() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/write-review');
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-sm mx-auto">
      <button 
        onClick={handleClick}
        className="bg-[#990000] text-white rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <Plus className="w-5 h-5" />
      </button>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-gray-700">
        Write a Review
      </div>
    </div>
  );
}

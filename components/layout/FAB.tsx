import { Plus } from "lucide-react";

export function FAB() {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
      <button className="bg-[#990000] text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-gray-700">
        Write a Review
      </div>
    </div>
  );
}

import { useState } from "react";
import { Target, ChevronDown } from "lucide-react";

const RANGES = [
  "1 mile",
  "3 miles",
  "5 miles",
  "10 miles",
  "15 miles",
];

export function RangeSelector() {
  const [currentRange, setCurrentRange] = useState("5 miles");
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Range选择按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-1
          p-1
          rounded-full
          hover:bg-gray-100
          transition-colors
          text-sm font-medium text-gray-700
        "
      >
        {/* 范围图标 */}
        <Target className="w-5 h-5 text-[#990000]" />
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>
      
      {/* 下拉菜单 */}
      {open && (
        <div className="absolute left-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          {RANGES.map((range) => (
            <button
              key={range}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                range === currentRange
                  ? "text-[#990000] font-semibold"
                  : "text-gray-700"
              }`}
              onClick={() => {
                setCurrentRange(range);
                setOpen(false);
              }}
            >
              {range}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

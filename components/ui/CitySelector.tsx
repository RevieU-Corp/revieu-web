import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";

const CITIES = [
  "1 miles",
  "5 miles",
  "10 miles",
  "15 miles",
];

export function CitySelector() {
  const [currentCity, setCurrentCity] = useState("USC Area");
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* DoorDash 风城市按钮 */}
      <button
      onClick={() => setOpen(!open)}
      className="
        flex items-center gap-1
        p-1                     /* 使用相等的内边距，让点击区域成正方形或自然的圆角矩形 */
        rounded-full              /* 圆形背景悬停效果 */
        hover:bg-gray-100         /* 鼠标悬停时的小反馈 */
        transition-colors
        text-sm font-medium text-gray-700
      "
    >
      {/* 重点突出的地图 Pin */}
      <MapPin className="w-5 h-5 text-[#990000]" />
        
      <ChevronDown className="w-3 h-3 text-gray-400" />
    </button>
      {/* 下拉菜单 */}
      {open && (
        <div className="absolute left-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          {CITIES.map((city) => (
            <button
              key={city}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                city === currentCity
                  ? "text-[#990000] font-semibold"
                  : "text-gray-700"
              }`}
              onClick={() => {
                setCurrentCity(city);
                setOpen(false);
              }}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
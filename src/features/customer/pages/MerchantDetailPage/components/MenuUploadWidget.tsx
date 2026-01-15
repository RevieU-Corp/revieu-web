import { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';

// 🔥 不需要 import 本地文件了，把那行删掉，直接解决报错
// import defaultMenuImg from "../../assets/images/fogo-menu.jpg"; 

interface MenuUploadWidgetProps {
  menuImageUrl?: string;
}

export function MenuUploadWidget({ menuImageUrl }: MenuUploadWidgetProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // 1. 这里我直接放了一个在线的 URL，这是一张烤肉店的菜单图，很符合 Fogo 的风格
  // 这样无论你的文件挪到哪里，图片都能显示
  const DEFAULT_MENU_URL = "https://pizzainkansas.com/img/ppmenu.jpg";

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
  };

  // 2. 逻辑：如果有传入的就用传入的，没有就用这张在线图
  const imageUrl = menuImageUrl || DEFAULT_MENU_URL;

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        {/* 图片容器 */}
        <div className="relative group">
          <img
            src={imageUrl}
            alt="餐厅完整菜单"
            className="w-full h-auto cursor-pointer object-cover hover:opacity-95 transition-opacity"
            onClick={handleZoomToggle}
          />

          {/* 放大按钮 (鼠标悬停时显示) */}
          <button 
            onClick={handleZoomToggle}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-orange-50"
          >
            <ZoomIn className="w-6 h-6 text-gray-700 hover:text-[#FFA500]" />
          </button>
        </div>  
      </div>

      {/* 点击后的放大全屏模式 */}
      {isZoomed && (
        <div 
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 cursor-pointer"
            onClick={handleCloseZoom}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* 关闭按钮 */}
            <button
              onClick={handleCloseZoom}
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-2 hover:bg-white/20 text-white transition-all z-50"
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* 大图 */}
            <img
              src={imageUrl}
              alt="菜单大图"
              className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
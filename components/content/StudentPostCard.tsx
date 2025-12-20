
import React from 'react';

interface Post {
  id: number;
  title: string;
  image: string;
  author: string;
  rating: number;
  onClick?: () => void;
}

const StudentPostCard: React.FC<Post> = ({ title, image, author, rating, onClick }) => (
  <div 
    onClick={onClick} 
    className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
  >
    <div className="h-32 bg-gray-200 relative">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm text-gray-800">
        <span className="text-yellow-500">★</span> {rating}
      </div>
    </div>
    <div className="p-3">
      <h3 className="font-bold text-gray-800 text-sm truncate">{title}</h3>
      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
        <span className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-[8px]">👤</span> 
        {author}
      </p>
    </div>
  </div>
);

export default StudentPostCard;

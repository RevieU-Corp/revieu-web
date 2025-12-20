
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle } from "lucide-react";

interface StudentPostProps {
  id: number;
  avatar: string;
  username: string;
  timestamp: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
}

export function StudentPost({ id, avatar, username, timestamp, text, image, likes, comments }: StudentPostProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 h-full flex flex-col cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#FFC72C] flex items-center justify-center flex-shrink-0 text-lg">
          <span className="select-none">{avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-sm font-semibold truncate">{username}</p>
          <p className="text-gray-500 text-xs">{timestamp}</p>
        </div>
      </div>

      {/* Optional Image */}
      {image && (
        <div className="mb-2 rounded-xl overflow-hidden">
          <img
            src={image}
            alt="Post content"
            className="w-full h-32 object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <p className="text-gray-700 text-sm mb-3 line-clamp-3 flex-1 leading-relaxed">{text}</p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-auto">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-[#990000] transition-colors group">
          <Heart className="w-4 h-4 group-hover:fill-current" />
          <span className="text-xs font-medium">{likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-[#990000] transition-colors group">
          <MessageCircle className="w-4 h-4 group-hover:stroke-[#990000]" />
          <span className="text-xs font-medium">{comments}</span>
        </button>
      </div>
    </div>
  );
}

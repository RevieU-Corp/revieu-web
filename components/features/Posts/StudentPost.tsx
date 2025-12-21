import { Heart, MessageCircle } from "lucide-react";

interface StudentPostProps {
  avatar: string;
  username: string;
  timestamp: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
}

export function StudentPost({ avatar, username, timestamp, text, image, likes, comments }: StudentPostProps) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#FFC72C] flex items-center justify-center flex-shrink-0">
          <span className="text-sm">{avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-sm truncate">{username}</p>
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
      <p className="text-gray-700 text-sm mb-3 line-clamp-3 flex-1">{text}</p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <button className="flex items-center gap-1.5 text-gray-600 hover:text-[#990000] transition-colors">
          <Heart className="w-4 h-4" />
          <span className="text-xs">{likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-600 hover:text-[#990000] transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">{comments}</span>
        </button>
      </div>
    </div>
  );
}
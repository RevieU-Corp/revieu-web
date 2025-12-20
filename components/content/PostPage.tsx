
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';

// Mock Data (In a real app, this would come from an API or Context)
const MOCK_POSTS = [
  {
    id: 1,
    avatar: "🍜",
    username: "Alex Johnson",
    timestamp: "2h ago",
    text: "Found the best ramen spot near campus! The broth is incredible and student discount applies.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60",
    likes: 124,
    comments: 12
  },
  {
    id: 2,
    avatar: "🌮",
    username: "Sarah Lee",
    timestamp: "4h ago",
    text: "Late night taco run? These are definitely the best al pastor tacos I've had in LA.",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&auto=format&fit=crop&q=60",
    likes: 89,
    comments: 8
  },
  {
    id: 3,
    avatar: "📚",
    username: "Mike Chen",
    timestamp: "5h ago",
    text: "This cafe is perfect for studying. Super quiet, fast wifi, and plenty of outlets.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60",
    likes: 256,
    comments: 45
  },
  {
    id: 4,
    avatar: "🍔",
    username: "Emily Davis",
    timestamp: "1d ago",
    text: "The Monday burger deal is back! $5 for a cheeseburger and fries.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    likes: 67,
    comments: 15
  },
  {
    id: 5,
    avatar: "🍵",
    username: "Jess Wilson",
    timestamp: "1d ago",
    text: "Matcha heaven right here. A bit pricey but worth it for a treat.",
    image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=500&auto=format&fit=crop&q=60",
    likes: 112,
    comments: 9
  },
  {
    id: 6,
    avatar: "🍕",
    username: "Tom Baker",
    timestamp: "2d ago",
    text: "Crispy thin crust pizza. Great for sharing with a group after class.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60",
    likes: 45,
    comments: 3
  }
];

const PostPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    // Simulate fetching data
    const foundPost = MOCK_POSTS.find(p => p.id === Number(id));
    setPost(foundPost);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
           <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-gray-900">Post</h1>
        <button className="p-2 -mr-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Author Section */}
        <div className="px-4 py-4 flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-[#FFC72C] flex items-center justify-center text-xl border border-gray-100">
             {post.avatar}
           </div>
           <div>
             <h2 className="font-bold text-gray-900 leading-tight">{post.username}</h2>
             <p className="text-xs text-gray-500">{post.timestamp}</p>
           </div>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-2">
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
            {post.text}
          </p>
        </div>

        {/* Image */}
        {post.image && (
          <div className="w-full mt-2 mb-4">
            <img src={post.image} alt="Post" className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        {/* Stats Row */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 text-sm text-gray-500">
          <span>{post.likes + (isLiked ? 1 : 0)} likes</span>
          <span>{post.comments} comments</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around py-3 border-b border-gray-100">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 ${isLiked ? 'text-red-600' : 'text-gray-600'}`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">Like</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm font-medium">Comment</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600">
            <Share2 className="w-6 h-6" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Comments Section Mock */}
        <div className="p-4 space-y-4">
          <h3 className="font-bold text-gray-900">Comments</h3>
          
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">👤</div>
            <div className="flex-1 bg-gray-50 p-3 rounded-r-xl rounded-bl-xl">
              <p className="text-sm font-bold text-gray-900 mb-1">Jamie Smith</p>
              <p className="text-sm text-gray-700">I totally agree! The broth is amazing.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">🎓</div>
            <div className="flex-1 bg-gray-50 p-3 rounded-r-xl rounded-bl-xl">
              <p className="text-sm font-bold text-gray-900 mb-1">Chris P.</p>
              <p className="text-sm text-gray-700">Do they have vegetarian options?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Input Area */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3 pb-safe">
        <div className="w-8 h-8 rounded-full bg-[#FFC72C] flex items-center justify-center text-sm border border-gray-200 flex-shrink-0">
          TJ
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
          <button 
            className={`absolute right-1.5 top-1.5 p-1 rounded-full transition-colors ${commentText ? 'text-red-600 bg-red-50' : 'text-gray-400'}`}
            disabled={!commentText}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPage;

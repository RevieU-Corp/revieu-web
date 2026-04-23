import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { PostData } from '../types';

// Mock data - in a real app this would come from an API
const MOCK_POSTS: PostData[] = [
  {
    id: 1,
    avatar: "🍜",
    username: "FoodieExplorer",
    timestamp: "2 hours ago",
    text: "Just tried this amazing ramen place! The broth was so rich and flavorful. Definitely coming back for more. The service was quick and the atmosphere was cozy.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    likes: 24,
    comments: 8
  },
  {
    id: 2,
    avatar: "☕",
    username: "CoffeeAddict",
    timestamp: "4 hours ago", 
    text: "Perfect morning coffee spot! Great ambiance for working or catching up with friends. Their pastries are fresh and delicious too.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
    likes: 18,
    comments: 5
  }
];

const PostPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    // Simulate fetching data
    const foundPost = MOCK_POSTS.find(p => p.id === Number(id));
    setPost(foundPost || null);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
        <div className="text-center">
          <p className="text-gray-500">Post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col pb-20 w-full flex-1">
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

        {/* Comments Section */}
        <div className="p-4 space-y-4">
          <h3 className="font-bold text-gray-900">Comments</h3>
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
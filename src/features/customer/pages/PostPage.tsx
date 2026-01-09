import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { MOCK_POSTS } from '../constants/index';
import { PostData } from '../types';

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
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading post...</p>
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
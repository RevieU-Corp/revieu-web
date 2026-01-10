import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  X, 
  Eye, 
  Hash, 
  ExternalLink,
  ArrowLeft,
  Play
} from 'lucide-react';
import { PATHS } from '../../../routes/paths';

interface MediaFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video';
}

interface PostData {
  description: string;
  media: MediaFile[];
  ctaAction: string;
  selectedHashtags: string[];
}

// Predefined hashtags organized by category
const PREDEFINED_HASHTAGS = {
  food: [
    '#delicious', '#fresh', '#tasty', '#homemade', '#organic', '#healthy',
    '#spicy', '#sweet', '#savory', '#gourmet', '#comfort', '#authentic'
  ],
  business: [
    '#newmenu', '#special', '#discount', '#sale', '#offer', '#deal',
    '#limited', '#exclusive', '#premium', '#quality', '#service', '#local'
  ],
  occasions: [
    '#breakfast', '#lunch', '#dinner', '#weekend', '#holiday', '#celebration',
    '#birthday', '#anniversary', '#date', '#family', '#friends', '#party'
  ],
  experience: [
    '#cozy', '#atmosphere', '#ambiance', '#outdoor', '#indoor', '#takeout',
    '#delivery', '#drivethru', '#catering', '#events', '#private', '#group'
  ],
  trending: [
    '#foodie', '#instafood', '#yummy', '#nom', '#craving', '#satisfying',
    '#mouthwatering', '#irresistible', '#perfect', '#amazing', '#love', '#favorite'
  ],
  location: [
    '#usc', '#downtown', '#campus', '#neighborhood', '#community', '#local',
    '#nearby', '#convenient', '#accessible', '#central', '#popular', '#hidden'
  ]
};

const CTA_OPTIONS = [
  { value: 'book-now', label: 'Book Now', color: 'bg-blue-600' },
  { value: 'get-offer', label: 'Get Offer', color: 'bg-green-600' },
  { value: 'order-online', label: 'Order Online', color: 'bg-orange-600' },
  { value: 'call-now', label: 'Call Now', color: 'bg-purple-600' },
  { value: 'visit-website', label: 'Visit Website', color: 'bg-indigo-600' },
  { value: 'learn-more', label: 'Learn More', color: 'bg-gray-600' }
];

const PostCreation: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [postData, setPostData] = useState<PostData>({
    description: '',
    media: [],
    ctaAction: 'book-now',
    selectedHashtags: []
  });

  const handleDescriptionChange = (value: string) => {
    setPostData(prev => ({
      ...prev,
      description: value
    }));
  };

  const toggleHashtagSelection = (hashtag: string) => {
    setPostData(prev => ({
      ...prev,
      selectedHashtags: prev.selectedHashtags.includes(hashtag)
        ? prev.selectedHashtags.filter(tag => tag !== hashtag)
        : [...prev.selectedHashtags, hashtag]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        alert('Please upload only image or video files');
        return;
      }

      // Validate file size (50MB max for videos, 10MB for images)
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File size too large. Max ${isVideo ? '50MB' : '10MB'} allowed.`);
        return;
      }

      // Check if we already have a video (only one video allowed)
      if (isVideo && postData.media.some(m => m.type === 'video')) {
        alert('Only one video is allowed per post');
        return;
      }

      // Check total media count (max 10 images or 1 video)
      if (postData.media.length >= 10) {
        alert('Maximum 10 media files allowed');
        return;
      }

      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        url: URL.createObjectURL(file),
        type: isImage ? 'image' : 'video'
      };

      setPostData(prev => ({
        ...prev,
        media: [...prev.media, mediaFile]
      }));
    });

    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeMedia = (id: string) => {
    setPostData(prev => ({
      ...prev,
      media: prev.media.filter(m => {
        if (m.id === id) {
          URL.revokeObjectURL(m.url);
        }
        return m.id !== id;
      })
    }));
  };

  const handleSubmit = async () => {
    if (!postData.description.trim()) {
      alert('Please add a description for your post');
      return;
    }

    if (postData.media.length === 0) {
      alert('Please add at least one image or video');
      return;
    }

    if (postData.selectedHashtags.length === 0) {
      const confirmWithoutHashtags = window.confirm(
        'No hashtags selected. Hashtags help customers discover your post. Continue without hashtags?'
      );
      if (!confirmWithoutHashtags) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Post created:', {
        description: postData.description,
        mediaCount: postData.media.length,
        ctaAction: postData.ctaAction,
        selectedHashtags: postData.selectedHashtags
      });

      // Navigate back to dashboard or posts list
      navigate(PATHS.MERCHANT.DASHBOARD);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCTA = CTA_OPTIONS.find(option => option.value === postData.ctaAction);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(PATHS.MERCHANT.DASHBOARD)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create Post</h1>
              <p className="text-sm text-gray-600">Share updates with your customers</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye size={16} />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !postData.description.trim() || postData.media.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
              {postData.selectedHashtags.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {postData.selectedHashtags.length} tags
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Creation Form */}
          <div className="space-y-6">
            {/* Media Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Media Upload
              </h2>
              
              {/* Upload Area */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                >
                  <div className="text-center">
                    <div className="flex justify-center gap-2 mb-3">
                      <ImageIcon className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                      <Video className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <p className="text-gray-600 font-medium">Upload Images or Video</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Max 10 images or 1 video • Images: 10MB • Videos: 50MB
                    </p>
                  </div>
                </button>
              </div>

              {/* Media Preview Grid */}
              {postData.media.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {postData.media.map((media) => (
                    <div key={media.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="relative w-full h-full">
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                              muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeMedia(media.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5 text-green-600" />
                Post Description
              </h2>
              
              <textarea
                value={postData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="What's happening at your business? Share updates, news, or special offers..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              
              <div className="flex items-center justify-end mt-2">
                <span className="text-sm text-gray-500">
                  {postData.description.length}/500
                </span>
              </div>
            </div>

            {/* Hashtag Selection Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5 text-blue-600" />
                Select Hashtags
                {postData.selectedHashtags.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {postData.selectedHashtags.length} selected
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Choose hashtags to help customers discover your post
              </p>

              {/* Hashtag Categories */}
              <div className="space-y-4">
                {Object.entries(PREDEFINED_HASHTAGS).map(([category, hashtags]) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 capitalize flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((hashtag) => {
                        const isSelected = postData.selectedHashtags.includes(hashtag);
                        return (
                          <button
                            key={hashtag}
                            onClick={() => toggleHashtagSelection(hashtag)}
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                            }`}
                          >
                            {hashtag}
                            {isSelected && (
                              <span className="ml-1 text-blue-200">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Hashtags Summary */}
              {postData.selectedHashtags.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-blue-800">
                      Selected hashtags ({postData.selectedHashtags.length}):
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {postData.selectedHashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => toggleHashtagSelection(tag)}
                          className="ml-1 text-blue-200 hover:text-white transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    These hashtags will help customers discover your post
                  </p>
                </div>
              )}
            </div>

            {/* Call-to-Action Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-purple-600" />
                Call-to-Action Button
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CTA_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPostData(prev => ({ ...prev, ctaAction: option.value }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      postData.ctaAction === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full py-2 px-3 rounded text-white text-sm font-medium ${option.color}`}>
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-indigo-600" />
                  Customer Feed Preview
                </h2>
                
                {/* Mock Post Preview */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                        M
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">McDonald's - USC Figueroa</p>
                        <p className="text-sm text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                  </div>

                  {/* Post Media */}
                  {postData.media.length > 0 && (
                    <div className="relative">
                      {postData.media[0].type === 'image' ? (
                        <img
                          src={postData.media[0].url}
                          alt="Post preview"
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <div className="relative">
                          <video
                            src={postData.media[0].url}
                            className="w-full h-64 object-cover"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      )}
                      {postData.media.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                          +{postData.media.length - 1} more
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-4">
                    {postData.description && (
                      <div className="mb-3">
                        <p className="text-gray-900 whitespace-pre-wrap mb-3">
                          {postData.description}
                        </p>
                        
                        {/* Show selected hashtags as clickable tags in preview */}
                        {postData.selectedHashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {postData.selectedHashtags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* CTA Button */}
                    {selectedCTA && (
                      <button className={`w-full py-3 px-4 rounded-lg text-white font-medium ${selectedCTA.color} hover:opacity-90 transition-opacity`}>
                        {selectedCTA.label}
                      </button>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-gray-500">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 hover:text-red-500">
                        <span>❤️</span>
                        <span className="text-sm">Like</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-blue-500">
                        <span>💬</span>
                        <span className="text-sm">Comment</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-green-500">
                        <span>📤</span>
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCreation;
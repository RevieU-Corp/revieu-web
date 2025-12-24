import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, Star } from 'lucide-react';

const WriteReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || rating === 0 || !restaurantName.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/home');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-gray-900">Write Review</h1>
        <button
          onClick={handleSubmit}
          disabled={!reviewText.trim() || rating === 0 || !restaurantName.trim() || isSubmitting}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            reviewText.trim() && rating > 0 && restaurantName.trim() && !isSubmitting
              ? 'bg-[#990000] text-white hover:bg-[#770000]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Restaurant Name */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Name
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Where did you eat?"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent"
            />
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Photo Upload */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Add Photo (Optional)
          </label>
          
          {selectedImage ? (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <Camera className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Tap to add photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Review Text */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience... What did you like? What could be better?"
            rows={6}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {reviewText.length}/500 characters
            </span>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Review Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be honest and specific about your experience</li>
            <li>• Mention the food quality, service, and atmosphere</li>
            <li>• Include any special deals or student discounts</li>
            <li>• Help fellow Trojans make informed choices!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WriteReviewPage;
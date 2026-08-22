import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, MessageSquare, Heart, Share2 } from 'lucide-react';

const ReviewsPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => navigate(-1);

    const reviews = [
        {
            id: 1,
            merchant: 'Noda Ramen',
            rating: 5,
            date: '2 hours ago',
            content: 'The Tonkotsu broth was incredibly rich and creamy. Best ramen near USC for sure! 🍜',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
            likes: 12,
            comments: 3,
            pointsEarned: 500
        },
        {
            id: 2,
            merchant: 'Cafe Dulce',
            rating: 4,
            date: 'Yesterday',
            content: 'Love the blueberry donuts! A bit crowded on weekends though.',
            image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=400&q=80',
            likes: 8,
            comments: 1,
            pointsEarned: 350
        }
    ];

    return (
        <div className="bg-[#FBFCFD] min-h-screen pb-20">
            {/* Premium Header */}
            <div className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl z-50 px-6 flex items-center justify-between border-b border-gray-50">
                <button
                    type="button"
                    aria-label="Go back"
                    onClick={handleBack}
                    className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
                >
                    <ChevronLeft aria-hidden="true" className="w-6 h-6 text-gray-900" />
                </button>
                <h1 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">My Reviews</h1>
                <div className="w-10" />
            </div>

            <div className="pt-24 px-6">
                {/* Stats Summary */}
                <div className="bg-gradient-to-br from-[#990000] to-[#E5B80B] rounded-[40px] p-6 shadow-xl shadow-red-100 mb-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12" />
                    <div className="relative z-10 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Contributions</p>
                            <p className="text-4xl font-black italic">42</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Points</p>
                            <p className="text-2xl font-black text-yellow-200">12,450</p>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group active:scale-[0.98] transition-all">
                            {/* Merchant Info & Rating */}
                            <div className="p-5 flex items-center justify-between border-b border-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xs">
                                        {review.merchant[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900">{review.merchant}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex bg-yellow-400/10 px-2 py-1 rounded-lg gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            aria-hidden="true"
                                            className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="p-5">
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {review.content}
                                </p>
                                {review.image && (
                                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                                        <img
                                            src={review.image}
                                            alt={`Review photo from ${review.merchant}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                            +{review.pointsEarned} PTS
                                        </div>
                                    </div>
                                )}

                                {/* Engagement Bar */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex gap-4">
                                        <button type="button" aria-label={`Like review by ${review.merchant}`} className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                            <Heart aria-hidden="true" className="w-4 h-4" />
                                            <span className="text-[11px] font-bold">{review.likes}</span>
                                        </button>
                                        <button type="button" aria-label={`View comments for ${review.merchant}`} className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                                            <MessageSquare aria-hidden="true" className="w-4 h-4" />
                                            <span className="text-[11px] font-bold">{review.comments}</span>
                                        </button>
                                    </div>
                                    <button type="button" aria-label={`Share review by ${review.merchant}`} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-all">
                                        <Share2 aria-hidden="true" className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State / Bottom Tip */}
                <div className="py-12 text-center">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">Sharing is caring • Keep reviewing</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage;

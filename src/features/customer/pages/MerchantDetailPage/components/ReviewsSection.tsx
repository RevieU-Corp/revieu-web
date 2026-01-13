import { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { ReviewListCard } from './ReviewListCard';

interface ReviewsSectionProps {
  onBack?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('#Fresh');
  const filters = ['#Fresh', '#GoodService', '#Cozy', '#Affordable', '#Authentic', '#Quick'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20">
        <div className="flex items-center px-4 h-14">
          <button onClick={onBack} className="mr-3">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Reviews</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Overall Rating Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          {/* Title with gradient bar */}
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-1 h-6 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #FFA500 0%, #DC2626 100%)'
              }}
            />
            <h2 className="font-bold text-lg text-gray-900">Overall Rating</h2>
          </div>

          {/* Rating Content */}
          <div className="flex items-start gap-6">
            {/* Large Rating Number */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-1">4.8</div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-[#FFA500] text-[#FFA500]" />
                ))}
              </div>
              <p className="text-xs text-gray-500">324 reviews</p>
            </div>

            {/* Progress Bars */}
            <div className="flex-1 space-y-3">
              {/* Taste */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Taste</span>
                  <span className="text-sm font-bold text-gray-900">4.9</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{
                      width: '98%',
                      background: 'linear-gradient(90deg, #FFA500 0%, #FF8C00 100%)'
                    }}
                  />
                </div>
              </div>

              {/* Environment */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Environment</span>
                  <span className="text-sm font-bold text-gray-900">4.7</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{
                      width: '94%',
                      background: 'linear-gradient(90deg, #FFA500 0%, #FF8C00 100%)'
                    }}
                  />
                </div>
              </div>

              {/* Service */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Service</span>
                  <span className="text-sm font-bold text-gray-900">4.8</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{
                      width: '96%',
                      background: 'linear-gradient(90deg, #FFA500 0%, #FF8C00 100%)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-orange-50 text-[#FFA500] border-2 border-[#FFA500]'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Review List */}
        <div className="space-y-3">
          <ReviewListCard
            username="Sarah Johnson"
            avatar="👩‍🦰"
            rating={5}
            tasteScore={5.0}
            envScore={4.8}
            serviceScore={5.0}
            date="3 days ago"
            comment="Absolutely amazing experience! The food was incredibly fresh and flavorful. The orange chicken is a must-try - perfectly crispy with just the right amount of sauce."
            tags={['#Fresh', '#GoodService', '#Authentic']}
            images={[
              "https://images.unsplash.com/photo-1758275682464-ddd906bf34fe?w=200&q=80",
              "https://images.unsplash.com/photo-1767429013002-69b35cb45395?w=200&q=80",
              "https://images.unsplash.com/photo-1652937916838-09b9c2ff8b45?w=200&q=80"
            ]}
            helpful={47}
          />
          <ReviewListCard
            username="Michael Chen"
            avatar="👨"
            rating={5}
            tasteScore={5.0}
            envScore={5.0}
            serviceScore={4.5}
            date="1 week ago"
            comment="Best Chinese restaurant near campus! The portions are generous and the quality is consistently excellent. Great spot for a quick lunch between classes."
            tags={['#Affordable', '#Quick', '#Fresh']}
            helpful={32}
          />
          <ReviewListCard
            username="Emily Rodriguez"
            avatar="👩"
            rating={4}
            tasteScore={4.5}
            envScore={4.0}
            serviceScore={4.5}
            date="2 weeks ago"
            comment="Really enjoyed the noodle dishes here. The atmosphere is nice and cozy, perfect for studying or catching up with friends. Service can be a bit slow during peak hours though."
            tags={['#Cozy', '#GoodService']}
            images={[
              "https://images.unsplash.com/photo-1630914441934-a29bf360934c?w=200&q=80"
            ]}
            helpful={28}
          />
          <ReviewListCard
            username="David Park"
            avatar="🧑"
            rating={5}
            tasteScore={5.0}
            envScore={4.5}
            serviceScore={5.0}
            date="3 weeks ago"
            comment="The staff here are so friendly and remember regular customers. Food quality is top-notch and they're always consistent. Highly recommend the lunch combos!"
            tags={['#GoodService', '#Affordable', '#Authentic']}
            helpful={51}
          />
          <ReviewListCard
            username="Lisa Wang"
            avatar="👱‍♀️"
            rating={5}
            tasteScore={4.8}
            envScore={4.7}
            serviceScore={5.0}
            date="1 month ago"
            comment="Love this place! The dumplings are handmade and you can taste the difference. Clean environment and great value for money. Will definitely be back!"
            tags={['#Fresh', '#Cozy', '#Authentic']}
            images={[
              "https://images.unsplash.com/photo-1763689389824-dd2cea2e5772?w=200&q=80",
              "https://images.unsplash.com/photo-1767429013002-69b35cb45395?w=200&q=80"
            ]}
            helpful={39}
          />
        </div>
      </div>
    </div>
  );
};
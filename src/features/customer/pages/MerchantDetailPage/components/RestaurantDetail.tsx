import { useState } from 'react';
import { Phone, MapPin, Star, ChevronRight, Flame, FileText } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { DealCard } from './DealCard';
import { GlossyBottomNav } from './GlossyBottomNav';
import { MealDealCard } from './MealDealCard';
import { TimeDealCard } from './TimeDealCard';
import { ReviewCard } from './ReviewCard';
import { PopDishCard } from './PopDishCard';
import { MenuUploadWidget } from './MenuUploadWidget';

interface RestaurantDetailProps {
  onBack?: () => void;
  onViewAllReviews?: () => void;
  onWriteReview?: () => void;
}

export function RestaurantDetail({ onBack, onViewAllReviews, onWriteReview }: RestaurantDetailProps) {
  const [activeTab, setActiveTab] = useState<'deals' | 'menu' | 'reviews'>('deals');

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* Top Banner with Food Photography */}
      <div className="relative w-full h-64">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
          alt="Delicious food"
          className="w-full h-full object-cover"
        />
        {/* Circular Logo Overlay */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-24 h-24 rounded-full bg-white shadow-xl border-4 border-white overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80"
              alt="Northern Cafe Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-6 pt-16 pb-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Northern Cafe</h1>
        
        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-1 bg-[#FFA500] px-3 py-1 rounded-full">
            <Star className="w-5 h-5 fill-white text-white" />
            <span className="text-white font-bold text-lg">4.8</span>
          </div>
        </div>

        {/* Address and Phone */}
        <div className="space-y-2">
          <div className="flex items-start gap-3 text-gray-600">
            <MapPin className="w-5 h-5 mt-0.5 text-[#FFA500] flex-shrink-0" />
            <span className="text-sm">123 N Tryon St, Charlotte, NC 28202</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-5 h-5 text-[#FFA500] flex-shrink-0" />
            <span className="text-sm">(704) 555-0123</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6">
        <button
          onClick={() => setActiveTab('deals')}
          className={`flex-1 py-3 text-center font-semibold transition-colors relative ${
            activeTab === 'deals' ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          Deals
          {activeTab === 'deals' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-1 py-3 text-center font-semibold transition-colors relative ${
            activeTab === 'menu' ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          Menu
          {activeTab === 'menu' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 py-3 text-center font-semibold transition-colors relative ${
            activeTab === 'reviews' ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          Reviews
          {activeTab === 'reviews' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
        {activeTab === 'deals' ? (
          <div className="space-y-6">
            {/* Special Time Deals */}
            <div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">⚡ Flash Deals</h3>
              <div className="space-y-3">
                <TimeDealCard
                  title="Happy Hour Special"
                  discount="50% OFF"
                  timeRange="2:00 PM - 5:00 PM"
                  description="Get half off on all drinks and appetizers during happy hour!"
                />
                <TimeDealCard
                  title="Breakfast Rush"
                  discount="30% OFF"
                  timeRange="7:00 AM - 10:00 AM"
                  description="Early bird gets the deal! Breakfast combos at amazing prices."
                />
              </div>
            </div>

            {/* Combo Deals */}
            <div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Combo Deals</h3>
              <div className="space-y-3">
                <MealDealCard
                  image="https://images.unsplash.com/photo-1763689389824-dd2cea2e5772?w=400&q=80"
                  title="Lunch Combo A"
                  price="12.99"
                  oldPrice="18.99"
                  description="Orange chicken, fried rice, and egg roll"
                />
                <MealDealCard
                  image="https://images.unsplash.com/photo-1652937916838-09b9c2ff8b45?w=400&q=80"
                  title="Noodle Special"
                  price="10.99"
                  oldPrice="15.99"
                  description="Choice of noodles with vegetables and protein"
                />
                <MealDealCard
                  image="https://images.unsplash.com/photo-1630914441934-a29bf360934c?w=400&q=80"
                  title="Family Feast"
                  price="35.99"
                  oldPrice="49.99"
                  description="3 entrees, 2 sides, 4 spring rolls"
                />
              </div>
            </div>

            {/* Coupons */}
            <div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Coupons</h3>
              <div className="space-y-3">
                <DealCard
                  id="deal-new-user-special"
                  value="$100"
                  title="New User Special"
                  description="Valid for first-time customers on orders above $120"
                  expiry="Valid until Jan 31, 2026"
                  type="free"
                  merchantId="merchant-123"
                />
                <DealCard
                  id="deal-student-mega"
                  value="$50"
                  title="Student Mega Deal"
                  description="USC students only - show your Trojan ID at checkout"
                  expiry="Valid until Feb 28, 2026"
                  type="free"
                  merchantId="merchant-123"
                />
                <DealCard
                  id="deal-family-bundle"
                  value="$90"
                  title="Family Bundle Savings"
                  description="For orders over $200 - perfect for group dining"
                  expiry="Valid until Feb 15, 2026"
                  type="paid"
                  price={15}
                  merchantId="merchant-123"
                />
                <DealCard
                  id="deal-lunch-special"
                  value="$45"
                  title="Lunch Hour Special"
                  description="Available weekdays 11 AM - 2 PM on orders $80+"
                  expiry="Valid until Jan 25, 2026"
                  type="free"
                  merchantId="merchant-123"
                />
              </div>
            </div>
          </div>
        ) : activeTab === 'menu' ? (
          <div className="space-y-6">
            {/* Pop Dishes Section */}
            <div>
              <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
                <Flame className="w-6 h-6 text-[#FFA500]" />
                Pop Dishes
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <PopDishCard
                  image="https://images.unsplash.com/photo-1758275682464-ddd906bf34fe?w=400&q=80"
                  name="Orange Chicken"
                  price="13.99"
                  rating={4.9}
                  reviews={156}
                  likes={243}
                  description="Crispy chicken in tangy orange sauce"
                />
                <PopDishCard
                  image="https://images.unsplash.com/photo-1767429013002-69b35cb45395?w=400&q=80"
                  name="Kung Pao Shrimp"
                  price="15.99"
                  rating={4.8}
                  reviews={124}
                  likes={198}
                  description="Spicy shrimp with peanuts and vegetables"
                />
                <PopDishCard
                  image="https://images.unsplash.com/photo-1652937916838-09b9c2ff8b45?w=400&q=80"
                  name="Beef Chow Mein"
                  price="12.99"
                  rating={4.7}
                  reviews={98}
                  likes={167}
                  description="Stir-fried noodles with tender beef"
                />
                <PopDishCard
                  image="https://images.unsplash.com/photo-1763689389824-dd2cea2e5772?w=400&q=80"
                  name="Fried Rice Special"
                  price="11.99"
                  rating={4.8}
                  reviews={142}
                  likes={221}
                  description="Classic fried rice with egg and vegetables"
                />
              </div>
            </div>

            {/* Menu Upload Widget */}
            <div>
              <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#FFA500]" />
                Full Menu
              </h3>
              <MenuUploadWidget />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overall Rating Summary */}
            <div className="bg-gradient-to-br from-[#FFA500] to-[#FF8C00] rounded-2xl p-6 text-white text-center">
              <div className="text-5xl font-bold mb-2">4.8</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-white text-white" />
                ))}
              </div>
              <p className="text-sm opacity-90">Based on 324 reviews</p>
            </div>

            {/* View All Reviews Button */}
            <button 
              onClick={onViewAllReviews}
              className="w-full bg-white border-2 border-[#FFA500] text-[#FFA500] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-all"
            >
              View All Reviews
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Reviews List */}
            <div className="space-y-3">
              <ReviewCard
                username="Jessica Wang"
                avatar="👩"
                rating={5}
                date="2 days ago"
                comment="Amazing food! The orange chicken is perfectly crispy and the sauce is delicious. Service was fast and friendly. Definitely coming back!"
                helpful={24}
                images={[
                  "https://images.unsplash.com/photo-1758275682464-ddd906bf34fe?w=200&q=80",
                  "https://images.unsplash.com/photo-1767429013002-69b35cb45395?w=200&q=80"
                ]}
              />
              <ReviewCard
                username="David Chen"
                avatar="👨"
                rating={5}
                date="5 days ago"
                comment="Best Chinese food near campus! Portions are generous and prices are student-friendly. The lunch combo is a steal!"
                helpful={18}
              />
              <ReviewCard
                username="Emily Rose"
                avatar="🙋‍♀️"
                rating={4}
                date="1 week ago"
                comment="Great spot for quick lunch between classes. The noodles are always fresh and flavorful. Only minor complaint is it can get crowded during peak hours."
                helpful={12}
              />
              <ReviewCard
                username="Marcus Lee"
                avatar="🧑"
                rating={5}
                date="2 weeks ago"
                comment="The student discount makes this place unbeatable! Food quality is consistently good and staff remembers regulars."
                helpful={31}
              />
            </div>
          </div>
        )}
      </div>

      {/* Glossy Bottom Navigation */}
      <GlossyBottomNav onBack={onBack} onWriteReview={onWriteReview} />
    </div>
  );
}

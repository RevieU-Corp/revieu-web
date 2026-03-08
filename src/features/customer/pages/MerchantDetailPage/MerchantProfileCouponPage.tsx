import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronDown, Heart, MapPin, Phone, Star, ThumbsUp } from 'lucide-react';
import { ImageWithFallback } from './components/ImageWithFallback';

type CouponTab = 'deal' | 'menu' | 'review';
type ReviewFilter = 'Hot' | 'Bad' | 'Recent';

interface CouponDeal {
  id: string;
  brand: string;
  logo: string;
  distance: string;
  originalPrice: string;
  salePrice: string;
  timer?: string;
}

interface PopDish {
  id: string;
  title: string;
  image: string;
}

interface CouponReview {
  id: string;
  score: number;
  body: string;
  likes: number;
  images: string[];
}

interface MerchantCouponLocationState {
  merchantName?: string;
}

const HERO_IMAGES: Record<CouponTab, string> = {
  deal: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  menu: 'https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=1200&q=80',
  review: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=1200&q=80',
};

const FLASH_DEALS: CouponDeal[] = [
  {
    id: 'flash-1',
    brand: 'Starbuck',
    logo: 'https://logo.clearbit.com/starbucks.com',
    distance: '0.1 Miles',
    originalPrice: '55$',
    salePrice: '45$',
    timer: '00:00:45',
  },
  {
    id: 'flash-2',
    brand: "Jimmy John's",
    logo: 'https://logo.clearbit.com/jimmyjohns.com',
    distance: '0.1 Miles',
    originalPrice: '55$',
    salePrice: '45$',
    timer: '00:00:45',
  },
];

const COMBO_DEALS: CouponDeal[] = [
  {
    id: 'combo-1',
    brand: 'Starbuck',
    logo: 'https://logo.clearbit.com/starbucks.com',
    distance: '0.1 Miles',
    originalPrice: '55$',
    salePrice: '45$',
  },
  {
    id: 'combo-2',
    brand: 'Starbuck',
    logo: 'https://logo.clearbit.com/starbucks.com',
    distance: '0.1 Miles',
    originalPrice: '55$',
    salePrice: '45$',
  },
];

const POP_DISHES: PopDish[] = [
  {
    id: 'dish-1',
    title: 'Salmon Salad',
    image: 'https://images.unsplash.com/photo-1611690655777-1f0b9e2f1602?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'dish-2',
    title: 'Salmon Salad',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'dish-3',
    title: 'Greek salad',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'dish-4',
    title: 'Red hot pizza',
    image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=900&q=80',
  },
];

const REVIEW_CARDS: CouponReview[] = [
  {
    id: 'review-1',
    score: 5,
    likes: 22,
    body: 'Really convenient and the points system helps benefit loyalty. Some mild glitches here and there, but nothing too egregious. Obviously needs to roll out to more remote.',
    images: [
      'https://images.unsplash.com/photo-1611690655777-1f0b9e2f1602?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=300&q=80',
    ],
  },
  {
    id: 'review-2',
    score: 5,
    likes: 22,
    body: 'Really convenient and the points system helps benefit loyalty. Some mild glitches here and there, but nothing too egregious. Obviously needs to roll out to more remote.',
    images: [
      'https://images.unsplash.com/photo-1611690655777-1f0b9e2f1602?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=300&q=80',
    ],
  },
];

interface StarMeterProps {
  score: number;
  compact?: boolean;
}

const StarMeter: React.FC<StarMeterProps> = ({ score, compact = false }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          strokeWidth={1.8}
          className={`${
            star <= Math.floor(score) ? 'fill-[#f8be2e] text-[#f8be2e]' : 'fill-transparent text-[#f8be2e]'
          } ${compact ? 'h-4 w-4' : 'h-10 w-10'}`}
        />
      ))}
    </div>
  );
};

interface DealRowProps {
  deal: CouponDeal;
}

const DealRow: React.FC<DealRowProps> = ({ deal }) => {
  return (
    <article className="rounded-2xl border border-[#efeff1] bg-white px-4 py-3 shadow-[0_7px_18px_rgba(15,23,42,0.05)]">
      <div className="mb-3 flex items-center justify-between text-xs">
        <div>
          {deal.timer ? (
            <span className="rounded-full bg-[#f8e4a3] px-3 py-1 font-bold tracking-wide text-[#9a7a16]">
              {deal.timer}
            </span>
          ) : null}
        </div>
        <span className="font-semibold text-[#37ae60]">{deal.distance}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f8f9]">
          <ImageWithFallback src={deal.logo} alt={deal.brand} className="h-10 w-10 rounded-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-semibold text-[#252934]">{deal.brand}</p>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-xl text-[#c5c7cd] line-through">{deal.originalPrice}</span>
          <span className="text-[2rem] font-semibold leading-none text-[#ff4a4a]">{deal.salePrice}</span>
        </div>
      </div>
    </article>
  );
};

interface PopDishTileProps {
  dish: PopDish;
}

const PopDishTile: React.FC<PopDishTileProps> = ({ dish }) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#ececef] bg-white shadow-[0_6px_16px_rgba(15,23,42,0.06)]">
      <div className="relative h-32">
        <ImageWithFallback src={dish.image} alt={dish.title} className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#2f3138]">
          {dish.title}
        </span>
      </div>
    </article>
  );
};

interface ReviewCardProps {
  review: CouponReview;
}

const CouponReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <article className="rounded-2xl border border-[#ececef] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[1.7rem] font-semibold leading-none text-[#252934]">Review</p>
        <StarMeter score={review.score} compact />
      </div>
      <p className="text-[15px] leading-7 text-[#858a94]">{review.body}</p>
      <div className="mt-4 flex items-center gap-2">
        {review.images.map((image) => (
          <ImageWithFallback
            key={image}
            src={image}
            alt="Review"
            className="h-14 w-14 rounded-2xl border border-[#efeff1] object-cover"
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        {['active', 'dot', 'dot', 'dot', 'dot'].map((dot, index) => (
          <span
            key={`${review.id}-${index}`}
            className={dot === 'active' ? 'h-2 w-2 rounded-full bg-[#cf1c1c]' : 'h-2 w-2 rounded-full bg-[#d7d8dd]'}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-[#a3a6af]">
        <ThumbsUp className="h-4 w-4 fill-[#cf1c1c] text-[#cf1c1c]" />
        <span className="text-sm">{review.likes}</span>
      </div>
    </article>
  );
};

const MerchantProfileCouponPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<CouponTab>('deal');
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('Hot');
  const [showReviewFilter, setShowReviewFilter] = useState(false);

  const merchantName = ((location.state as MerchantCouponLocationState | null)?.merchantName || 'Ground Beef Tacos').trim();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white pb-24 pt-4">
      <div className="mx-auto w-full max-w-[430px] px-4">
        <div className="rounded-[22px] border border-[#ececef] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <div className="relative h-56 overflow-hidden rounded-2xl">
            <ImageWithFallback src={HERO_IMAGES[activeTab]} alt="Merchant hero" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={goBack}
              className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-[#292e38] shadow-md"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[2.65rem] font-semibold leading-none tracking-tight text-[#2b303b]">{merchantName}</h2>
              <div className="flex shrink-0 items-center gap-1.5">
                <Star className="h-5 w-5 fill-[#f8be2e] text-[#f8be2e]" />
                <span className="text-lg font-semibold text-[#2d313a]">4.5</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-lg text-[#8d919a]">
              <p>
                Open time: <span className="font-medium text-[#f46a4d]">am 8:00-pm 9:00</span>
              </p>
              <div className="flex items-center gap-2">
                <span>123-156-7809</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c71818] text-white">
                  <Phone className="h-4 w-4" />
                </span>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-2 text-lg text-[#8d919a]">
              <MapPin className="h-5 w-5 text-[#8d919a]" />
              123 street 567 ave
            </p>
          </div>

          <div className="mt-6 rounded-full border border-[#ebebed] bg-[#f9f9fa] p-1.5">
            <div className="grid grid-cols-3 gap-1">
              {(['deal', 'menu', 'review'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setShowReviewFilter(false);
                    }}
                    className={`rounded-full px-2 py-2 text-base font-semibold capitalize transition ${
                      isActive
                        ? 'bg-gradient-to-b from-[#d51f1f] to-[#aa0505] text-white shadow-[0_8px_14px_rgba(183,13,13,0.32)]'
                        : 'text-[#cc1f1f]'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === 'deal' ? (
            <div className="mt-6 space-y-5">
              <section>
                <h3 className="mb-3 text-[2rem] font-semibold tracking-tight text-[#2c3039]">Flash Deal</h3>
                <div className="space-y-3">
                  {FLASH_DEALS.map((deal) => (
                    <DealRow key={deal.id} deal={deal} />
                  ))}
                </div>
              </section>
              <section>
                <h3 className="mb-3 text-[2rem] font-semibold tracking-tight text-[#2c3039]">Combol</h3>
                <div className="space-y-3">
                  {COMBO_DEALS.map((deal) => (
                    <DealRow key={deal.id} deal={deal} />
                  ))}
                </div>
              </section>
            </div>
          ) : null}

          {activeTab === 'menu' ? (
            <div className="mt-6 space-y-5">
              <section>
                <h3 className="mb-3 text-[2rem] font-semibold tracking-tight text-[#2c3039]">Pop Dish</h3>
                <div className="grid grid-cols-2 gap-3">
                  {POP_DISHES.map((dish) => (
                    <PopDishTile key={dish.id} dish={dish} />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-[2rem] font-semibold tracking-tight text-[#2c3039]">Menu</h3>
                <article className="overflow-hidden rounded-2xl border border-[#ececef] bg-white shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
                      alt="Chicken Hawaiian"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-2xl font-bold text-[#f07942]">
                      $10.35
                    </span>
                    <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7b5f] text-white shadow-md">
                      <Heart className="h-5 w-5 fill-white text-white" />
                    </span>
                    <span className="absolute bottom-3 left-3 rounded-full bg-white px-2 py-1 text-sm font-bold text-[#242a33] shadow-sm">
                      4.5 (25+)
                    </span>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-2xl font-semibold text-[#252934]">Chicken Hawaiian</p>
                    <p className="mt-1 text-lg text-[#7f8490]">Chicken, Cheese and pineapple</p>
                  </div>
                </article>
              </section>
            </div>
          ) : null}

          {activeTab === 'review' ? (
            <div className="mt-6 space-y-5">
              <section className="rounded-2xl border border-[#e8e8eb] bg-white px-4 py-4 text-center">
                <p className="text-[2.2rem] font-medium text-[#2e3340]">overall 4.5</p>
                <div className="mt-3 flex justify-center">
                  <StarMeter score={4.5} />
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[2.2rem] font-semibold leading-none tracking-tight text-[#2c3039]">Coupon Review</h3>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowReviewFilter((prev) => !prev)}
                      className="flex items-center gap-2 rounded-full bg-[#f3eded] px-4 py-1.5 text-lg font-semibold text-[#cc1f1f]"
                    >
                      {reviewFilter}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {showReviewFilter ? (
                      <div className="absolute right-0 top-11 z-20 min-w-[140px] rounded-2xl border border-[#ececef] bg-white py-1 shadow-lg">
                        {(['Hot', 'Bad', 'Recent'] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setReviewFilter(option);
                              setShowReviewFilter(false);
                            }}
                            className="flex w-full items-center justify-between px-4 py-2 text-left text-lg text-[#30343d] hover:bg-[#f8f8f9]"
                          >
                            <span>{option}</span>
                            {reviewFilter === option ? <Check className="h-4 w-4 text-[#cc1f1f]" /> : null}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-3">
                  {REVIEW_CARDS.map((review) => (
                    <CouponReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MerchantProfileCouponPage;

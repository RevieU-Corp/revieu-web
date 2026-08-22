import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ChevronDown, Heart, MapPin, Phone, Star, ThumbsUp } from 'lucide-react';
import { apiClient } from '../../../../api/apiClient';
import { ImageWithFallback } from './components/ImageWithFallback';
import { couponService } from '../../shared/services/couponService';
import { Coupon, MerchantInfo } from '../../shared/types/coupons';
import { DealCard } from './components/DealCard';

type CouponTab = 'deal' | 'menu' | 'review';
type ReviewFilter = 'Hot' | 'Bad' | 'Recent';

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
  initialTab?: CouponTab;
}

interface BackendStoreDetail {
  id: number | string;
  merchant_id: number | string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  phone?: string | null;
  cover_image_url?: string | null;
}

interface LiveStoreDetail {
  id: string;
  merchantId: string;
  name: string;
  address: string;
  phone: string;
  coverImageUrl: string;
}

type MerchantTheme = 'coffee' | 'pizza' | 'mexican' | 'healthy' | 'asian' | 'dessert' | 'grocery' | 'default';

interface MerchantMenuTemplate {
  dishes: string[];
  descriptions: string[];
  address: string;
  openTime: string;
}

interface MerchantCouponContent {
  heroImages: Record<CouponTab, string>;
  popDishes: PopDish[];
  reviews: CouponReview[];
  menuBoard: {
    title: string;
    image: string;
    items: Array<{ name: string; price: string }>;
  };
  overallScore: number;
  phone: string;
  address: string;
  openTime: string;
}

const THEME_TEMPLATES: Record<MerchantTheme, MerchantMenuTemplate> = {
  coffee: {
    dishes: ['Oat Milk Latte', 'Caramel Cold Brew', 'Matcha Cream Top', 'Iced Mocha'],
    descriptions: ['Smooth espresso with oat milk foam', 'Slow-steeped coffee with caramel drizzle', 'Ceremonial matcha with cream cap', 'Dark chocolate espresso over ice'],
    address: '901 Coffee Ave',
    openTime: 'am 7:00-pm 10:00',
  },
  pizza: {
    dishes: ['Pepperoni Fire Slice', 'Truffle Mushroom Pie', 'Hawaiian Chicken', 'Four Cheese Crispy'],
    descriptions: ['Wood-fired crust with spicy pepperoni', 'Truffle oil with roasted mushrooms', 'Sweet pineapple with grilled chicken', 'Mozzarella blend on thin crust'],
    address: '227 Pizza Street',
    openTime: 'am 11:00-pm 11:00',
  },
  mexican: {
    dishes: ['Al Pastor Tacos', 'Chipotle Burrito Bowl', 'Street Corn Nachos', 'Chicken Quesadilla'],
    descriptions: ['Marinated pork with pineapple salsa', 'Rice bowl with smoky chipotle sauce', 'Loaded nachos with cotija and lime', 'Grilled tortilla with melted jack cheese'],
    address: '135 Fiesta Blvd',
    openTime: 'am 10:30-pm 9:30',
  },
  healthy: {
    dishes: ['Greek Chicken Bowl', 'Salmon Super Salad', 'Protein Avo Toast', 'Quinoa Veggie Mix'],
    descriptions: ['Herb chicken with cucumber and feta', 'Grilled salmon over mixed greens', 'Smashed avocado with poached egg', 'Quinoa with roasted seasonal vegetables'],
    address: '456 Green Lane',
    openTime: 'am 8:00-pm 9:00',
  },
  asian: {
    dishes: ['Spicy Tonkotsu Ramen', 'Orange Chicken Plate', 'Garlic Noodle Box', 'Sichuan Dumplings'],
    descriptions: ['Rich pork broth with chili oil', 'Crispy chicken in citrus glaze', 'Wok-tossed noodles with garlic butter', 'Pork dumplings in red chili sauce'],
    address: '88 Noodle Road',
    openTime: 'am 10:00-pm 10:00',
  },
  dessert: {
    dishes: ['Sea Salt Ice Cream', 'Tiramisu Cup', 'Strawberry Waffle', 'Chocolate Lava Slice'],
    descriptions: ['Creamy vanilla with sea salt flakes', 'Coffee soaked layers with mascarpone', 'Fresh berries over crisp waffle', 'Warm chocolate center cake'],
    address: '320 Sweet Plaza',
    openTime: 'am 11:00-pm 10:30',
  },
  grocery: {
    dishes: ['Fresh Fruit Box', 'Signature Sandwich Set', 'Organic Salad Pack', 'Ready Pasta Meal'],
    descriptions: ['Seasonal fruit curated daily', 'Turkey and cheese deli sandwich', 'Mixed greens with house vinaigrette', 'Microwave-ready pasta with tomato sauce'],
    address: '75 Market Square',
    openTime: 'am 8:00-pm 10:00',
  },
  default: {
    dishes: ['Signature Combo', 'House Special', 'Chef Recommendation', 'Classic Favorite'],
    descriptions: ['Most ordered item this week', 'Balanced flavor profile and texture', 'Chef-crafted house selection', 'A timeless customer favorite'],
    address: '123 street 567 ave',
    openTime: 'am 8:00-pm 9:00',
  },
};

const MENU_BOARD_IMAGES = [
  'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80',
];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function inferTheme(merchantName: string): MerchantTheme {
  const text = merchantName.toLowerCase();
  if (text.includes('starbuck') || text.includes('coffee') || text.includes('cafe') || text.includes('boba')) return 'coffee';
  if (text.includes('pizza')) return 'pizza';
  if (text.includes('chipotle') || text.includes('mexican') || text.includes('taco') || text.includes('burrito')) return 'mexican';
  if (text.includes('healthy') || text.includes('salad') || text.includes('bowl') || text.includes('cava') || text.includes('organic')) return 'healthy';
  if (text.includes('panda') || text.includes('chinese') || text.includes('asian') || text.includes('ramen') || text.includes('sushi')) return 'asian';
  if (text.includes('dessert') || text.includes('cream') || text.includes('sweet') || text.includes('bakery')) return 'dessert';
  if (text.includes('target') || text.includes('trader') || text.includes('market') || text.includes('grocery')) return 'grocery';
  return 'default';
}

function toPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

function getDishFoodImage(dishName: string): string {
  const normalizedDish = dishName.toLowerCase();
  if (normalizedDish.includes('protein avo toast') || normalizedDish.includes('avo toast')) {
    return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80';
  }
  if (normalizedDish.includes('salmon super salad') || normalizedDish.includes('salmon salad')) {
    return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80';
  }
  if (normalizedDish.includes('quinoa veggie mix') || normalizedDish.includes('quinoa')) {
    return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80';
  }
  if (normalizedDish.includes('tiramisu cup') || normalizedDish.includes('tiramisu')) {
    return 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80';
  }
  if (normalizedDish.includes('strawberry waffle') || normalizedDish.includes('waffle')) {
    return 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=1200&q=80';
  }
  if (normalizedDish.includes('chocolate lava slice') || normalizedDish.includes('lava')) {
    return 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80';
  }
  if (normalizedDish.includes('sea salt ice cream') || normalizedDish.includes('ice cream')) {
    return 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80';
  }

  const seed = hashSeed(normalizedDish);
  const query = encodeURIComponent(`${dishName} delicious food`);
  // Same dish name maps to the same image URL across deal/menu sections.
  return `https://source.unsplash.com/1200x900/?${query}&sig=${seed}`;
}

function buildMerchantCouponContent(merchantName: string): MerchantCouponContent {
  const safeName = merchantName || 'Ground Beef Tacos';
  const lowerName = safeName.toLowerCase();
  const isSunLifeOrganics = lowerName.includes('sunlife');
  const theme = inferTheme(safeName);
  const template = THEME_TEMPLATES[theme];
  const seed = hashSeed(safeName);

  const popDishes: PopDish[] = template.dishes.map((title, index) => ({
    id: `${safeName}-dish-${index}`,
    title,
    image: getDishFoodImage(title),
  }));

  const reviews: CouponReview[] = [0, 1, 2].map((index) => {
    const firstDish = template.dishes[index % template.dishes.length];
    const secondDish = template.dishes[(index + 1) % template.dishes.length];
    const score = 4 + ((seed + index) % 2);
    return {
      id: `${safeName}-review-${index}`,
      score,
      likes: 12 + ((seed + index * 9) % 40),
      body: `Tried ${firstDish} and ${secondDish} at ${safeName}. Flavor was balanced, portion size was solid, and the combo value made it worth coming back.`,
      images: [],
    };
  });

  const menuBoardItems = template.dishes.map((dish, index) => ({
    name: dish,
    price: toPrice(9 + ((seed + index * 2) % 9)),
  }));

  return {
    heroImages: {
      deal: isSunLifeOrganics
        ? 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80'
        : '',
      menu: isSunLifeOrganics
        ? 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80'
        : '',
      review: isSunLifeOrganics
        ? 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'
        : '',
    },
    popDishes,
    reviews,
    menuBoard: {
      title: `${safeName} Menu`,
      image: isSunLifeOrganics
        ? 'https://images.unsplash.com/photo-1623428454614-abaf41ee97af?auto=format&fit=crop&w=1200&q=80'
        : MENU_BOARD_IMAGES[seed % MENU_BOARD_IMAGES.length],
      items: menuBoardItems,
    },
    overallScore: Number((4.1 + ((seed % 9) * 0.1)).toFixed(1)),
    phone: `213-55${String(10 + (seed % 90)).padStart(2, '0')}-${String(1000 + (seed % 9000)).padStart(4, '0')}`,
    address: template.address,
    openTime: template.openTime,
  };
}

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
  const { id: merchantId } = useParams();
  const locationState = location.state as MerchantCouponLocationState | null;
  const initialTab = locationState?.initialTab;
  const [activeTab, setActiveTab] = useState<CouponTab>(initialTab || 'deal');
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('Hot');
  const [showReviewFilter, setShowReviewFilter] = useState(false);
  const [liveStore, setLiveStore] = useState<LiveStoreDetail | null>(null);
  const [liveCoupons, setLiveCoupons] = useState<Coupon[]>([]);
  const [liveDataLoading, setLiveDataLoading] = useState(true);
  const [liveDataError, setLiveDataError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadLiveData = async () => {
      if (!merchantId) {
        setLiveDataLoading(false);
        setLiveDataError('Store id is missing.');
        return;
      }

      setLiveDataLoading(true);
      setLiveDataError(null);
      setLiveStore(null);
      setLiveCoupons([]);

      const [storeResult, couponResult] = await Promise.allSettled([
        apiClient.get(`/stores/${merchantId}`),
        couponService.getAvailableCoupons(merchantId, ''),
      ]);

      if (cancelled) {
        return;
      }

      const errors: string[] = [];
      if (storeResult.status === 'fulfilled') {
        const raw = (storeResult.value.data?.data ?? storeResult.value.data) as BackendStoreDetail;
        const address = [raw.address, raw.city, raw.state, raw.country].filter(Boolean).join(', ');
        setLiveStore({
          id: String(raw.id),
          merchantId: String(raw.merchant_id),
          name: raw.name,
          address: address || 'Address unavailable',
          phone: raw.phone ?? '',
          coverImageUrl: raw.cover_image_url ?? '',
        });
      } else {
        errors.push('Live store details are unavailable.');
      }

      if (couponResult.status === 'fulfilled') {
        setLiveCoupons(couponResult.value);
      } else {
        setLiveCoupons([]);
        errors.push('Live coupons are unavailable.');
      }

      setLiveDataError(errors.length > 0 ? errors.join(' ') : null);
      setLiveDataLoading(false);
    };

    void loadLiveData();

    return () => {
      cancelled = true;
    };
  }, [merchantId]);

  const merchantName = (liveStore?.name || locationState?.merchantName || 'Merchant Preview').trim();
  const couponContent = useMemo(() => buildMerchantCouponContent(merchantName), [merchantName]);

  const goBack = () => {
    navigate(-1);
  };

  const merchantInfo: MerchantInfo = {
    id: liveStore?.merchantId || liveCoupons[0]?.merchantId || '',
    name: merchantName,
    logo: '',
    address: liveStore?.address || couponContent.address,
    phone: liveStore?.phone || couponContent.phone,
  };

  return (
    <div className="min-h-screen bg-white pb-24 pt-4">
      <div className="mx-auto w-full max-w-[430px] px-4">
        <div className="rounded-[22px] border border-[#ececef] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <div className="relative h-56 overflow-hidden rounded-2xl">
            <ImageWithFallback src={liveStore?.coverImageUrl || couponContent.heroImages[activeTab]} alt={`${merchantName} hero`} className="h-full w-full object-cover" />
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
                <span className="text-lg font-semibold text-[#2d313a]">{couponContent.overallScore}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-lg text-[#8d919a]">
              <p>
                Open time: <span className="font-medium text-[#f46a4d]">{couponContent.openTime}</span>
              </p>
              <div className="flex items-center gap-2">
                <span>{couponContent.phone}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c71818] text-white">
                  <Phone className="h-4 w-4" />
                </span>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-2 text-lg text-[#8d919a]">
              <MapPin className="h-5 w-5 text-[#8d919a]" />
              {couponContent.address}
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
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-[2rem] font-semibold tracking-tight text-[#2c3039]">Live Coupons</h3>
                  {liveDataLoading ? <span className="text-sm text-[#8d919a]">Loading…</span> : null}
                </div>
                {liveDataError ? (
                  <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {liveDataError}
                  </div>
                ) : null}
                {!liveDataLoading && !liveDataError && liveCoupons.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#e1e2e6] bg-[#fafafa] px-4 py-8 text-center text-sm text-[#7f8490]">
                    No live coupons are available for this store yet.
                  </div>
                ) : null}
                <div className="space-y-3">
                  {liveCoupons.map((coupon) => (
                    <DealCard
                      key={coupon.id}
                      id={coupon.id}
                      title={coupon.title}
                      description={coupon.description}
                      imageUrl={coupon.imageUrl}
                      expiry={`Valid until ${coupon.expiryDate.toLocaleDateString('en-US')}`}
                      expiryDate={coupon.expiryDate}
                      value={coupon.value || (coupon.price ? `$${coupon.price}` : 'FREE')}
                      type={coupon.type}
                      price={coupon.price}
                      merchantId={coupon.merchantId}
                      usageInstructions={coupon.usageInstructions}
                      merchantInfo={merchantInfo}
                    />
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
                  {couponContent.popDishes.map((dish) => (
                    <PopDishTile key={dish.id} dish={dish} />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-[2rem] font-semibold tracking-tight text-[#2c3039]">Menu</h3>
                <article className="overflow-hidden rounded-2xl border border-[#ececef] bg-white shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={couponContent.menuBoard.image}
                      alt={`${couponContent.menuBoard.title} board`}
                      className="h-full w-full object-cover blur-[1px] brightness-90"
                    />
                    <div className="absolute inset-0 bg-white/30" />
                    <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7b5f] text-white shadow-md">
                      <Heart className="h-5 w-5 fill-white text-white" />
                    </span>
                    <div className="absolute left-3 top-3 rounded-md bg-[#fffdf9]/85 px-2 py-1 shadow-sm">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-[#6f737b]">Menu Preview</p>
                    </div>
                    <div className="absolute left-3 bottom-3 w-[72%] rounded-md bg-[#fffdf9]/85 p-2 shadow-sm">
                      {couponContent.menuBoard.items.slice(0, 4).map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-[7px] leading-[10px] text-[#5f6572]">
                          <span className="max-w-[70%] truncate">{item.name}</span>
                          <span>{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xl font-semibold text-[#252934]">{couponContent.menuBoard.title}</p>
                    <p className="mt-1 text-sm text-[#7f8490]">Menu snapshot for in-store reference</p>
                  </div>
                </article>
              </section>
            </div>
          ) : null}

          {activeTab === 'review' ? (
            <div className="mt-6 space-y-5">
              <section className="rounded-2xl border border-[#e8e8eb] bg-white px-4 py-4 text-center">
                <p className="text-[2.2rem] font-medium text-[#2e3340]">overall {couponContent.overallScore}</p>
                <div className="mt-3 flex justify-center">
                  <StarMeter score={couponContent.overallScore} />
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
                  {couponContent.reviews.map((review) => (
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

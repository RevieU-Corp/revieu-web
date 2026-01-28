
import React, { useState } from 'react';
import { Header, FeatureBar, FeaturedSection, MerchantFeed } from '../components';
import { Activity, Merchant } from '../../shared/types';

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Study Hall',
    description: 'BOGO Drafts for Grad Students.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    tag: 'Trending',
    location: 'Jefferson Blvd'
  },
  {
    id: '2',
    title: 'SunLife Organic',
    description: 'Exclusive 20% savings.',
    image: 'https://images.unsplash.com/photo-1556742049-0ad335687440?auto=format&fit=crop&q=80&w=800',
    tag: 'Exclusive',
    location: 'USC Village'
  }
];

const baseMerchants: Merchant[] = [
  {
    id: 'm1',
    name: 'SunLife Organics',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800',
    category: 'Health',
    rating: 4.8,
    reviewCount: 215,
    distance: '0.2 mi',
    status: 'Open',
    offer: '20% Student'
  },
  {
    id: 'm2',
    name: 'Honeybird',
    image: 'https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&q=80&w=800',
    category: 'Southern',
    rating: 4.6,
    reviewCount: 540,
    distance: '0.4 mi',
    status: 'Open'
  },
  {
    id: 'm3',
    name: 'Cava USC',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    category: 'Mediterranean',
    rating: 4.9,
    reviewCount: 1205,
    distance: '0.1 mi',
    status: 'Open',
    offer: 'Free Side'
  }
];

// Generate 20 items by cycling through baseMerchants
const MOCK_MERCHANTS: Merchant[] = Array.from({ length: 20 }).map((_, index) => {
  const base = baseMerchants[index % baseMerchants.length];
  return {
    ...base,
    id: `m${index + 1}`,
    // Add randomness to make it look slightly different if needed, or just keep same
    distance: `${(0.1 + Math.random() * 2).toFixed(1)} mi`,
    reviewCount: Math.floor(base.reviewCount + Math.random() * 100),
  };
});

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white min-h-screen pb-20 max-w-lg mx-auto overflow-x-hidden">
      <Header onSearch={setSearchQuery} />

      <main className="px-4 space-y-12 mt-6">
        <FeatureBar />

        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-[24px] font-[900] text-gray-900 tracking-tight leading-none">Trojan Metrics</h2>
              <p className="text-[10px] font-black text-[#990000] uppercase tracking-widest mt-1.5 opacity-70">Daily Performance</p>
            </div>
            <button className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Detail</button>
          </div>
          <FeaturedSection activities={MOCK_ACTIVITIES} />
        </section>

        <section>
          <MerchantFeed merchants={MOCK_MERCHANTS} />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
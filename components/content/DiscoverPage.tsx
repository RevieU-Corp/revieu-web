
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Home, Compass, Heart, User } from 'lucide-react';

// Mock Data
const merchants = [
  {
    id: 1,
    name: "Dulce",
    category: "Cafe & Bakery",
    rating: 4.8,
    reviews: 1240,
    price: "$$",
    distance: "0.2 mi",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60",
    tags: ["Study Spot", "Wifi"]
  },
  {
    id: 2,
    name: "Northern Cafe",
    category: "Chinese",
    rating: 4.5,
    reviews: 856,
    price: "$",
    distance: "0.5 mi",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60",
    tags: ["Dumplings", "Fast"]
  },
  {
    id: 3,
    name: "Trader Joe's",
    category: "Grocery",
    rating: 4.9,
    reviews: 2300,
    price: "$",
    distance: "0.1 mi",
    image: "https://images.unsplash.com/photo-1604719312566-b7ce1232a7e9?w=500&auto=format&fit=crop&q=60",
    tags: ["Groceries", "Snacks"]
  },
  {
    id: 4,
    name: "Pot of Cha",
    category: "Bubble Tea",
    rating: 4.3,
    reviews: 450,
    price: "$",
    distance: "0.3 mi",
    image: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=500&auto=format&fit=crop&q=60",
    tags: ["Boba", "Dessert"]
  },
  {
    id: 5,
    name: "Target",
    category: "Retail",
    rating: 4.0,
    reviews: 1500,
    price: "$$",
    distance: "0.1 mi",
    image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500&auto=format&fit=crop&q=60",
    tags: ["Essentials", "Clothes"]
  },
  {
    id: 6,
    name: "Cava",
    category: "Mediterranean",
    rating: 4.7,
    reviews: 980,
    price: "$$",
    distance: "0.4 mi",
    image: "https://images.unsplash.com/photo-1626202382368-3b6be6798969?w=500&auto=format&fit=crop&q=60",
    tags: ["Healthy", "Bowls"]
  }
];

const categories = ["All", "Food", "Cafe", "Shopping", "Services"];

const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMerchants = merchants.filter(merchant => {
    const matchesCategory = selectedCategory === "All" || 
                            (selectedCategory === "Food" && ["Chinese", "Mediterranean", "Bubble Tea"].includes(merchant.category)) ||
                            (selectedCategory === "Cafe" && ["Cafe & Bakery"].includes(merchant.category)) ||
                            (selectedCategory === "Shopping" && ["Grocery", "Retail"].includes(merchant.category)) ||
                             merchant.category.includes(selectedCategory); // Fallback basic match
    
    const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          merchant.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-30 px-4 py-3 shadow-sm">
        <h1 className="text-2xl font-bold text-[#990000]">Discover</h1>
      </div>

      {/* Search & Filter */}
      <div className="px-4 pt-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Find places near USC..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#990000]/20 transition-shadow shadow-sm text-gray-800 placeholder-gray-400" 
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? "bg-[#990000] text-white shadow-md shadow-red-900/20" 
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Merchants List */}
      <div className="px-4 space-y-4 mt-2">
        <h2 className="font-bold text-lg text-gray-900">Popular Spots</h2>
        <div className="grid gap-4">
          {filteredMerchants.map((merchant) => (
            <div key={merchant.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex gap-3 hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99]">
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                <img src={merchant.image} alt={merchant.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 text-base truncate pr-2">{merchant.name}</h3>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{merchant.distance}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1 font-medium">{merchant.category}</p>
                </div>
                
                <div>
                    <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-bold text-gray-900">{merchant.rating}</span>
                        <span className="text-xs text-gray-400">({merchant.reviews})</span>
                        <span className="text-xs text-gray-300 mx-1">•</span>
                        <span className="text-xs font-bold text-green-600">{merchant.price}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                        {merchant.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border border-gray-100 font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 pb-safe">
        <button onClick={() => navigate('/home')} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => navigate('/discover')} className="flex flex-col items-center gap-1 text-[#990000]">
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-bold">Discover</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-medium">Saved</span>
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default DiscoverPage;

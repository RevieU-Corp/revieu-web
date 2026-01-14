import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Search, MapPin, Star, Clock, Navigation, X, ChevronRight } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '100%',
};

// Default center: San Francisco (can be changed to user's location)
const defaultCenter = {
    lat: 37.7749,
    lng: -122.4194,
};

const mockRestaurants = [
    {
        id: '1',
        name: 'The Golden Bistro',
        type: 'French Cuisine',
        rating: 4.8,
        reviews: 1240,
        position: { lat: 37.7800, lng: -122.4100 },
        image: 'https://images.unsplash.com/photo-1517248135467-4c7ed9d4240a?auto=format&fit=crop&w=800&q=80',
        price: '$$$',
        status: 'Open Now',
    },
    {
        id: '2',
        name: 'Sushi Zen',
        type: 'Japanese',
        rating: 4.9,
        reviews: 890,
        position: { lat: 37.7700, lng: -122.4300 },
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
        price: '$$',
        status: 'Closing Soon',
    },
    {
        id: '3',
        name: 'Pasta & Co',
        type: 'Italian',
        rating: 4.5,
        reviews: 2100,
        position: { lat: 37.7650, lng: -122.4150 },
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80',
        price: '$$',
        status: 'Open Now',
    },
];

const ExplorePage: React.FC = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    });

    const [selectedPlace, setSelectedPlace] = useState<typeof mockRestaurants[0] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        const bounds = new window.google.maps.LatLngBounds(defaultCenter);
        map.fitBounds(bounds);
    }, []);

    const mapOptions = useMemo(() => ({
        disableDefaultUI: true,
        clickableIcons: false,
        styles: [
            {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#7c93a3' }, { lightness: '-10' }],
            },
            {
                featureType: 'administrative.country',
                elementType: 'geometry',
                stylers: [{ visibility: 'on' }],
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }],
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }],
            },
        ],
    }), []);

    return (
        <div className="relative h-full w-full bg-slate-100 overflow-hidden">
            {/* Search Overlay */}
            <div className="absolute top-12 left-0 right-0 z-20 px-6 pointer-events-none">
                <div className="flex flex-col gap-3 max-w-md mx-auto">
                    {/* Search Input Container */}
                    <div className="pointer-events-auto relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search restaurants, sushi, pasta..."
                            className="w-full h-14 bg-white/90 backdrop-blur-2xl border border-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-[24px] pl-12 pr-12 text-sm font-semibold focus:ring-2 focus:ring-[#990000]/20 transition-all outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-4 flex items-center"
                            >
                                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>

                    {/* Quick Filters */}
                    <div className="pointer-events-auto flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {[
                            { label: 'Nearby', icon: MapPin, color: 'text-red-500' },
                            { label: 'Popular', icon: Star, color: 'text-yellow-500' },
                            { label: 'Open Now', icon: Clock, color: 'text-green-500' }
                        ].map((filter) => (
                            <button
                                key={filter.label}
                                className="px-4 py-2.5 bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-lg text-[10px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-2 whitespace-nowrap active:scale-95 transition-all"
                            >
                                <filter.icon className={`w-3.5 h-3.5 ${filter.color}`} />
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Full Screen Map Container */}
            <div className="absolute inset-0 z-0">
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={defaultCenter}
                        zoom={14}
                        onLoad={onLoad}
                        options={mapOptions as google.maps.MapOptions}
                        onClick={() => setSelectedPlace(null)}
                    >
                        {mockRestaurants.map((place) => (
                            <Marker
                                key={place.id}
                                position={place.position}
                                onClick={() => setSelectedPlace(place)}
                                icon={{
                                    path: google.maps.SymbolPath.CIRCLE,
                                    fillColor: "#990000",
                                    fillOpacity: 1,
                                    strokeWeight: 4,
                                    strokeColor: "#ffffff",
                                    scale: 10,
                                }}
                            />
                        ))}
                    </GoogleMap>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                        <div className="w-12 h-12 border-4 border-red-50 border-t-[#990000] rounded-full animate-spin mb-4" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Initializing Map...</p>
                    </div>
                )}
            </div>

            {/* My Location FAB */}
            <button className="absolute bottom-32 right-6 w-14 h-14 bg-white rounded-2xl shadow-2xl border border-white flex items-center justify-center active:scale-90 transition-all z-10 group">
                <Navigation className="w-6 h-6 text-[#990000] group-hover:rotate-45 transition-transform" />
            </button>

            {/* Detail Panel */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl rounded-t-[48px] shadow-[0_-30px_60px_rgba(0,0,0,0.15)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-40 ${selectedPlace ? 'translate-y-0 h-[460px]' : 'translate-y-full h-0'
                    }`}
            >
                <div className="w-16 h-1.5 bg-gray-200/50 rounded-full mx-auto mt-4 mb-8" />

                {selectedPlace && (
                    <div className="px-10 pb-16">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-red-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">
                                        Verified
                                    </span>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-50 rounded-full">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        <span className="text-[11px] font-black text-yellow-700">{selectedPlace.rating}</span>
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-2">
                                    {selectedPlace.name}
                                </h2>
                                <div className="flex items-center gap-4 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-green-500" />
                                        {selectedPlace.status}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>{selectedPlace.type}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span className="text-[#990000]">{selectedPlace.price}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPlace(null)}
                                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex gap-4 mb-10 overflow-hidden h-44">
                            <div className="flex-1 rounded-[32px] overflow-hidden shadow-2xl relative group">
                                <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            <div className="w-40 rounded-[32px] bg-gray-900 p-6 flex flex-col justify-between shadow-2xl border border-white/10 group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8 blur-2xl" />
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Impact</p>
                                    <p className="text-2xl font-black text-white leading-tight tracking-tighter">1.2k<br />Reviews</p>
                                </div>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-[3px] border-gray-900 bg-gray-800" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-[#990000] text-white h-20 rounded-[28px] font-black uppercase tracking-[0.3em] text-xs shadow-[0_20px_40px_rgba(153,0,0,0.4)] active:scale-95 transition-all flex items-center justify-center gap-4 group">
                            Explore Reviews
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;

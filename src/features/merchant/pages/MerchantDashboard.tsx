import React, { useState } from 'react';
import { Star, TrendingUp, Users, Gift, Trash2, ChevronDown, ChevronUp, Package } from 'lucide-react';
import TrafficChart from '../components/TrafficChart';
import CouponManager from '../components/CouponManager';
import PackageManager from '../components/PackageManager';
import ReviewReplyModal from '../components/ReviewReplyModal';
import ConfirmationDialog from '../components/ConfirmationDialog';

const MerchantDashboard: React.FC = () => {
  // State management
  const [showTrafficChart, setShowTrafficChart] = useState(false);
  const [showCouponManager, setShowCouponManager] = useState(false);
  const [showPackageManager, setShowPackageManager] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [expandedCoupons, setExpandedCoupons] = useState<Set<number>>(new Set());
  const [expandedPackages, setExpandedPackages] = useState<Set<number>>(new Set());
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  // Mock data for McDonald's USC
  const businessMetrics = {
    currentRating: 4.2,
    totalReviews: 1247,
    monthlyViews: 8934,
    viewsTrend: 'up' as const,
    trendPercentage: 12.5
  };

  const [reviews, setReviews] = useState([
    {
      id: 1,
      customerName: "Sarah Chen",
      rating: 5,
      text: "Perfect spot for late night study sessions! Fast service and the Wi-Fi is reliable.",
      date: "2 hours ago",
      hasReply: false,
      replyText: ""
    },
    {
      id: 2,
      customerName: "Mike Rodriguez",
      rating: 4,
      text: "Great location near campus. The staff is friendly and the food is consistent.",
      date: "1 day ago",
      hasReply: true,
      replyText: "Thank you for your feedback! We appreciate your business."
    },
    {
      id: 3,
      customerName: "Jessica Park",
      rating: 3,
      text: "Food was good but the wait time was longer than expected during lunch rush.",
      date: "2 days ago",
      hasReply: false,
      replyText: ""
    }
  ]);

  const [coupons, setCoupons] = useState([
    { 
      id: 1, 
      name: "Student Special", 
      type: "20% Off", 
      quantity: 45, 
      used: 23, 
      isActive: true, 
      expiryDate: "2024-02-15",
      description: "Exclusive discount for USC students. Valid on all menu items except combo meals. Must present valid student ID at time of purchase."
    },
    { 
      id: 2, 
      name: "Late Night Deal", 
      type: "Buy 1 Get 1", 
      quantity: 30, 
      used: 18, 
      isActive: true, 
      expiryDate: "2024-01-31",
      description: "Perfect for late-night study sessions! Buy any burger and get a second one free. Valid after 9 PM only."
    },
    { 
      id: 3, 
      name: "Finals Week", 
      type: "$5 Off", 
      quantity: 100, 
      used: 67, 
      isActive: true, 
      expiryDate: "2024-01-20",
      description: "Help students power through finals week with $5 off any order over $15. No restrictions, valid all day during finals period."
    }
  ]);

  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Student Value Combo",
      description: "Perfect for hungry students! Includes a Big Mac, medium fries, medium drink, and apple pie. Great value for a complete meal.",
      bundleItems: [
        { id: 1, name: "Big Mac", price: 5.99 },
        { id: 2, name: "Medium Fries", price: 2.49 },
        { id: 3, name: "Medium Drink", price: 1.99 },
        { id: 4, name: "Apple Pie", price: 1.29 }
      ],
      originalPrice: 11.76,
      bundlePrice: 8.99,
      isActive: true,
      productImage: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Late Night Study Pack",
      description: "Fuel your late-night study sessions with this energy-packed combo. Includes coffee, muffin, and a hearty sandwich.",
      bundleItems: [
        { id: 1, name: "Large Coffee", price: 2.99 },
        { id: 2, name: "Blueberry Muffin", price: 2.49 },
        { id: 3, name: "Chicken Club Sandwich", price: 6.99 }
      ],
      originalPrice: 12.47,
      bundlePrice: 9.99,
      isActive: true,
      productImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Game Day Special",
      description: "Share with friends during game day! Includes 20 nuggets, 2 large fries, 2 large drinks, and dipping sauces.",
      bundleItems: [
        { id: 1, name: "20pc Chicken Nuggets", price: 8.99 },
        { id: 2, name: "Large Fries (2x)", price: 5.98 },
        { id: 3, name: "Large Drinks (2x)", price: 4.98 },
        { id: 4, name: "Dipping Sauces", price: 1.00 }
      ],
      originalPrice: 20.95,
      bundlePrice: 15.99,
      isActive: true
    }
  ]);

  // Handler functions
  const handleReplyToReview = (review: any) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const toggleCouponExpansion = (couponId: number) => {
    setExpandedCoupons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(couponId)) {
        newSet.delete(couponId);
      } else {
        newSet.add(couponId);
      }
      return newSet;
    });
  };

  const togglePackageExpansion = (packageId: number) => {
    setExpandedPackages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  };

  const handleSubmitReply = (reviewId: number, replyText: string) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, hasReply: true, replyText }
        : review
    ));
  };

  const handleDeleteReview = (review: any) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Review',
      message: `Are you sure you want to delete the review from ${review.customerName}? This action cannot be undone.`,
      onConfirm: () => {
        setReviews(reviews.filter(r => r.id !== review.id));
      }
    });
  };

  const handleUpdateCoupons = (updatedCoupons: any[]) => {
    setCoupons(updatedCoupons);
    // Force a re-render to ensure the dashboard reflects changes immediately
    console.log('Coupons updated:', updatedCoupons);
  };

  const handleUpdatePackages = (updatedPackages: any[]) => {
    console.log('Packages updated:', updatedPackages);
    console.log('Active packages:', updatedPackages.filter(pkg => pkg.isActive));
    setPackages(updatedPackages);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">USC Review Management</h1>
        <p className="text-gray-600">Welcome back! Here's how your business is performing.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rating Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Rating</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900">{businessMetrics.currentRating}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(businessMetrics.currentRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{businessMetrics.totalReviews} reviews</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Views Card - Clickable */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowTrafficChart(true)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Views</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-gray-900">{businessMetrics.monthlyViews.toLocaleString()}</span>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={14} />
                  <span className="text-sm font-medium">+{businessMetrics.trendPercentage}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Click to view details</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Coupons */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Coupons</h2>
          <button
            onClick={() => setShowCouponManager(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            style={{ backgroundColor: '#FFBC0D' }}
          >
            <Gift size={16} />
            Edit Coupons
          </button>
        </div>
        <div className="space-y-3">
          {coupons.filter(coupon => coupon.isActive).map((coupon) => {
            const isExpanded = expandedCoupons.has(coupon.id);
            return (
              <div key={coupon.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Main Coupon Card */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCouponExpansion(coupon.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{coupon.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {coupon.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {coupon.used}/{coupon.quantity} used • Expires: {coupon.expiryDate || 'No expiry'}
                    </p>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(coupon.used / coupon.quantity) * 100}%`,
                          backgroundColor: '#FFBC0D'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-gray-400">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expandable Details Section */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    <div className="pt-4 space-y-4">
                      {/* Description Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                        <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                          {coupon.description ? (
                            <p className="whitespace-pre-wrap">{coupon.description}</p>
                          ) : (
                            <p className="italic text-gray-400">No description provided</p>
                          )}
                        </div>
                      </div>

                      {/* Future Redemption Details Placeholder */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Redemption Details</h4>
                        <div className="text-sm text-gray-400 bg-white p-3 rounded-lg border border-dashed">
                          <p className="italic">Future redemption details will appear here</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {coupons.filter(coupon => coupon.isActive).length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p>No active coupons. Click "Edit Coupons" to create some!</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Packages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Packages</h2>
          <button
            onClick={() => setShowPackageManager(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors bg-green-500"
          >
            <Package size={16} />
            Manage Packages
          </button>
        </div>
        <div className="space-y-3">
          {/* Debug info - remove this later */}
          <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
            Debug: Total packages: {packages.length}, Active packages: {packages.filter(pkg => pkg.isActive).length}
            <br />
            Package names: {packages.map(pkg => `${pkg.name} (${pkg.isActive ? 'active' : 'inactive'})`).join(', ')}
          </div>
          
          {packages.filter(pkg => pkg.isActive).map((pkg) => {
            const isExpanded = expandedPackages.has(pkg.id);
            const savings = pkg.originalPrice - pkg.bundlePrice;
            const savingsPercentage = Math.round((savings / pkg.originalPrice) * 100);
            
            return (
              <div key={pkg.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Main Package Card */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => togglePackageExpansion(pkg.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{pkg.name}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        ${pkg.bundlePrice.toFixed(2)}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium line-through">
                        ${pkg.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {pkg.bundleItems.length} items • Save ${savings.toFixed(2)} ({savingsPercentage}% off)
                    </p>
                  </div>
                  <div className="ml-4 text-gray-400">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expandable Details Section */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    <div className="pt-4 space-y-4">
                      {/* Package Image */}
                      {pkg.productImage && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Package Image</h4>
                          <img 
                            src={pkg.productImage} 
                            alt={pkg.name}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}

                      {/* Description Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                        <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                          <p className="whitespace-pre-wrap">{pkg.description}</p>
                        </div>
                      </div>

                      {/* Bundle Items */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">What's Included</h4>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="space-y-2">
                            {pkg.bundleItems.map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">{item.name}</span>
                                <span className="text-gray-500">${item.price.toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-gray-900">Bundle Total</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-red-500 line-through">${pkg.originalPrice.toFixed(2)}</span>
                                  <span className="text-green-600">${pkg.bundlePrice.toFixed(2)}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-green-600 font-medium">
                                  You save ${savings.toFixed(2)}!
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {packages.filter(pkg => pkg.isActive).length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p>No active packages. Click "Manage Packages" to create some!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!review.hasReply && (
                    <button
                      onClick={() => handleReplyToReview(review)}
                      className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
                    >
                      Reply
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteReview(review)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={10} />
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-700 text-sm">{review.text}</p>
              {review.hasReply && review.replyText && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-600">Your Reply:</p>
                    <button
                      onClick={() => handleReplyToReview(review)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">{review.replyText}</p>
                </div>
              )}
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TrafficChart
        isOpen={showTrafficChart}
        onClose={() => setShowTrafficChart(false)}
        totalViews={businessMetrics.monthlyViews}
        trendPercentage={businessMetrics.trendPercentage}
      />

      <CouponManager
        isOpen={showCouponManager}
        onClose={() => setShowCouponManager(false)}
        coupons={coupons}
        onUpdateCoupons={handleUpdateCoupons}
      />

      <PackageManager
        isOpen={showPackageManager}
        onClose={() => setShowPackageManager(false)}
        packages={packages}
        onUpdatePackages={handleUpdatePackages}
      />

      <ReviewReplyModal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        review={selectedReview}
        onSubmitReply={handleSubmitReply}
      />

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="danger"
      />
    </div>
  );
};

export default MerchantDashboard;
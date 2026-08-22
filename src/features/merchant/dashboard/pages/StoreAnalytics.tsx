import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  Eye, 
  MousePointer, 
  ShoppingCart,
  Gift,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { PATHS } from '../../../../routes/paths';

const StoreAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const selectedTimeRange = '30d';

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalViews: 8934,
      viewsGrowth: 12.5,
      totalCustomers: 1247,
      customersGrowth: 8.3,
      avgRating: 4.2,
      ratingChange: 0.1,
      totalPosts: 24,
      postsGrowth: 15.2
    },
    peakHours: [
      { hour: '6 AM', value: 12 },
      { hour: '7 AM', value: 28 },
      { hour: '8 AM', value: 45 },
      { hour: '9 AM', value: 32 },
      { hour: '10 AM', value: 25 },
      { hour: '11 AM', value: 38 },
      { hour: '12 PM', value: 85 },
      { hour: '1 PM', value: 92 },
      { hour: '2 PM', value: 67 },
      { hour: '3 PM', value: 43 },
      { hour: '4 PM', value: 38 },
      { hour: '5 PM', value: 52 },
      { hour: '6 PM', value: 78 },
      { hour: '7 PM', value: 89 },
      { hour: '8 PM', value: 76 },
      { hour: '9 PM', value: 54 },
      { hour: '10 PM', value: 32 },
      { hour: '11 PM', value: 18 }
    ],
    customerTypes: {
      new: 68,
      returning: 32
    },
    ratingTrend: [
      { month: 'Jan', rating: 3.8 },
      { month: 'Feb', rating: 3.9 },
      { month: 'Mar', rating: 4.0 },
      { month: 'Apr', rating: 4.1 },
      { month: 'May', rating: 4.2 },
      { month: 'Jun', rating: 4.2 }
    ],
    postEngagement: {
      totalViews: 15420,
      linkClicks: 892,
      conversions: 156,
      engagementRate: 5.8
    },
    couponRedemption: {
      issued: 450,
      redeemed: 287,
      redemptionRate: 63.8
    }
  };

  const maxPeakValue = Math.max(...analyticsData.peakHours.map(h => h.value));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(PATHS.MERCHANT.DASHBOARD)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Store Analytics</h1>
              <p className="text-sm text-gray-600">Comprehensive insights into your business performance</p>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            {[
              { key: '7d', label: '7 Days' },
              { key: '30d', label: '30 Days' },
              { key: '90d', label: '90 Days' },
              { key: '1y', label: '1 Year' }
            ].map((range) => (
              <button
                key={range.key}
                type="button"
                disabled
                aria-label={`${range.label} (coming soon)`}
                title="Date-range analytics are coming soon"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeRange === range.key
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900" role="status">
          <p className="font-semibold">Demo / Coming soon</p>
          <p className="mt-1 text-sm">
            These analytics values are illustrative preview data. Date-range queries will be enabled after the
            merchant analytics API contract and persisted metric pipeline are available.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalViews.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-green-600 mt-1">
                  <TrendingUp size={12} />
                  <span className="text-xs">+{analyticsData.overview.viewsGrowth}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalCustomers.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-green-600 mt-1">
                  <TrendingUp size={12} />
                  <span className="text-xs">+{analyticsData.overview.customersGrowth}%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.avgRating}</p>
                <div className="flex items-center gap-1 text-green-600 mt-1">
                  <TrendingUp size={12} />
                  <span className="text-xs">+{analyticsData.overview.ratingChange}</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalPosts}</p>
                <div className="flex items-center gap-1 text-green-600 mt-1">
                  <TrendingUp size={12} />
                  <span className="text-xs">+{analyticsData.overview.postsGrowth}%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Peak Hours Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Peak Hours</h2>
            </div>
            <div className="space-y-2">
              {analyticsData.peakHours.map((hour, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-12">{hour.hour}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="bg-orange-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(hour.value / maxPeakValue) * 100}%` }}
                    />
                    <span className="absolute right-2 top-0 text-xs text-gray-700 leading-4">
                      {hour.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Peak hours help optimize staffing and inventory management
            </p>
          </div>

          {/* New vs Returning Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Customer Types</h2>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  {/* New customers arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${analyticsData.customerTypes.new * 2.51} 251.2`}
                    strokeLinecap="round"
                  />
                  {/* Returning customers arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray={`${analyticsData.customerTypes.returning * 2.51} 251.2`}
                    strokeDashoffset={`-${analyticsData.customerTypes.new * 2.51}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.customerTypes.new + analyticsData.customerTypes.returning}%
                    </p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">New Customers</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {analyticsData.customerTypes.new}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Returning Customers</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {analyticsData.customerTypes.returning}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rating Trend */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Average Rating Trend</h2>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {analyticsData.ratingTrend.map((month, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '120px' }}>
                    <div
                      className="bg-yellow-500 rounded-t-lg w-full absolute bottom-0 transition-all duration-500"
                      style={{ height: `${(month.rating / 5) * 100}%` }}
                    />
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                      {month.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{month.month}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Track rating improvements over time to measure service quality
            </p>
          </div>

          {/* Post Engagement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Post Engagement</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.postEngagement.totalViews.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <MousePointer className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.postEngagement.linkClicks.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Link Clicks</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.postEngagement.conversions}
                </p>
                <p className="text-sm text-gray-600">Conversions</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.postEngagement.engagementRate}%
                </p>
                <p className="text-sm text-gray-600">Engagement Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coupon Redemption */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Gift className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Coupon Redemption Rate</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donut Chart */}
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeDasharray={`${analyticsData.couponRedemption.redemptionRate * 2.199} 219.9`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.couponRedemption.redemptionRate}%
                    </p>
                    <p className="text-sm text-gray-600">Redeemed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Coupons Issued</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {analyticsData.couponRedemption.issued}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-400 h-2 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Coupons Redeemed</span>
                  <span className="text-lg font-semibold text-red-600">
                    {analyticsData.couponRedemption.redeemed}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analyticsData.couponRedemption.redemptionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Unredeemed:</strong> {analyticsData.couponRedemption.issued - analyticsData.couponRedemption.redeemed} coupons
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  High redemption rates indicate effective coupon strategies and customer engagement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalytics;

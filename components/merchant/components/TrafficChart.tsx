import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { X, TrendingUp } from 'lucide-react';

interface TrafficChartProps {
  isOpen: boolean;
  onClose: () => void;
  totalViews: number;
  trendPercentage: number;
}

// Mock data for the last 30 days
const last30DaysData = [
  { date: 'Dec 1', views: 245 },
  { date: 'Dec 2', views: 312 },
  { date: 'Dec 3', views: 189 },
  { date: 'Dec 4', views: 278 },
  { date: 'Dec 5', views: 356 },
  { date: 'Dec 6', views: 423 },
  { date: 'Dec 7', views: 298 },
  { date: 'Dec 8', views: 367 },
  { date: 'Dec 9', views: 445 },
  { date: 'Dec 10', views: 389 },
  { date: 'Dec 11', views: 512 },
  { date: 'Dec 12', views: 467 },
  { date: 'Dec 13', views: 398 },
  { date: 'Dec 14', views: 523 },
  { date: 'Dec 15', views: 456 },
  { date: 'Dec 16', views: 612 },
  { date: 'Dec 17', views: 578 },
  { date: 'Dec 18', views: 634 },
  { date: 'Dec 19', views: 589 },
  { date: 'Dec 20', views: 678 },
  { date: 'Dec 21', views: 723 },
  { date: 'Dec 22', views: 645 },
  { date: 'Dec 23', views: 567 },
  { date: 'Dec 24', views: 489 },
  { date: 'Dec 25', views: 345 },
  { date: 'Dec 26', views: 456 },
  { date: 'Dec 27', views: 612 },
  { date: 'Dec 28', views: 678 },
  { date: 'Dec 29', views: 734 },
  { date: 'Dec 30', views: 789 }
];

// Mock data for the last 7 days
const last7DaysData = [
  { date: 'Dec 24', views: 489 },
  { date: 'Dec 25', views: 345 },
  { date: 'Dec 26', views: 456 },
  { date: 'Dec 27', views: 612 },
  { date: 'Dec 28', views: 678 },
  { date: 'Dec 29', views: 734 },
  { date: 'Dec 30', views: 789 }
];

const TrafficChart: React.FC<TrafficChartProps> = ({ isOpen, onClose, totalViews, trendPercentage }) => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('30days');

  if (!isOpen) return null;

  const currentData = timeRange === '7days' ? last7DaysData : last30DaysData;
  const averageViews = Math.round(currentData.reduce((sum, day) => sum + day.views, 0) / currentData.length);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Traffic Analytics</h3>
              <p className="text-sm text-gray-600">Detailed view trends and patterns</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Time Range Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Time Range:</div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setTimeRange('7days')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeRange === '7days'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setTimeRange('30days')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    timeRange === '30days'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Last 30 Days
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-gray-600">Total Views</div>
                <div className="font-semibold text-gray-900">{totalViews.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Daily Average</div>
                <div className="font-semibold text-gray-900">{averageViews.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Growth</div>
                <div className="font-semibold text-green-600">+{trendPercentage}%</div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#374151', fontWeight: 'medium' }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📈 Key Insights</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Peak traffic typically occurs on weekends and evenings</p>
              <p>• {trendPercentage > 0 ? 'Positive' : 'Negative'} growth trend over the selected period</p>
              <p>• Average daily views: {averageViews.toLocaleString()} visitors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficChart;
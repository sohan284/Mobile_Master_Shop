'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Wrench, 
  Package, 
  Calendar,
  Star,
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react';
import PageTransition from '@/components/animations/PageTransition';

export default function Analytics() {
  const [activePeriod, setActivePeriod] = useState('30d');
  
  const periods = [
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' },
    { id: '90d', name: 'Last 90 Days' },
    { id: '1y', name: 'Last Year' }
  ];

  const overviewStats = [
    {
      name: 'Total Revenue',
      value: '$45,231',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      name: 'Repair Bookings',
      value: '234',
      change: '+8.2%',
      changeType: 'positive',
      icon: Wrench,
      color: 'text-blue-600'
    },
    {
      name: 'Product Sales',
      value: '89',
      change: '+15.3%',
      changeType: 'positive',
      icon: Package,
      color: 'text-purple-600'
    },
    {
      name: 'New Customers',
      value: '156',
      change: '+23.1%',
      changeType: 'positive',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  const repairAnalytics = [
    { repair: 'Screen Repair', count: 89, revenue: 26700, avgPrice: 300 },
    { repair: 'Battery Replacement', count: 67, revenue: 6030, avgPrice: 90 },
    { repair: 'Camera Repair', count: 34, revenue: 6800, avgPrice: 200 },
    { repair: 'Charging Port', count: 23, revenue: 3450, avgPrice: 150 },
    { repair: 'Back Glass', count: 18, revenue: 3240, avgPrice: 180 },
    { repair: 'Speaker Repair', count: 12, revenue: 960, avgPrice: 80 }
  ];

  const productSales = [
    { product: 'iPhone 17 Pro Max', sold: 12, revenue: 14388, stock: 8 },
    { product: 'iPhone 17 Pro', sold: 8, revenue: 7992, stock: 10 },
    { product: 'Samsung Galaxy S24 Ultra', sold: 6, revenue: 7794, stock: 9 },
    { product: 'AirPods Pro', sold: 23, revenue: 5727, stock: 22 },
    { product: 'iPhone Cases', sold: 45, revenue: 2205, stock: 22 }
  ];

  const recentBookings = [
    { id: 1, customer: 'John Doe', service: 'Screen Repair', device: 'iPhone 17 Pro', amount: 299, status: 'Completed' },
    { id: 2, customer: 'Jane Smith', service: 'Battery Replacement', device: 'iPhone 16 Pro', amount: 89, status: 'In Progress' },
    { id: 3, customer: 'Mike Johnson', service: 'Camera Repair', device: 'iPhone 17 Pro Max', amount: 199, status: 'Scheduled' },
    { id: 4, customer: 'Sarah Wilson', service: 'Charging Port', device: 'iPhone 16', amount: 149, status: 'Completed' },
    { id: 5, customer: 'David Brown', service: 'Screen Repair', device: 'Samsung S24 Ultra', amount: 349, status: 'Completed' }
  ];

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={activePeriod}
            onChange={(e) => setActivePeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {periods.map((period) => (
              <option key={period.id} value={period.id}>{period.name}</option>
            ))}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last period
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-50')}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Revenue chart would be displayed here</p>
            </div>
          </div>
        </div>

        {/* Repair Types Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Repair Types Distribution</h2>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Pie chart would be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Repair Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Repair Services Analytics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Repair Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repairAnalytics.map((repair, index) => (
                <tr key={repair.repair} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Wrench className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{repair.repair}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repair.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${repair.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${repair.avgPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+{Math.floor(Math.random() * 20 + 5)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Sales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productSales.map((product) => (
                <tr key={product.product} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{product.product}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' : 
                      product.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 10 ? 'In Stock' : product.stock > 5 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{booking.customer}</div>
                  <div className="text-sm text-gray-500">{booking.service} - {booking.device}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">${booking.amount}</div>
                  <div className="text-sm text-gray-500">{booking.status}</div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

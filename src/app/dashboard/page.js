'use client';
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  ShoppingCart,
  Wrench,
  Smartphone,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar
} from 'lucide-react';
import PageTransition from '@/components/animations/PageTransition';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'repair', 'phone', 'accessory'

  // Fetch orders from all three APIs
  const { data: repairOrdersData, isLoading: isLoadingRepair, error: errorRepair } = useApiGet(
    ['dashboardRepairOrders'],
    () => apiFetcher.get('/api/repair/orders/')
  );
  const { data: phoneOrdersData, isLoading: isLoadingPhone, error: errorPhone } = useApiGet(
    ['dashboardPhoneOrders'],
    () => apiFetcher.get('/api/brandnew/orders/')
  );
  const { data: accessoryOrdersData, isLoading: isLoadingAccessory, error: errorAccessory } = useApiGet(
    ['dashboardAccessoryOrders'],
    () => apiFetcher.get('/api/accessories/orders/')
  );

  // Normalize order data
  const normalizeOrder = (order, type) => {
    const normalized = {
      ...order,
      orderType: type,
      productName: order.phone_model_name || order.product_title || 'N/A',
      brandName: order.brand_name || order.phone_model_brand || 'N/A',
      productImage: order.phone_image || order.product_image || null,
      quantity: order.quantity || order.items_count || 1,
      orderNumber: order.order_number || `#${order.id}`,
      customerName: order.customer_name || 'N/A',
      customerPhone: order.customer_phone || 'N/A',
      totalAmount: parseFloat(order.total_amount) || 0,
      currency: order.currency || 'EUR',
      status: order.status || 'unknown',
      statusDisplay: order.status_display || order.status || 'Unknown',
      paymentStatus: order.payment_status || 'unknown',
      paymentStatusDisplay: order.payment_status_display || order.payment_status || 'Unknown',
      createdAt: order.created_at || null,
    };
    return normalized;
  };

  // Extract and normalize orders
  const normalizedRepairOrders = useMemo(() => {
    const repairOrders = Array.isArray(repairOrdersData?.data) ? repairOrdersData.data : 
                         Array.isArray(repairOrdersData) ? repairOrdersData : 
                         (repairOrdersData?.results || []);
    return repairOrders.map(order => normalizeOrder(order, 'repair')).sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [repairOrdersData]);
  
  const normalizedPhoneOrders = useMemo(() => {
    const phoneOrders = Array.isArray(phoneOrdersData?.data) ? phoneOrdersData.data : 
                       Array.isArray(phoneOrdersData) ? phoneOrdersData : 
                       (phoneOrdersData?.results || []);
    return phoneOrders.map(order => normalizeOrder(order, 'phone')).sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [phoneOrdersData]);
  
  const normalizedAccessoryOrders = useMemo(() => {
    const accessoryOrders = Array.isArray(accessoryOrdersData?.data) ? accessoryOrdersData.data : 
                           Array.isArray(accessoryOrdersData) ? accessoryOrdersData : 
                           (accessoryOrdersData?.results || []);
    return accessoryOrders.map(order => normalizeOrder(order, 'accessory')).sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [accessoryOrdersData]);

  const totalOrders = normalizedRepairOrders.length + normalizedPhoneOrders.length + normalizedAccessoryOrders.length;

  const isLoading = isLoadingRepair || isLoadingPhone || isLoadingAccessory;
  const error = errorRepair || errorPhone || errorAccessory;

  // Filter orders based on selected filter
  const filteredOrders = useMemo(() => {
    switch(selectedFilter) {
      case 'repair':
        return normalizedRepairOrders;
      case 'phone':
        return normalizedPhoneOrders;
      case 'accessory':
        return normalizedAccessoryOrders;
      default:
        return [...normalizedRepairOrders, ...normalizedPhoneOrders, ...normalizedAccessoryOrders].sort((a, b) => {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }
  }, [selectedFilter, normalizedRepairOrders, normalizedPhoneOrders, normalizedAccessoryOrders]);

  // Order cards configuration
  const orderCards = [
    {
      id: 'all',
      name: 'All Orders',
      count: totalOrders,
      icon: Package,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 'repair',
      name: 'All Repair Services',
      count: normalizedRepairOrders.length,
      icon: Wrench,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      id: 'phone',
      name: 'All New Phone',
      count: normalizedPhoneOrders.length,
      icon: Smartphone,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      id: 'accessory',
      name: 'All Accessories Orders',
      count: normalizedAccessoryOrders.length,
      icon: ShoppingBag,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'confirmed' || statusLower === 'completed') {
      return 'bg-green-100 text-green-800';
    } else if (statusLower === 'pending' || statusLower === 'processing') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusLower === 'cancelled' || statusLower === 'canceled') {
      return 'bg-red-100 text-red-800';
    } else if (statusLower === 'shipped') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <PageTransition>
      <div className="flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
        {/* Fixed Header and Cards Section */}
        <div className="flex-shrink-0 space-y-6 pb-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
          </div>

          {/* Order Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {orderCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedFilter(card.id)}
                className={`bg-white p-6 rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                  selectedFilter === card.id 
                    ? 'border-primary' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{card.name}</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20 mt-2" />
                    ) : (
                      <p className="text-2xl font-bold text-gray-900 mt-1">{card.count}</p>
                    )}
                  </div>
                  <div className={`p-3 ${card.color} rounded-lg`}>
                    <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Orders Table Section */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedFilter === 'all' ? 'All Orders' : 
                 selectedFilter === 'repair' ? 'Repair Services Orders' :
                 selectedFilter === 'phone' ? 'New Phone Orders' :
                 'Accessories Orders'}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
            {isLoading ? (
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-red-600">Error loading orders: {error.message || 'Unknown error'}</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-6 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders found.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id || order.order_number} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center gap-1">
                          {order.orderType === 'repair' && <Wrench size={14} className="text-blue-600" />}
                          {order.orderType === 'phone' && <Smartphone size={14} className="text-green-600" />}
                          {order.orderType === 'accessory' && <ShoppingBag size={14} className="text-purple-600" />}
                          <span className="capitalize">
                            {order.orderType === 'phone' ? 'New Phone' : 
                             order.orderType === 'repair' ? 'Repair' : 
                             'Accessory'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-medium">{order.productName}</span>
                          {order.brandName && order.brandName !== 'N/A' && (
                            <span className="text-xs text-gray-500">Brand: {order.brandName}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span>{order.customerName}</span>
                          {order.customerPhone && order.customerPhone !== 'N/A' && (
                            <span className="text-xs text-gray-500">{order.customerPhone}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.totalAmount.toFixed(2)} {order.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                          {order.statusDisplay}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.paymentStatus)}`}>
                          {order.paymentStatusDisplay}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt ? (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

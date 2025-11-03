'use client';
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Wrench,
  Smartphone,
  ShoppingBag,
  Calendar
} from 'lucide-react';
import PageTransition from '@/components/animations/PageTransition';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import DataTable from '@/components/ui/DataTable';

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

  // Normalize order data - ensure orderType is set correctly and cannot be overwritten
  const normalizeOrder = (order, type) => {
    const normalized = {
      ...order,
      // Explicitly set orderType after spread to ensure it's correct
      orderType: type,
      // Normalize common fields
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
      // Color information for phone orders
      colorName: order.color_name || order.color?.name || order.color || null,
      colorCode: order.color_code || order.color?.hex_code || order.color?.code || null,
    };
    // Force orderType to be correct (in case original order had conflicting property)
    normalized.orderType = type;
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

  // Filter orders based on selected filter with explicit type checking
  const filteredOrders = useMemo(() => {
    // Combine all orders for filtering
    const allOrders = [
      ...normalizedRepairOrders,
      ...normalizedPhoneOrders,
      ...normalizedAccessoryOrders
    ];
    
    switch(selectedFilter) {
      case 'repair':
        // Explicitly filter by orderType to ensure correct data
        return allOrders.filter(order => order.orderType === 'repair').sort((a, b) => {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
      case 'phone':
        // Explicitly filter by orderType to ensure correct data
        return allOrders.filter(order => order.orderType === 'phone').sort((a, b) => {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
      case 'accessory':
        // Explicitly filter by orderType to ensure correct data
        return allOrders.filter(order => order.orderType === 'accessory').sort((a, b) => {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
      default:
        // Return all orders sorted by date
        return allOrders.sort((a, b) => {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }
  }, [selectedFilter, normalizedRepairOrders, normalizedPhoneOrders, normalizedAccessoryOrders]);

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

  // Define columns for DataTable
  const columns = [
    {
      header: 'Order Number',
      accessor: 'orderNumber',
      sortable: true,
    },
    {
      header: 'Type',
      accessor: 'orderType',
      sortable: true,
      render: (order) => (
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
      ),
    },
    {
      header: 'Product',
      accessor: 'productName',
      sortable: true,
      render: (order) => (
        <div className="flex flex-col">
          <span className="font-medium">{order.productName}</span>
          {order.brandName && order.brandName !== 'N/A' && (
            <span className="text-xs text-gray-500">Brand: {order.brandName}</span>
          )}
          {order.orderType === 'phone' && order.colorName && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">Color:</span>
              <div className="flex items-center gap-1">
                {order.colorCode && (
                  <span 
                    className="inline-block w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: order.colorCode }}
                    title={order.colorName}
                  />
                )}
                <span className="text-xs font-medium text-gray-700">{order.colorName}</span>
              </div>
            </div>
          )}
        </div>
      ),  
    },
    {
      header: 'Customer',
      accessor: 'customerName',
      sortable: true,
      render: (order) => (
        <div className="flex flex-col">
          <span>{order.customerName}</span>
          {order.customerPhone && order.customerPhone !== 'N/A' && (
            <span className="text-xs text-gray-500">{order.customerPhone}</span>
          )}
          {order?.shipping_address && (
            <span className="text-xs text-gray-500">Address: {order.shipping_address}</span>
          )}
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'totalAmount',
      sortable: true,
      render: (order) => (
        <span className="font-medium">
          {order.totalAmount.toFixed(2)} {order.currency}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (order) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
          {order.statusDisplay}
        </span>
      ),
    },
    {
      header: 'Payment',
      accessor: 'paymentStatus',
      sortable: true,
      render: (order) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.paymentStatus)}`}>
          {order.paymentStatusDisplay}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      sortable: true,
      render: (order) => (
        order.createdAt ? (
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
        )
      ),
    },
  ];

  // Order cards configuration
  const orderCards = [
    {
      id: 'all',
      name: 'All Orders',
      count: totalOrders,
      icon: Package,
      color: 'bg-gray-200',
      iconColor: 'text-gray-800',
    },
    {
      id: 'repair',
      name: 'All Repair Services',
      count: normalizedRepairOrders.length,
      icon: Wrench,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 'phone',
      name: 'All New Phones',
      count: normalizedPhoneOrders.length,
      icon: Smartphone,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      id: 'accessory',
      name: 'All Accessories Orders',
      count: normalizedAccessoryOrders.length,
      icon: ShoppingBag,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <PageTransition>
      <div className="flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
        {/* Fixed Header and Cards Section */}
        <div className="flex-shrink-0 space-y-6 pb-6">
   

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
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col ">
            {error ? (
              <div className="p-6 text-center bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-red-600">Error loading orders: {error.message || 'Unknown error'}</p>
              </div>
            ) : (
              <DataTable
                key={selectedFilter}
                data={filteredOrders}
                columns={columns}
                title={
                  selectedFilter === 'all' ? 'All Orders' : 
                  selectedFilter === 'repair' ? 'Repair Services Orders' :
                  selectedFilter === 'phone' ? 'New Phone Orders' :
                  'Accessories Orders'
                }
                searchable={true}
                pagination={true}
                itemsPerPage={10}
                loading={isLoading}
                className="bg-white border-gray-200"
              />
            )}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

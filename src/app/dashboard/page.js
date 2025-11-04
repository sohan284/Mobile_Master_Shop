'use client';
import React, { useState, useMemo } from 'react';
import { 
  Wrench,
  Smartphone,
  ShoppingBag,
  Calendar
} from 'lucide-react';
import PageTransition from '@/components/animations/PageTransition';
import { useApiGet, useApiPatch } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import DataTable from '@/components/ui/DataTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'repair', 'phone', 'accessory'
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  const [updatingStatus, setUpdatingStatus] = useState({}); // Track which order is being updated
  
  const queryClient = useQueryClient();

  // Reset status filter when order type filter changes
  React.useEffect(() => {
    setSelectedStatus('all');
  }, [selectedFilter]);

  // Mutation for updating order status
  const updateStatusMutation = useApiPatch({
    onSuccess: (data, variables) => {
      const { orderType } = variables;
      // Invalidate and refetch the relevant query based on order type
      let queryKey = '';
      if (orderType === 'repair') {
        queryKey = 'dashboardRepairOrders';
      } else if (orderType === 'phone') {
        queryKey = 'dashboardPhoneOrders';
      } else if (orderType === 'accessory') {
        queryKey = 'dashboardAccessoryOrders';
      }
      
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
      
      setUpdatingStatus(prev => {
        const newState = { ...prev };
        delete newState[variables.orderId];
        return newState;
      });
      toast.success('Order status updated successfully');
    },
    onError: (error, variables) => {
      setUpdatingStatus(prev => {
        const newState = { ...prev };
        delete newState[variables.orderId];
        return newState;
      });
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  });

  // Function to handle status change
  const handleStatusChange = async (order, newStatus) => {
    const currentStatus = (order.status || '').toLowerCase();
    if (currentStatus === newStatus.toLowerCase()) return; // No change needed
    
    // Ensure we have the order ID
    const orderId = order.id;
    if (!orderId) {
      toast.error('Order ID not found');
      return;
    }
    
    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
    
    // Determine API endpoint based on order type
    let endpoint = '';
    if (order.orderType === 'repair') {
      endpoint = `/api/repair/orders/${orderId}/`;
    } else if (order.orderType === 'phone') {
      endpoint = `/api/brandnew/orders/${orderId}/`;
    } else if (order.orderType === 'accessory') {
      endpoint = `/api/accessories/orders/${orderId}/`;
    } else {
      toast.error('Unknown order type');
      setUpdatingStatus(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
      return;
    }

    // Prepare the request body with status
    const requestBody = {
      status: newStatus
    };

    console.log('Updating order status:', {
      endpoint,
      orderId,
      status: newStatus,
      body: requestBody
    });

    // Call PATCH API with order ID in URL and status in body
    updateStatusMutation.mutate({
      url: endpoint,
      data: requestBody,
      orderId: orderId,
      orderType: order.orderType
    });
  };

  // Fetch orders from all three APIs
  const { data: repairOrdersData, isLoading: isLoadingRepair, error: errorRepair } = useApiGet(
    ['dashboardRepairOrders'],
    () => apiFetcher.get('/api/repair/admin/orders/')
  );
  const { data: phoneOrdersData, isLoading: isLoadingPhone, error: errorPhone } = useApiGet(
    ['dashboardPhoneOrders'],
    () => apiFetcher.get('/api/brandnew/admin/orders/')
  );
  const { data: accessoryOrdersData, isLoading: isLoadingAccessory, error: errorAccessory } = useApiGet(
    ['dashboardAccessoryOrders'],
    () => apiFetcher.get('/api/accessories/admin/orders/')
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

  // Filter orders based on selected filter
  const filteredOrders = useMemo(() => {
    // Combine all orders for filtering
    const allOrders = [
      ...normalizedRepairOrders,
      ...normalizedPhoneOrders,
      ...normalizedAccessoryOrders
    ];
    
    // Filter by order type
    let typeFiltered = [];
    switch(selectedFilter) {
      case 'repair':
        typeFiltered = allOrders.filter(order => order.orderType === 'repair');
        break;
      case 'phone':
        typeFiltered = allOrders.filter(order => order.orderType === 'phone');
        break;
      case 'accessory':
        typeFiltered = allOrders.filter(order => order.orderType === 'accessory');
        break;
      default:
        typeFiltered = allOrders;
    }
    
    // Sort by date
    return typeFiltered.sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [selectedFilter, normalizedRepairOrders, normalizedPhoneOrders, normalizedAccessoryOrders]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'confirmed' || statusLower === 'completed' || statusLower === 'delivered') {
      return 'bg-green-100 text-green-800';
    } else if (statusLower === 'pending' || statusLower === 'processing') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusLower === 'cancelled' || statusLower === 'canceled' || statusLower === 'refunded') {
      return 'bg-red-100 text-red-800';
    } else if (statusLower === 'shipped') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Get status badge classes for Select component
  const getStatusBadgeClasses = (status) => {
    return getStatusBadge(status);
  };

  // Status options for dropdown
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' },
  ];

  // Status options for filter dropdown (with 'all')
  const filterStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...statusOptions,
  ];

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
      render: (order) => {
        const isUpdating = updatingStatus[order.id];
        const currentStatus = order.status?.toLowerCase() || 'pending';
        const badgeClasses = getStatusBadgeClasses(currentStatus);
        
        return (
          <Select 
            value={currentStatus} 
            onValueChange={(newStatus) => handleStatusChange(order, newStatus)}
            disabled={isUpdating}
          >
            <SelectTrigger 
              className={`w-[140px] h-8 text-xs rounded-lg cursor-pointer border-0 ${badgeClasses} font-semibold hover:opacity-80`}
            >
              <SelectValue>
                {isUpdating ? (
                  <span className="text-xs">Updating...</span>
                ) : (
                  <span className="text-xs font-semibold capitalize">
                    {statusOptions.find(opt => opt.value === currentStatus)?.label || order.statusDisplay}
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="capitalize">{option.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
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

  // Order type options for filter dropdown
  const orderTypeOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'repair', label: 'Repair Orders' },
    { value: 'phone', label: 'New Phone Orders' },
    { value: 'accessory', label: 'Accessory Orders' },
  ];

  return (
    <PageTransition>
      <div className="flex flex-col gap-6" style={{ height: 'calc(100vh - 10rem)' }}>
        {/* Scrollable Orders Table Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">List of all orders</p>
        </div>
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
                title="Orders"
                searchable={true}
                pagination={true}
                itemsPerPage={10}
                loading={isLoading}
                className="bg-white border-gray-200"
                height="80vh"
                orderTypeFilter={
                  <Select className="cursor-pointer" value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-[180px] h-10">
                      <SelectValue placeholder="Filter by order type" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }
                statusFilter={
                  <Select className="cursor-pointer" value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px] h-10">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }
              />
            )}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

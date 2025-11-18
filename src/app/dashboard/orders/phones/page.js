'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Smartphone,
  Calendar,
  Eye
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
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useTranslations } from 'next-intl';

export default function PhoneOrdersPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [updatingStatus, setUpdatingStatus] = useState({}); // Track which order is being updated
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const queryClient = useQueryClient();
  const orderType = 'phone'; // Fixed order type
  const t = useTranslations('dashboard.orders.phonePage');
  const tOrdersCommon = useTranslations('dashboard.orders.common');
  const tDetail = useTranslations('dashboard.orders.detailCommon');
  const tGlobal = useTranslations('dashboard.common');

  const translateStatus = useCallback(
    (value) => {
      if (!value) return tDetail('notAvailable');
      const normalized = value.toLowerCase();
      try {
        return tGlobal(normalized);
      } catch {
        return value;
      }
    },
    [tDetail, tGlobal]
  );

  const notAvailableLabel = tDetail('notAvailable');

  // Reset page when status filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  // Mutation for updating order status
  const updateStatusMutation = useApiPatch({
    onSuccess: (data, variables) => {
      // Invalidate and refetch the orders query with current filters and page
      queryClient.invalidateQueries({ queryKey: ['phoneOrders', selectedStatus, currentPage] });
      
      setUpdatingStatus(prev => {
        const newState = { ...prev };
        delete newState[variables.orderId];
        return newState;
      });
      toast.success(tOrdersCommon('statusUpdated'));
    },
    onError: (error, variables) => {
      setUpdatingStatus(prev => {
        const newState = { ...prev };
        delete newState[variables.orderId];
        return newState;
      });
      toast.error(error.response?.data?.message || tOrdersCommon('statusUpdateFailed'));
    }
  });

  // Function to handle delete
  const handleDelete = (order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;

    setIsDeleting(true);
    try {
      await apiFetcher.delete(`/api/brandnew/orders/${selectedOrder.id}/`);
      toast.success(tOrdersCommon('deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: ['phoneOrders', selectedStatus, currentPage] });
      setIsDeleteDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || tOrdersCommon('deleteFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedOrder(null);
    setIsDeleting(false);
  };

  const handleView = async (order) => {
    try {
      await apiFetcher.patch(`/api/brandnew/orders/${order.id}/`, { is_read: true });
      // Invalidate query to refresh the list and remove unread styling
      queryClient.invalidateQueries({ queryKey: ['phoneOrders', selectedStatus, currentPage] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStatistics'] });
    } catch (error) {
      toast.error(error?.response?.data?.message || t('markReadFailed'));
    }
    router.push(`/dashboard/orders/phones/${order.id}`);
  };

  // Function to handle status change
  const handleStatusChange = async (order, newStatus) => {
    const currentStatus = (order.status || '').toLowerCase();
    if (currentStatus === newStatus.toLowerCase()) return; // No change needed
    
    // Ensure we have the order ID
    const orderId = order.id;
    if (!orderId) {
      toast.error(tOrdersCommon('orderIdMissing'));
      return;
    }
    
    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
    
    const endpoint = `/api/brandnew/orders/${orderId}/`;

    // Prepare the request body with status
    const requestBody = {
      status: newStatus
    };

    // Call PATCH API with order ID in URL and status in body
    updateStatusMutation.mutate({
      url: endpoint,
      data: requestBody,
      orderId: orderId,
      orderType: orderType
    });
  };

  // Fetch orders from unified API with order_type fixed to 'phone', status filter, and pagination
  const { data: ordersData, isLoading: isLoadingOrders, error: errorOrders } = useApiGet(
    ['phoneOrders', selectedStatus, currentPage],
    () => {
      const url = '/api/admin/orders/';
      const params = new URLSearchParams();
      
      // Always set order_type to phone
      params.append('order_type', 'phone');
      
      // Add status query parameter if status filter is not 'all'
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      
      // Add page parameter
      params.append('page', currentPage.toString());
      
      // Build URL with query parameters
      const queryString = params.toString();
      return apiFetcher.get(`${url}?${queryString}`);
    }
  );

  // Extract and normalize orders from unified API
  const normalizedOrders = useMemo(() => {
    const normalizeOrder = (order) => ({
      ...order,
      orderType,
      productName: order.phone_model_name || order.product_title || notAvailableLabel,
      brandName: order.brand_name || order.phone_model_brand || notAvailableLabel,
      productImage: order.phone_image || order.product_image || null,
      quantity: order.quantity || order.items_count || 1,
      orderNumber: order.order_number || `#${order.id}`,
      customerName: order.customer_name || notAvailableLabel,
      customerPhone: order.customer_phone || notAvailableLabel,
      totalAmount: parseFloat(order.total_amount) || 0,
      currency: order.currency || 'EUR',
      status: order.status || 'unknown',
      statusDisplay: order.status_display || translateStatus(order.status) || tGlobal('unknown'),
      paymentStatus: order.payment_status || 'unknown',
      paymentStatusDisplay:
        order.payment_status_display || translateStatus(order.payment_status) || tGlobal('unknown'),
      createdAt: order.created_at || null,
      colorName: order.color_name || order.color?.name || order.color || null,
      colorCode: order.color_code || order.color?.hex_code || order.color?.code || null,
    });

    const orders = Array.isArray(ordersData?.data)
      ? ordersData.data
      : Array.isArray(ordersData?.results)
      ? ordersData.results
      : Array.isArray(ordersData)
      ? ordersData
      : [];

    return orders
      .map((order) => normalizeOrder(order))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [ordersData, orderType, notAvailableLabel, translateStatus, tGlobal]);

  // Extract pagination info from API response
  const pagination = ordersData?.pagination || {};
  const totalCount = pagination.count || 0;
  const totalPages = pagination.total_pages || 1;
  const pageSize = pagination.page_size || 20;
  const apiCurrentPage = pagination.current_page || currentPage;

  const isLoading = isLoadingOrders;
  const error = errorOrders;

  // Orders are already filtered by order_type and status via API
  const filteredOrders = normalizedOrders;

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
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
  const statusValues = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  const statusOptions = statusValues.map((value) => ({
    value,
    label: translateStatus(value),
  }));

  // Status options for filter dropdown (with 'all')
  const filterStatusOptions = [
    { value: 'all', label: tOrdersCommon('allStatuses') },
    ...statusOptions,
  ];

  // Define columns for DataTable - simplified
  const columns = [
    {
      header: tOrdersCommon('orderNumber'),
      accessor: 'orderNumber',
      sortable: true,
      render: (order) => (
        <button
          onClick={() => handleView(order)}
          className="text-blue-600 cursor-pointer hover:text-blue-800 hover:underline font-medium"
        >
          {order.orderNumber}
        </button>
      ),
    },
    {
      header: tOrdersCommon('amount'),
      accessor: 'totalAmount',
      sortable: true,
      render: (order) => (
        <span className="font-medium">
          {order.totalAmount.toFixed(2)} {order.currency}
        </span>
      ),
    },
    {
      header: tOrdersCommon('status'),
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
                  <span className="text-xs">{tOrdersCommon('updating')}</span>
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
      header: tOrdersCommon('payment'),
      accessor: 'paymentStatus',
      sortable: true,
      render: (order) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.paymentStatus)}`}>
          {order.paymentStatusDisplay}
        </span>
      ),
    },
    {
      header: tOrdersCommon('date'),
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
          tDetail('notAvailable')
        )
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="flex flex-col gap-6" style={{ height: 'calc(100vh - 10rem)' }}>
        {/* Scrollable Orders Table Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col ">
            {error ? (
              <div className="p-6 text-center bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-red-600">
                  {tOrdersCommon('loadError', {
                    message: error?.message || tOrdersCommon('unknownError'),
                  })}
                </p>
              </div>
            ) : (
              <DataTable
                data={filteredOrders}
                columns={columns}
                title={t('tableTitle')}
                searchable={true}
                pagination={true}
                itemsPerPage={pageSize}
                loading={isLoading}
                className="bg-white border-gray-200"
                height="80vh"
                totalCount={totalCount}
                totalPages={totalPages}
                currentPage={apiCurrentPage}
                onPageChange={setCurrentPage}
                onDelete={handleDelete}
                onView={handleView}
                rowClassName={(order) => order?.is_read === false ? 'bg-blue-50' : ''}
                statusFilter={
                  <Select className="cursor-pointer" value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px] h-10">
                      <SelectValue placeholder={t('statusFilterLabel')} />
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={tOrdersCommon('deleteOrder')}
        message={tOrdersCommon('deleteConfirm', {
          order: selectedOrder?.orderNumber || selectedOrder?.id || '',
        })}
        confirmText={tOrdersCommon('yesDelete')}
        cancelText={tGlobal('cancel')}
        type="danger"
        isLoading={isDeleting}
      />
    </PageTransition>
  );
}


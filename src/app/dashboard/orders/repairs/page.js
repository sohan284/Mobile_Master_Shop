"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Calendar, Eye, Clock, Edit2, Check, X } from "lucide-react";
import PageTransition from "@/components/animations/PageTransition";
import { useApiGet, useApiPatch } from "@/hooks/useApi";
import { apiFetcher } from "@/lib/api";
import DataTable from "@/components/ui/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function RepairOrdersPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("all"); // 'all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [updatingStatus, setUpdatingStatus] = useState({}); // Track which order is being updated
  const [updatingSchedule, setUpdatingSchedule] = useState({}); // Track which order's schedule is being updated
  const [editingSchedule, setEditingSchedule] = useState({}); // Track which order's schedule is being edited
  const [scheduleValues, setScheduleValues] = useState({}); // Store temporary schedule values while editing
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  const orderType = "repair"; // Fixed order type

  // Reset page when status filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  // Mutation for updating order status
  const updateStatusMutation = useApiPatch({
    onSuccess: (data, variables) => {
      // Invalidate and refetch the orders query with current filters and page
      queryClient.invalidateQueries({
        queryKey: ["repairOrders", selectedStatus, currentPage],
      });

      setUpdatingStatus((prev) => {
        const newState = { ...prev };
        delete newState[variables.orderId];
        return newState;
      });
      toast.success("Order status updated successfully");
    },
    onError: (error, variables) => {
      setUpdatingStatus((prev) => {
        const newState = { ...prev };
        delete newState[variables.orderId];
        return newState;
      });
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    },
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
      await apiFetcher.delete(`/api/repair/orders/${selectedOrder.id}/`);
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["repairOrders", selectedStatus, currentPage],
      });
      setIsDeleteDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete order"
      );
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
      await apiFetcher.patch(`/api/repair/orders/${order.id}/`, {
        is_read: true,
      });
      // Invalidate query to refresh the list and remove unread styling
      queryClient.invalidateQueries({
        queryKey: ["repairOrders", selectedStatus, currentPage],
      });
      queryClient.invalidateQueries({ queryKey: ['dashboardStatistics'] });
    } catch (error) {
      console.error("Failed to mark order as read:", error);
    }
    router.push(`/dashboard/orders/repairs/${order.id}`);
  };

  // Function to handle schedule update
  const handleScheduleUpdate = async (order, newSchedule) => {
    const orderId = order.id;
    if (!orderId) {
      toast.error("Order ID not found");
      return;
    }

    setUpdatingSchedule((prev) => ({ ...prev, [orderId]: true }));

    try {
      await apiFetcher.patch(`/api/repair/orders/${orderId}/`, {
        schedule: newSchedule,
      });

      // Invalidate query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["repairOrders", selectedStatus, currentPage],
      });

      // Reset editing state
      setEditingSchedule((prev) => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
      setScheduleValues((prev) => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });

      toast.success("Schedule updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update schedule"
      );
    } finally {
      setUpdatingSchedule((prev) => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
    }
  };

  // Function to start editing schedule
  const startEditingSchedule = (order) => {
    const orderId = order.id;
    
    // Convert schedule to local datetime-local format
    let dateTimeValue = "";
    if (order.schedule) {
      const date = new Date(order.schedule);
      if (!isNaN(date.getTime())) {
        // Format as YYYY-MM-DDTHH:mm using UTC components to avoid timezone shifts
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        dateTimeValue = `${year}-${month}-${day}T${hours}:${minutes}`;
      }
    }

    setEditingSchedule((prev) => ({ ...prev, [orderId]: true }));
    setScheduleValues((prev) => ({ ...prev, [orderId]: dateTimeValue }));
  };

  // Function to cancel editing schedule
  const cancelEditingSchedule = (orderId) => {
    setEditingSchedule((prev) => {
      const newState = { ...prev };
      delete newState[orderId];
      return newState;
    });
    setScheduleValues((prev) => {
      const newState = { ...prev };
      delete newState[orderId];
      return newState;
    });
  };

  // Function to save schedule
  const saveSchedule = (order) => {
    const orderId = order.id;
    const dateTimeValue = scheduleValues[orderId];
    
    if (!dateTimeValue) {
      toast.error("Please select a date and time");
      return;
    }

    // Convert datetime-local value to ISO string
    const localDate = new Date(dateTimeValue);
    const isoString = localDate.toISOString();

    handleScheduleUpdate(order, isoString);
  };

  // Function to handle status change
  const handleStatusChange = async (order, newStatus) => {
    const currentStatus = (order.status || "").toLowerCase();
    if (currentStatus === newStatus.toLowerCase()) return; // No change needed

    // Ensure we have the order ID
    const orderId = order.id;
    if (!orderId) {
      toast.error("Order ID not found");
      return;
    }

    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));

    const endpoint = `/api/repair/orders/${orderId}/`;

    // Prepare the request body with status
    const requestBody = {
      status: newStatus,
    };

    // Call PATCH API with order ID in URL and status in body
    updateStatusMutation.mutate({
      url: endpoint,
      data: requestBody,
      orderId: orderId,
      orderType: orderType,
    });
  };

  // Fetch orders from unified API with order_type fixed to 'repair', status filter, and pagination
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: errorOrders,
  } = useApiGet(["repairOrders", selectedStatus, currentPage], () => {
    const url = "/api/admin/orders/";
    const params = new URLSearchParams();

    // Always set order_type to repair
    params.append("order_type", "repair");

    // Add status query parameter if status filter is not 'all'
    if (selectedStatus !== "all") {
      params.append("status", selectedStatus);
    }

    // Add page parameter
    params.append("page", currentPage.toString());

    // Build URL with query parameters
    const queryString = params.toString();
    return apiFetcher.get(`${url}?${queryString}`);
  });

  // Extract and normalize orders from unified API
  const normalizedOrders = useMemo(() => {
    const normalizeOrder = (order) => {
      const normalized = {
        ...order,
        orderType: orderType,
        // Normalize common fields
        productName: order.phone_model_name || order.product_title || "N/A",
        brandName: order.brand_name || order.phone_model_brand || "N/A",
        productImage: order.phone_image || order.product_image || null,
        quantity: order.quantity || order.items_count || 1,
        orderNumber: order.order_number || `#${order.id}`,
        customerName: order.customer_name || "N/A",
        customerPhone: order.customer_phone || "N/A",
        totalAmount: parseFloat(order.total_amount) || 0,
        currency: order.currency || "EUR",
        status: order.status || "unknown",
        statusDisplay: order.status_display || order.status || "Unknown",
        paymentStatus: order.payment_status || "unknown",
        paymentStatusDisplay:
          order.payment_status_display || order.payment_status || "Unknown",
        createdAt: order.created_at || null,
        schedule: order.schedule || null,
        colorName: order.color_name || order.color?.name || order.color || null,
        colorCode:
          order.color_code ||
          order.color?.hex_code ||
          order.color?.code ||
          null,
      };
      return normalized;
    };

    // Extract orders from response - could be in data, results, or root array
    const orders = Array.isArray(ordersData?.data)
      ? ordersData.data
      : Array.isArray(ordersData?.results)
      ? ordersData.results
      : Array.isArray(ordersData)
      ? ordersData
      : [];
    return orders
      .map((order) => normalizeOrder(order))
      .sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [ordersData]);

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
    const statusLower = status.toLowerCase();
    if (
      statusLower === "confirmed" ||
      statusLower === "completed" ||
      statusLower === "delivered"
    ) {
      return "bg-green-100 text-green-800";
    } else if (statusLower === "pending" || statusLower === "processing") {
      return "bg-yellow-100 text-yellow-800";
    } else if (
      statusLower === "cancelled" ||
      statusLower === "canceled" ||
      statusLower === "refunded"
    ) {
      return "bg-red-100 text-red-800";
    } else if (statusLower === "shipped") {
      return "bg-blue-100 text-blue-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  // Get status badge classes for Select component
  const getStatusBadgeClasses = (status) => {
    return getStatusBadge(status);
  };

  // Format schedule from ISO string to readable format
  const formatSchedule = (scheduleString) => {
    if (!scheduleString) return null;

    try {
      // Parse the date string - if it ends with 'Z', it's UTC
      // We'll extract the UTC components to avoid timezone conversion
      const date = new Date(scheduleString);
      if (isNaN(date.getTime())) return null;

      // Use UTC methods to get the actual time from the API without timezone conversion
      const utcYear = date.getUTCFullYear();
      const utcMonth = date.getUTCMonth();
      const utcDay = date.getUTCDate();
      const utcHours = date.getUTCHours();
      const utcMinutes = date.getUTCMinutes();

      // Create a date object in local timezone with UTC values
      const localDate = new Date(
        utcYear,
        utcMonth,
        utcDay,
        utcHours,
        utcMinutes
      );

      // Format date
      const formattedDate = localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Format time using UTC hours/minutes directly
      const hour12 =
        utcHours === 0 ? 12 : utcHours > 12 ? utcHours - 12 : utcHours;
      const ampm = utcHours >= 12 ? "PM" : "AM";
      const formattedTime = `${hour12.toString().padStart(2, "0")}:${utcMinutes
        .toString()
        .padStart(2, "0")} ${ampm}`;

      // For comparison, use the original date
      return {
        date: formattedDate,
        time: formattedTime,
        full: `${formattedDate} at ${formattedTime}`,
        isPast: date < new Date(),
        isToday: date.toDateString() === new Date().toDateString(),
        isUpcoming:
          date > new Date() &&
          date.toDateString() !== new Date().toDateString(),
      };
    } catch (e) {
      console.error("Error formatting schedule:", e);
      return null;
    }
  };

  // Status options for dropdown
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ];

  // Status options for filter dropdown (with 'all')
  const filterStatusOptions = [
    { value: "all", label: "All Statuses" },
    ...statusOptions,
  ];

  // Define columns for DataTable - simplified
  const columns = [
    {
      header: "Order Number",
      accessor: "orderNumber",
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
      header: "Amount",
      accessor: "totalAmount",
      sortable: true,
      render: (order) => (
        <span className="font-medium">
          {order.totalAmount.toFixed(2)} {order.currency}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (order) => {
        const isUpdating = updatingStatus[order.id];
        const currentStatus = order.status?.toLowerCase() || "pending";
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
                    {statusOptions.find((opt) => opt.value === currentStatus)
                      ?.label || order.statusDisplay}
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
      header: "Payment",
      accessor: "paymentStatus",
      sortable: true,
      render: (order) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
            order.paymentStatus
          )}`}
        >
          {order.paymentStatusDisplay}
        </span>
      ),
    },
    {
      header: "Schedule",
      accessor: "schedule",
      sortable: true,
      render: (order) => {
        const orderId = order.id;
        const isEditing = editingSchedule[orderId];
        const isUpdating = updatingSchedule[orderId];
        const scheduleInfo = formatSchedule(order.schedule);

        // If editing, show input field
        if (isEditing) {
          return (
            <div className="flex items-center gap-2 max-w-[300px]">
              <input
                type="datetime-local"
                value={scheduleValues[orderId] || ""}
                onChange={(e) =>
                  setScheduleValues((prev) => ({
                    ...prev,
                    [orderId]: e.target.value,
                  }))
                }
                disabled={isUpdating}
                className="flex-1 px-3 py-1.5 text-xs border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => saveSchedule(order)}
                disabled={isUpdating}
                className="p-1.5 bg-green-500 cursor-pointer text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Save schedule"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => cancelEditingSchedule(orderId)}
                disabled={isUpdating}
                className="p-1.5 bg-red-500 cursor-pointer text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          );
        }

        // If not scheduled, show "Not scheduled" with edit button
        if (!scheduleInfo) {
          return (
            <div className="flex items-center gap-2 max-w-[300px]">
              <span className="text-gray-400 italic text-xs">Not scheduled</span>
              <button
                onClick={() => startEditingSchedule(order)}
                disabled={isUpdating}
                className="p-1.5 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add schedule"
              >
                <Edit2 size={14} />
              </button>
            </div>
          );
        }

        // Determine styling based on schedule status
        let badgeStyle = "";

        if (scheduleInfo.isPast) {
          badgeStyle = "bg-red-50 border-red-200 text-red-700";
        } else if (scheduleInfo.isToday) {
          badgeStyle = "bg-orange-50 border-orange-200 text-orange-700";
        } else {
          badgeStyle = "bg-blue-50 border-blue-200 text-blue-700";
        }

        // Determine status text
        let statusText = "";
        if (scheduleInfo.isPast) {
          statusText = "Past";
        } else if (scheduleInfo.isToday) {
          statusText = "Today";
        } else if (scheduleInfo.isUpcoming) {
          statusText = "Upcoming";
        }

        return (
          <div className="flex items-center gap-2 max-w-[300px]">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 ${badgeStyle} font-semibold flex-1`}
            >
              <Clock size={14} className="flex-shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs leading-tight">
                    {scheduleInfo.date}
                  </span>
                  {statusText && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-white/50">
                      {statusText}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold">{scheduleInfo.time}</span>
              </div>
            </div>
            <button
              onClick={() => startEditingSchedule(order)}
              disabled={isUpdating}
              className="p-1.5 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              title="Edit schedule"
            >
              {isUpdating ? (
                <Clock size={14} className="animate-spin" />
              ) : (
                <Edit2 size={14} />
              )}
            </button>
          </div>
        );
      },
    },
    {
      header: "Date",
      accessor: "createdAt",
      sortable: true,
      render: (order) =>
        order.createdAt ? (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ) : (
          "N/A"
        ),
    },
  ];

  return (
    <PageTransition>
      <div
        className="flex flex-col gap-6"
        style={{ height: "calc(100vh - 10rem)" }}
      >
        {/* Scrollable Orders Table Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Repair Orders</h1>
          <p className="text-gray-600">Manage repair service orders</p>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col ">
            {error ? (
              <div className="p-6 text-center bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-red-600">
                  Error loading orders: {error.message || "Unknown error"}
                </p>
              </div>
            ) : (
              <DataTable
                data={filteredOrders}
                columns={columns}
                title="Repair Orders"
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
                rowClassName={(order) =>
                  order?.is_read === false ? "bg-blue-50" : ""
                }
                statusFilter={
                  <Select
                    className="cursor-pointer"
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Order"
        message={`Are you sure you want to delete order "${
          selectedOrder?.orderNumber || selectedOrder?.id
        }"? This action cannot be undone.`}
        confirmText="Yes, delete it!"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </PageTransition>
  );
}

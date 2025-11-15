"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageTransition from "@/components/animations/PageTransition";
import MotionFade from "@/components/animations/MotionFade";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetcher } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Phone,
  User,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  MessageSquare,
  Wrench,
  Smartphone,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import { useApiGet } from "@/hooks/useApi";

function OrdersContent() {
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'repair', 'phone', 'accessory'
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10); // Show 10 orders initially

  // Fetch orders from all three APIs
  const {
    data: repairOrdersData,
    isLoading: isLoadingRepair,
    error: errorRepair,
    refetch: refetchRepairOrders,
  } = useApiGet(["repairOrders"], () => apiFetcher.get("/api/repair/orders/"), {
    enabled: isAuthenticated(),
  });
  const {
    data: phoneOrdersData,
    isLoading: isLoadingPhone,
    error: errorPhone,
    refetch: refetchPhoneOrders,
  } = useApiGet(
    ["phoneOrders"],
    () => apiFetcher.get("/api/brandnew/orders/"),
    { enabled: isAuthenticated() }
  );
  const {
    data: accessoryOrdersData,
    isLoading: isLoadingAccessory,
    error: errorAccessory,
    refetch: refetchAccessoryOrders,
  } = useApiGet(
    ["accessoryOrders"],
    () => apiFetcher.get("/api/accessories/orders/"),
    { enabled: isAuthenticated() }
  );

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

  // Combine and normalize all orders
  const normalizeOrder = (order, type) => {
    const normalized = {
      ...order,
      orderType: type, // 'repair', 'phone', or 'accessory'
      // Normalize product name
      productName: order.phone_model_name || order.product_title || "N/A",
      // Normalize brand
      brandName: order.brand_name || order.phone_model_brand || "N/A",
      // Normalize image
      productImage: order.phone_image || order.product_image || null,
      // Normalize quantity
      quantity: order.quantity || order.items_count || 1,
      // Normalize schedule
      schedule: order.schedule || null,
    };
    return normalized;
  };

  const repairOrders = Array.isArray(repairOrdersData?.data)
    ? repairOrdersData.data
    : Array.isArray(repairOrdersData)
    ? repairOrdersData
    : repairOrdersData?.results || [];

  const phoneOrders = Array.isArray(phoneOrdersData?.data)
    ? phoneOrdersData.data
    : Array.isArray(phoneOrdersData)
    ? phoneOrdersData
    : phoneOrdersData?.results || [];

  const accessoryOrders = Array.isArray(accessoryOrdersData?.data)
    ? accessoryOrdersData.data
    : Array.isArray(accessoryOrdersData)
    ? accessoryOrdersData
    : accessoryOrdersData?.results || [];

  // Normalize and sort orders by type
  const normalizedRepairOrders = repairOrders
    .map((order) => normalizeOrder(order, "repair"))
    .sort((a, b) => {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  const normalizedPhoneOrders = phoneOrders
    .map((order) => normalizeOrder(order, "phone"))
    .sort((a, b) => {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  const normalizedAccessoryOrders = accessoryOrders
    .map((order) => normalizeOrder(order, "accessory"))
    .sort((a, b) => {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  const totalOrders =
    normalizedRepairOrders.length +
    normalizedPhoneOrders.length +
    normalizedAccessoryOrders.length;

  const isLoading = isLoadingRepair || isLoadingPhone || isLoadingAccessory;
  const error = errorRepair || errorPhone || errorAccessory;

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    switch (activeTab) {
      case "repair":
        return normalizedRepairOrders;
      case "phone":
        return normalizedPhoneOrders;
      case "accessory":
        return normalizedAccessoryOrders;
      default:
        return [
          ...normalizedRepairOrders,
          ...normalizedPhoneOrders,
          ...normalizedAccessoryOrders,
        ].sort((a, b) => {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        });
    }
  };

  const filteredOrders = getFilteredOrders();
  const visibleOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = filteredOrders.length > visibleCount;

  // Set active tab from URL query parameter on mount
  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (
      tabParam &&
      ["all", "repair", "phone", "accessory"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Reset visible count when tab changes
  useEffect(() => {
    setVisibleCount(10);
  }, [activeTab]);

  const getOrderTypeIcon = (orderType) => {
    switch (orderType) {
      case "repair":
        return <Wrench size={16} className="text-blue-300" />;
      case "phone":
        return <Smartphone size={16} className="text-green-300" />;
      case "accessory":
        return <ShoppingBag size={16} className="text-purple-300" />;
      default:
        return <Package size={16} />;
    }
  };

  const getOrderTypeLabel = (orderType) => {
    switch (orderType) {
      case "repair":
        return "Repair Service";
      case "phone":
        return "New Phone";
      case "accessory":
        return "Accessory";
      default:
        return "Order";
    }
  };

  const renderOrderCard = (order) => {
    // Compute badge props outside of JSX
    const statusLower = (order.status || "").toLowerCase();
    const statusDisplay = order.status_display || order.status || "Unknown";
    let statusBadgeProps = { variant: "outline" };
    let statusIcon = null;

    if (statusLower === "confirmed") {
      statusBadgeProps = {
        className:
          "bg-green-500/10 text-green-500 border-green-500 flex items-center",
      };
      statusIcon = <CheckCircle2 size={12} className="mr-1" />;
    } else if (statusLower === "pending" || statusLower === "processing") {
      statusBadgeProps = {
        className:
          "bg-yellow-500/10 text-yellow-500 border-yellow-500 flex items-center",
      };
      statusIcon = <Clock size={12} className="mr-1" />;
    } else if (statusLower === "cancelled") {
      statusBadgeProps = {
        className:
          "bg-red-500/10 text-red-500 border-red-500 flex items-center",
      };
      statusIcon = <XCircle size={12} className="mr-1" />;
    }

    const paymentStatusLower = (order.payment_status || "").toLowerCase();
    const paymentStatusDisplay =
      order.payment_status_display || order.payment_status || "Unknown";
    let paymentBadgeProps = {
      className:
        "bg-yellow-500/10 text-yellow-500 border-yellow-500 flex items-center",
    };
    let paymentIcon = <Clock size={12} className="mr-1" />;

    if (paymentStatusLower === "paid") {
      paymentBadgeProps = {
        className:
          "bg-green-500/10 text-green-500 border-green-500 flex items-center",
      };
      paymentIcon = <CheckCircle2 size={12} className="mr-1" />;
    }

    return (
      <div
        key={order.id || order.order_number}
        className="p-4 bg-white/5 rounded-lg border border-accent/10 hover:border-accent/30 transition-all relative overflow-hidden"
      >
        {/* Order Type Indicator */}
        <div className="absolute top-0 right-0 bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-bl-lg flex items-center gap-1 text-xs font-medium">
          {getOrderTypeIcon(order.orderType)}
          <span className="text-accent/80">
            {getOrderTypeLabel(order.orderType)}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-3 pt-5">
          {/* Product Image */}
          {order.productImage && (
            <div className="relative w-full lg:w-24 h-24 bg-white/5 rounded-lg border border-accent/10 overflow-hidden flex-shrink-0">
              <Image
                src={order.productImage}
                alt={order.productName}
                fill
                className="object-contain p-1.5"
              />
            </div>
          )}

          <div className="flex-1 space-y-2">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-2 border-b border-accent/10">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-secondary flex items-center gap-1.5 mb-0.5">
                  <Package size={16} />
                  {order.order_number || `Order #${order.id}`}
                </h3>
                <p className="text-xs text-accent/60 flex items-center gap-1.5">
                  <Calendar size={12} />
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge {...statusBadgeProps}>
                  {statusIcon}
                  <span>{statusDisplay}</span>
                </Badge>
                <Badge {...paymentBadgeProps}>
                  {paymentIcon}
                  <span>{paymentStatusDisplay}</span>
                </Badge>
              </div>
            </div>

            {/* Product Details - Single Line */}
            <div className="grid grid-cols-4 items-center  gap-y-1 text-sm">
              <div className="flex items-center gap-1.5">
                <Phone size={12} className="text-accent/60 flex-shrink-0" />
                <span className="text-xs text-accent/60">
                  {order.orderType === "accessory"
                    ? "Product"
                    : order.orderType === "repair"
                    ? "Repair Service"
                    : "Phone Model"}
                  :
                </span>
                <span className="font-medium text-accent">
                  {order.productName}
                </span>
              </div>
              {order.brandName && order.brandName !== "N/A" && (
                <div className="flex items-center gap-1.5">
                  <User size={12} className="text-accent/60 flex-shrink-0" />
                  <span className="text-xs text-accent/60">Brand:</span>
                  <span className="font-medium text-accent">
                    {order.brandName}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-accent/60">Customer:</span>
                <span className="font-medium text-accent">
                  {order.customer_name || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-accent/60">Phone:</span>
                <span className="font-medium text-accent">
                  {order.customer_phone || "N/A"}
                </span>
              </div>
              {order.quantity > 1 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-accent/60">Qty:</span>
                  <span className="font-medium text-accent">
                    {order.quantity}
                  </span>
                </div>
              )}
            </div>

            {/* Schedule Section - Only show for repair orders with schedule */}
            {order.orderType === "repair" &&
              order.schedule &&
              (() => {
                const scheduleInfo = formatSchedule(order.schedule);
                if (!scheduleInfo) return null;

                // Determine styling based on schedule status
                let badgeStyle = "";
                let statusText = "";

                if (scheduleInfo.isPast) {
                  badgeStyle = "bg-red-500/10 border-red-500 text-red-500";
                  statusText = "Past";
                } else if (scheduleInfo.isToday) {
                  badgeStyle =
                    "bg-orange-500/10 border-orange-500 text-orange-500";
                  statusText = "Today";
                } else {
                  badgeStyle =
                    "bg-blue-500/10 border-blue-500 text-blue-500";
                  statusText = "Upcoming";
                }

                return (
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 ${badgeStyle} font-semibold`}
                  >
                    <Clock size={16} className="flex-shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs leading-tight">
                          {scheduleInfo.date}
                        </span>
                        {statusText && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-white/20">
                            {statusText}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold">
                        {scheduleInfo.time}
                      </span>
                    </div>
                  </div>
                );
              })()}

            {/* Amount Section */}
            <div className="pt-2 border-t border-accent/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-accent/60">Total Amount</span>
                {order.quantity > 1 && (
                  <p className="text-xs text-accent/60 mt-0.5">
                    {order.quantity} ×{" "}
                    {(
                      (parseFloat(order.total_amount) || 0) / order.quantity
                    ).toFixed(2)}{" "}
                    {order.currency || "EUR"}
                  </p>
                )}
              </div>
              <span className="text-xl font-bold text-secondary flex items-center gap-1.5">
                <CreditCard size={16} />
                {order.total_amount || "0.00"} {order.currency || "EUR"}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex lg:flex-col gap-2 lg:pt-0 pt-2 border-t lg:border-t-0 lg:border-l border-accent/10 lg:pl-3">
            <CustomButton
              onClick={() => {
                setSelectedOrder(order);
                setReviewDialogOpen(true);
                setReviewForm({ rating: 5, comment: "" });
              }}
              className="bg-accent text-white hover:bg-accent/90 w-full lg:w-auto whitespace-nowrap flex items-center justify-center gap-1.5 text-sm py-2 px-3"
            >
              <MessageSquare size={14} />
              Add Review
            </CustomButton>
          </div>
        </div>
      </div>
    );
  };
  // useEffect(() => {
  //     const load = async () => {
  //         if (!isAuthenticated()) {
  //             setIsLoading(false);
  //             return;
  //         }
  //         try {
  //             const res = await apiFetcher.get('/api/repair/orders/');
  //             const list = res?.data || res || [];
  //             setOrders(Array.isArray(list) ? list : (list.results || []));
  //         } catch (e) {
  //             setError('Failed to load orders');
  //         } finally {
  //             setIsLoading(false);
  //         }
  //     };
  //     load();
  // }, [isAuthenticated]);

  if (!isAuthenticated()) {
    return (
      <PageTransition>
        <div className="min-h-screen relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-accent/20 p-8">
              <h2 className="text-2xl font-bold text-secondary mb-4">
                Please log in to view your orders
              </h2>
              <Link href="/login">
                <CustomButton className="bg-secondary text-primary hover:bg-secondary/90 px-8 py-3">
                  Go to Login
                </CustomButton>
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden flex flex-col">
        <div className="container mx-auto px-4 py-8 flex flex-col flex-1 min-h-0">
          <MotionFade delay={0.1} immediate={true}>
            <div className="flex flex-col flex-1 min-h-0 rounded-xl">
              {/* Fixed Header */}
              <div className="flex-shrink-0 flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-secondary">My Orders</h2>
              </div>

              {/* Fixed Tabs */}
              <div className="flex-shrink-0 flex flex-wrap gap-2 mb-4 border-b border-accent/20 pb-3">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === "all"
                      ? "bg-accent text-white shadow-md"
                      : "bg-white/5 text-accent hover:bg-white/10"
                  }`}
                >
                  <Package size={16} />
                  All Orders
                  {!isLoading && (
                    <Badge
                      variant="outline"
                      className={`ml-1 text-xs ${
                        activeTab === "all"
                          ? "border-primary/30 text-primary"
                          : "text-accent"
                      }`}
                    >
                      {totalOrders}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("repair")}
                  className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all flex items-center gap-2 ${
                    activeTab === "repair"
                      ? "bg-blue-500/20 text-blue-500 border border-blue-500/30 shadow-md"
                      : "bg-white/5 text-accent hover:bg-white/10"
                  }`}
                >
                  <Wrench size={16} />
                  Repair Services
                  {!isLoading && normalizedRepairOrders.length > 0 && (
                    <Badge
                      variant="outline"
                      className={`ml-1 text-xs ${
                        activeTab === "repair"
                          ? "border-blue-500/30 text-blue-500"
                          : "text-accent"
                      }`}
                    >
                      {normalizedRepairOrders.length}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("phone")}
                  className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all flex items-center gap-2 ${
                    activeTab === "phone"
                      ? "bg-green-500/20 text-green-500 border border-green-500/30 shadow-md"
                      : "bg-white/5 text-accent hover:bg-white/10"
                  }`}
                >
                  <Smartphone size={16} />
                  New Phones
                  {!isLoading && normalizedPhoneOrders.length > 0 && (
                    <Badge
                      variant="outline"
                      className={`ml-1 text-xs ${
                        activeTab === "phone"
                          ? "border-green-500/30 text-green-500"
                          : "text-accent"
                      }`}
                    >
                      {normalizedPhoneOrders.length}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("accessory")}
                  className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all flex items-center gap-2 ${
                    activeTab === "accessory"
                      ? "bg-purple-500/10 text-purple-500 border border-purple-500/30 shadow-md"
                      : "bg-white/5 text-accent hover:bg-white/10"
                  }`}
                >
                  <ShoppingBag size={16} />
                  Accessories
                  {!isLoading && normalizedAccessoryOrders.length > 0 && (
                    <Badge
                      variant="outline"
                      className={`ml-1 text-black text-xs ${
                        activeTab === "accessory"
                          ? "border-purple-500/30 text-purple-500"
                          : "text-black"
                      }`}
                    >
                      {normalizedAccessoryOrders.length}
                    </Badge>
                  )}
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                      <div
                        key={i}
                        className="p-4 bg-white/5 rounded-lg border border-accent/10"
                      >
                        <Skeleton className="h-6 w-40 mb-2 bg-white/10" />
                        <Skeleton className="h-8 w-64 bg-white/10" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-accent">{error}</div>
                ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-accent/40 mb-4" />
                  <p className="text-accent/80 text-lg">
                    {activeTab === "all"
                      ? "No orders found."
                      : `No ${
                          activeTab === "repair"
                            ? "repair service"
                            : activeTab === "phone"
                            ? "phone"
                            : "accessory"
                        } orders found.`}
                  </p>
                  <p className="text-accent/60 text-sm mt-2">
                    {activeTab === "all"
                      ? "Your orders will appear here once you place an order."
                      : `Try switching to a different tab or place a ${
                          activeTab === "repair"
                            ? "repair service"
                            : activeTab === "phone"
                            ? "phone"
                            : "accessory"
                        } order.`}
                  </p>
                </div>
                ) : (
                  <div className="space-y-3">
                    {activeTab === "all" ? (
                      // Show all orders grouped by type when "All" is selected
                      <>
                        {/* Repair Service Orders */}
                        {normalizedRepairOrders.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-accent/20">
                              <div className="p-1.5 bg-blue-500/20 rounded-lg">
                                <Wrench size={16} className="text-blue-300" />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-secondary">
                                  Repair Services
                                </h3>
                                <p className="text-xs text-accent/60">
                                  {normalizedRepairOrders.length}{" "}
                                  {normalizedRepairOrders.length === 1
                                    ? "order"
                                    : "orders"}
                                </p>
                              </div>
                            </div>
                            {normalizedRepairOrders
                              .slice(0, activeTab === "all" ? undefined : undefined)
                              .map((order) => renderOrderCard(order))}
                          </div>
                        )}

                        {/* New Phone Orders */}
                        {normalizedPhoneOrders.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-accent/20">
                              <div className="p-1.5 bg-green-500/20 rounded-lg">
                                <Smartphone
                                  size={16}
                                  className="text-green-300"
                                />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-secondary">
                                  New Phones
                                </h3>
                                <p className="text-xs text-accent/60">
                                  {normalizedPhoneOrders.length}{" "}
                                  {normalizedPhoneOrders.length === 1
                                    ? "order"
                                    : "orders"}
                                </p>
                              </div>
                            </div>
                            {normalizedPhoneOrders
                              .slice(0, activeTab === "all" ? undefined : undefined)
                              .map((order) => renderOrderCard(order))}
                          </div>
                        )}

                        {/* Accessories Orders */}
                        {normalizedAccessoryOrders.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-1.5 border-b border-accent/20">
                              <div className="p-1.5 bg-purple-500/20 rounded-lg">
                                <ShoppingBag
                                  size={16}
                                  className="text-purple-300"
                                />
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-secondary">
                                  Accessories
                                </h3>
                                <p className="text-xs text-accent/60">
                                  {normalizedAccessoryOrders.length}{" "}
                                  {normalizedAccessoryOrders.length === 1
                                    ? "order"
                                    : "orders"}
                                </p>
                              </div>
                            </div>
                            {normalizedAccessoryOrders
                              .slice(0, activeTab === "all" ? undefined : undefined)
                              .map((order) => renderOrderCard(order))}
                          </div>
                        )}
                      </>
                    ) : (
                      // Show filtered orders when a specific tab is selected
                      visibleOrders.map((order) => renderOrderCard(order))
                    )}
                  </div>
                )}
              </div>

              {/* Show More Button - Only show for individual tabs, not "all" */}
              {!isLoading && !error && hasMore && activeTab !== "all" && (
                <div className="flex-shrink-0 flex justify-center pt-4 border-t border-accent/20 mt-4">
                  <CustomButton
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    className="bg-accent text-white hover:bg-accent/90 px-6 py-2"
                  >
                    Show More ({filteredOrders.length - visibleCount} remaining)
                  </CustomButton>
                </div>
              )}
            </div>
          </MotionFade>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="bg-primary border-accent/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-secondary">Add Review</DialogTitle>
            <DialogDescription className="text-accent/80">
              {selectedOrder && (
                <>
                  Review for{" "}
                  {selectedOrder.productName ||
                    selectedOrder.phone_model_name ||
                    selectedOrder.product_title ||
                    "this product"}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-accent mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      setReviewForm((prev) => ({ ...prev, rating }))
                    }
                    className="focus:outline-none cursor-pointer hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= reviewForm.rating
                          ? "text-yellow-400 fill-current"
                          : "text-accent/30"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-accent mb-2">
                Your Review
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                required
                rows={4}
                className="w-full px-4 py-2 bg-white/5 border border-accent/20 rounded-lg text-accent focus:outline-none focus:border-secondary resize-none"
                placeholder="Share your experience with this product..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <CustomButton
                onClick={async () => {
                  if (!reviewForm.comment.trim()) {
                    toast.error("Please enter your review");
                    return;
                  }

                  setIsSubmittingReview(true);
                  const loadingToast = toast.loading("Submitting review...");

                  try {
                    // Determine review type and endpoint based on order type
                    let endpoint;
                    let payload;

                    if (selectedOrder.orderType === "repair") {
                      endpoint = "/api/repair/review/";
                      payload = {
                        rating: reviewForm.rating,
                        review: reviewForm.comment.trim(),
                        order_id: selectedOrder?.id,
                      };
                    } else if (selectedOrder.orderType === "phone") {
                      endpoint = "/api/brandnew/review/";
                      payload = {
                        rating: reviewForm.rating,
                        review: reviewForm.comment.trim(),
                        order_id: selectedOrder?.id,
                      };
                    } else if (selectedOrder.orderType === "accessory") {
                      endpoint = "/api/accessories/review/";
                      payload = {
                        rating: reviewForm.rating,
                        review: reviewForm.comment.trim(),
                        order_id: selectedOrder?.id,
                      };
                    }

                    await apiFetcher.post(endpoint, payload);

                    toast.dismiss(loadingToast);
                    toast.success("Review submitted successfully!");

                    setReviewDialogOpen(false);
                    setReviewForm({ rating: 5, comment: "" });
                    setSelectedOrder(null);
                  } catch (error) {
                    toast.dismiss(loadingToast);
          
                    toast.error(
                      error.response?.data?.message ||
                        error.response?.data.order_id ||
                        "Failed to submit review. Please try again."
                    );
                  } finally {
                    setIsSubmittingReview(false);
                  }
                }}
                disabled={isSubmittingReview}
                className="bg-secondary text-primary hover:bg-secondary/90 flex-1"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </CustomButton>
              <CustomButton
                onClick={() => {
                  setReviewDialogOpen(false);
                  setReviewForm({ rating: 5, comment: "" });
                  setSelectedOrder(null);
                }}
                disabled={isSubmittingReview}
                className="bg-white/10 text-accent hover:bg-white/20 flex-1"
              >
                Cancel
              </CustomButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <PageTransition>
          <div className="min-h-screen relative overflow-hidden bg-primary">
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-4">
                <Skeleton className="h-12 w-64 bg-white/10" />
                <Skeleton className="h-96 w-full bg-white/10" />
              </div>
            </div>
          </div>
        </PageTransition>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}

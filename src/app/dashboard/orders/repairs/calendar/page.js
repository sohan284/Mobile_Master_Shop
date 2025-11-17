"use client";

import React, { useMemo, useState } from "react";
import PageTransition from "@/components/animations/PageTransition";
import { useApiGet } from "@/hooks/useApi";
import { apiFetcher } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Clock,
  Edit2,
  Check,
  X,
  Loader2,
  Phone,
} from "lucide-react";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getScheduleDateKey = (schedule) => {
  if (!schedule) return null;
  const scheduleDate = new Date(schedule);
  if (isNaN(scheduleDate.getTime())) return null;
  const year = scheduleDate.getUTCFullYear();
  const month = String(scheduleDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(scheduleDate.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isSameDay = (dateA, dateB) => {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const formatScheduleDisplay = (schedule) => {
  if (!schedule) return null;
  const date = new Date(schedule);
  if (isNaN(date.getTime())) return null;

  const utcYear = date.getUTCFullYear();
  const utcMonth = date.getUTCMonth();
  const utcDay = date.getUTCDate();
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();

  const localeDate = new Date(utcYear, utcMonth, utcDay, utcHours, utcMinutes);

  const formattedDate = localeDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const hour12 = utcHours === 0 ? 12 : utcHours > 12 ? utcHours - 12 : utcHours;
  const ampm = utcHours >= 12 ? "PM" : "AM";
  const formattedTime = `${hour12.toString().padStart(2, "0")}:${utcMinutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  const scheduleDate = date;
  const now = new Date();

  return {
    full: `${formattedDate} at ${formattedTime}`,
    date: formattedDate,
    time: formattedTime,
    isPast: scheduleDate < now,
    isToday: scheduleDate.toDateString() === now.toDateString(),
  };
};

const getStatusBadge = (status) => {
  const normalized = (status || "").toLowerCase();
  if (["confirmed", "completed", "delivered"].includes(normalized)) {
    return "bg-green-100 text-green-700 border-green-200";
  }
  if (["pending", "processing"].includes(normalized)) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }
  if (["cancelled", "canceled", "refunded"].includes(normalized)) {
    return "bg-red-100 text-red-700 border-red-200";
  }
  if (normalized === "shipped") {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
};

export default function RepairCalendarPage() {
  const t = useTranslations("dashboard.repairCalendar");
  const queryClient = useQueryClient();
  const today = useMemo(() => new Date(), []);

  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(() => today);
  const [editingSchedule, setEditingSchedule] = useState({});
  const [scheduleValues, setScheduleValues] = useState({});
  const [updatingSchedule, setUpdatingSchedule] = useState({});

  const {
    data: ordersData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useApiGet(["repairOrdersCalendar"], () => {
    const params = new URLSearchParams();
    params.append("order_type", "repair");
    params.append("page_size", "500");
    params.append("ordering", "schedule");
    return apiFetcher.get(`/api/admin/orders/?${params.toString()}`);
  });

  const normalizedOrders = useMemo(() => {
    const source = Array.isArray(ordersData?.data)
      ? ordersData.data
      : Array.isArray(ordersData?.results)
      ? ordersData.results
      : Array.isArray(ordersData)
      ? ordersData
      : [];

    return source
      .map((order) => ({
        ...order,
        orderNumber: order.order_number || `#${order.id}`,
        customerName: order.customer_name || "N/A",
        customerPhone: order.customer_phone || "",
        productName: order.phone_model_name || order.product_title || "N/A",
        brandName: order.brand_name || order.phone_model_brand || "",
        status: order.status || "pending",
        paymentStatus: order.payment_status || "unknown",
        schedule: order.schedule || null,
      }))
      .sort((a, b) => {
        if (!a.schedule && !b.schedule) return 0;
        if (!a.schedule) return 1;
        if (!b.schedule) return -1;
        return new Date(a.schedule) - new Date(b.schedule);
      });
  }, [ordersData]);

  const ordersByDate = useMemo(() => {
    return normalizedOrders.reduce((acc, order) => {
      const key = getScheduleDateKey(order.schedule);
      if (!key) return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {});
  }, [normalizedOrders]);

  const scheduledOrders = normalizedOrders.filter((order) => order.schedule);

  const selectedDateKey = formatDateKey(selectedDate);
  const ordersForSelectedDate = ordersByDate[selectedDateKey] || [];

  const calendarDays = useMemo(() => {
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const startDayIndex = (startOfMonth.getDay() + 6) % 7; // Monday first
    const firstVisibleDate = new Date(startOfMonth);
    firstVisibleDate.setDate(firstVisibleDate.getDate() - startDayIndex);

    return Array.from({ length: 42 }).map((_, index) => {
      const date = new Date(firstVisibleDate);
      date.setDate(firstVisibleDate.getDate() + index);
      const dateKey = formatDateKey(date);
      return {
        date,
        dateKey,
        isCurrentMonth: date.getMonth() === currentMonth.getMonth(),
        isToday: isSameDay(date, today),
        isSelected: isSameDay(date, selectedDate),
        orderCount: ordersByDate[dateKey]?.length || 0,
      };
    });
  }, [currentMonth, ordersByDate, selectedDate, today]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDate(now);
  };

  const startEditing = (order) => {
    const orderId = order.id;
    let defaultValue = "";
    if (order.schedule) {
      const date = new Date(order.schedule);
      if (!isNaN(date.getTime())) {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
        defaultValue = `${year}-${month}-${day}T${hours}:${minutes}`;
      }
    }
    setEditingSchedule((prev) => ({ ...prev, [orderId]: true }));
    setScheduleValues((prev) => ({ ...prev, [orderId]: defaultValue }));
  };

  const cancelEditing = (orderId) => {
    setEditingSchedule((prev) => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
    setScheduleValues((prev) => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
  };

  const handleScheduleUpdate = async (order, isoString) => {
    const orderId = order.id;
    if (!orderId) return;

    setUpdatingSchedule((prev) => ({ ...prev, [orderId]: true }));
    try {
      await apiFetcher.patch(`/api/repair/orders/${orderId}/`, {
        schedule: isoString,
      });
      queryClient.invalidateQueries({ queryKey: ["repairOrdersCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["repairOrders"] });
      toast.success(t("scheduleUpdated"));
      cancelEditing(orderId);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || t("scheduleUpdateFailed")
      );
    } finally {
      setUpdatingSchedule((prev) => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    }
  };

  const saveSchedule = (order) => {
    const orderId = order.id;
    const value = scheduleValues[orderId];
    if (!value) {
      toast.error(t("schedulePlaceholder"));
      return;
    }
    const localDate = new Date(value);
    const isoString = localDate.toISOString();
    handleScheduleUpdate(order, isoString);
  };

  const renderScheduleEditor = (order) => {
    const orderId = order.id;
    const isUpdating = updatingSchedule[orderId];
    return (
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="datetime-local"
          className="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={scheduleValues[orderId] || ""}
          onChange={(event) =>
            setScheduleValues((prev) => ({
              ...prev,
              [orderId]: event.target.value,
            }))
          }
          disabled={isUpdating}
        />
        <div className="flex gap-2">
          <button
            onClick={() => saveSchedule(order)}
            disabled={isUpdating}
            className="flex items-center justify-center rounded-xl bg-green-500 px-3 py-2 text-white transition hover:bg-green-600 disabled:opacity-60"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => cancelEditing(orderId)}
            disabled={isUpdating}
            className="flex items-center justify-center rounded-xl bg-gray-100 px-3 py-2 text-gray-600 transition hover:bg-gray-200 disabled:opacity-60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderScheduleBadge = (order) => {
    const info = formatScheduleDisplay(order.schedule);
    if (!info) {
      return (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-gray-300 px-3 py-2">
          <span className="text-sm text-gray-500 italic">
            {t("addSchedule")}
          </span>
          <button
            onClick={() => startEditing(order)}
            className="text-blue-600 transition hover:text-blue-800"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
      );
    }

    const badgeStyle = info.isPast
      ? "bg-red-50 border-red-200 text-red-700"
      : info.isToday
      ? "bg-amber-50 border-amber-200 text-amber-700"
      : "bg-blue-50 border-blue-200 text-blue-700";

    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2 text-sm font-medium shadow-sm">
        <div
          className={`flex flex-col rounded-lg border px-3 py-2 text-sm ${badgeStyle}`}
        >
          <span>{info.date}</span>
          <span className="text-xs font-semibold">{info.time}</span>
        </div>
        <button
          onClick={() => startEditing(order)}
          className="text-blue-600 transition hover:text-blue-800"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      </div>
    );
  };

  if (isLoading && !ordersData) {
    return (
      <PageTransition>
        <div className="flex h-[70vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      </PageTransition>
    );
  }

  const monthLabel = currentMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const selectedDateLabel = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("title")}
            </h1>
            <p className="text-gray-600">{t("subtitle")}</p>
            <p className="mt-2 text-sm text-gray-500">
              {t("scheduledCount", { count: scheduledOrders.length })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleToday}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
            >
              <CalendarDays className="h-4 w-4" />
              {t("today")}
            </button>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isRefetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              {t("refresh")}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error?.message || "Failed to load repair orders."}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-3">
          <section className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <header className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-blue-600 tracking-widest">
                  {t("calendar")}
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {monthLabel}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="rounded-2xl border border-gray-200 p-2 text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="rounded-2xl border border-gray-200 p-2 text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </header>
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
              {WEEK_DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {calendarDays.map((day) => (
                <button
                  key={day.dateKey}
                  onClick={() => setSelectedDate(day.date)}
                  className={`flex min-h-[90px] flex-col rounded-2xl border p-3 text-left transition ${
                    day.isSelected
                      ? "border-blue-500 bg-blue-50"
                      : day.isCurrentMonth
                      ? "border-gray-200 bg-white hover:border-blue-200"
                      : "border-dashed border-gray-200 bg-gray-50 text-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{day.date.getDate()}</span>
                    {day.isToday && (
                      <span className="text-xs text-blue-600">●</span>
                    )}
                  </div>
                  {day.orderCount > 0 && (
                    <span className="mt-auto inline-flex w-fit rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      {day.orderCount} orders
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="flex max-h-[640px] flex-col rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6">
              <p className="text-sm font-semibold uppercase text-blue-600 tracking-widest">
                {t("ordersFor", { date: selectedDateLabel })}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {ordersForSelectedDate.length}
              </p>
              <p className="text-sm text-gray-500">
                {t("scheduledCount", { count: ordersForSelectedDate.length })}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {ordersForSelectedDate.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  {t("noOrders")}
                </div>
              ) : (
                <div className="space-y-4">
                  {ordersForSelectedDate.map((order) => {
                    const isEditing = editingSchedule[order.id];
                    const isUpdating = updatingSchedule[order.id];
                    return (
                      <article
                        key={order.id}
                        className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-500">
                              {order.orderNumber}
                            </p>
                            <h3 className="text-lg font-bold text-gray-900">
                              {order.customerName}
                            </h3>
                            {/* <p className="text-sm text-gray-500">
                              {order.brandName && `${order.brandName} · ` }
                              {order.productName}
                            </p> */}
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">
                              {order.customerPhone || "—"}
                            </span>
                          </div>
                          {isEditing
                            ? renderScheduleEditor(order)
                            : renderScheduleBadge(order)}
                          {isUpdating && (
                            <p className="text-xs text-blue-500">
                              {t("editSchedule")}...
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

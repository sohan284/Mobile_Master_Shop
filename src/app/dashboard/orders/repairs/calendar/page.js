"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
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
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getInitialCustomOrderForm = () => ({
  brandId: "",
  brandSlug: "",
  modelId: "",
  problems: [],
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerAddress: "",
  schedule: "",
  notes: "",
});

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formState, setFormState] = useState(() => getInitialCustomOrderForm());
  const [brandOptions, setBrandOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [problemOptions, setProblemOptions] = useState([]);
  const [isFetchingBrands, setIsFetchingBrands] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [isFetchingProblems, setIsFetchingProblems] = useState(false);
  const [isSubmittingCustomOrder, setIsSubmittingCustomOrder] = useState(false);
  const resetCustomOrderForm = useCallback(() => {
    setFormState(getInitialCustomOrderForm());
    setModelOptions([]);
    setProblemOptions([]);
  }, []);

  useEffect(() => {
    if (!isCreateModalOpen) {
      resetCustomOrderForm();
    }
  }, [isCreateModalOpen, resetCustomOrderForm]);

  useEffect(() => {
    let isMounted = true;
    const fetchBrands = async () => {
      setIsFetchingBrands(true);
      try {
        const response = await apiFetcher.get("/api/repair/brands/");
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response)
          ? response
          : [];
        if (isMounted) {
          setBrandOptions(list);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            t("customOrderLoadFailed") ||
            "Failed to load brands"
        );
      } finally {
        if (isMounted) {
          setIsFetchingBrands(false);
        }
      }
    };
    fetchBrands();
    return () => {
      isMounted = false;
    };
  }, [t]);

  useEffect(() => {
    if (!formState.brandId) {
      setModelOptions([]);
      return;
    }
    let isMounted = true;
    const fetchModels = async () => {
      setIsFetchingModels(true);
      try {
        const param = formState.brandSlug || formState.brandId;
        const url = param
          ? `/api/repair/models/?brand=${encodeURIComponent(param)}`
          : "/api/repair/models/";
        const response = await apiFetcher.get(url);
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response)
          ? response
          : [];
        if (isMounted) {
          setModelOptions(list);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            t("customOrderLoadFailed") ||
            "Failed to load models"
        );
      } finally {
        if (isMounted) {
          setIsFetchingModels(false);
        }
      }
    };
    fetchModels();
    return () => {
      isMounted = false;
    };
  }, [formState.brandId, formState.brandSlug, t]);

  useEffect(() => {
    if (!formState.modelId) {
      setProblemOptions([]);
      return;
    }
    let isMounted = true;
    const fetchProblems = async () => {
      setIsFetchingProblems(true);
      try {
        const response = await apiFetcher.get(
          `/api/repair/problems/?model=${formState.modelId}`
        );
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response)
          ? response
          : [];
        if (isMounted) {
          setProblemOptions(list);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            t("customOrderLoadFailed") ||
            "Failed to load problems"
        );
      } finally {
        if (isMounted) {
          setIsFetchingProblems(false);
        }
      }
    };
    fetchProblems();
    return () => {
      isMounted = false;
    };
  }, [formState.modelId, t]);
  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    error: errorOrders,
    refetch,
    isRefetching,
  } = useApiGet(["repairOrdersCalendar"], () => {
    const params = new URLSearchParams();
    params.append("order_type", "repair");
    params.append("page_size", "500");
    params.append("ordering", "schedule");
    return apiFetcher.get(`/api/admin/orders/?${params.toString()}`);
  });

  const {
    data: customOrdersData,
    isLoading: isLoadingCustomOrders,
    error: customOrdersError,
    refetch: refetchCustomOrders,
  } = useApiGet(["customRepairOrders"], () =>
    apiFetcher.get("/api/repair/custom-orders/")
  );
  const handleBrandSelect = useCallback(
    (value) => {
      const brand = brandOptions.find((item) => String(item.id) === value);
      setFormState((prev) => ({
        ...prev,
        brandId: value,
        brandSlug: brand?.slug || "",
        modelId: "",
        problems: [],
      }));
    },
    [brandOptions]
  );

  const handleModelSelect = useCallback((value) => {
    setFormState((prev) => ({
      ...prev,
      modelId: value,
      problems: [],
    }));
  }, []);

  const handleProblemToggle = useCallback((problemId, checked) => {
    setFormState((prev) => {
      const exists = prev.problems.includes(problemId);
      let updated = prev.problems;
      if (checked && !exists) {
        updated = [...prev.problems, problemId];
      } else if (!checked && exists) {
        updated = prev.problems.filter((id) => id !== problemId);
      }
      return { ...prev, problems: updated };
    });
  }, []);

  const updateFormField = useCallback((field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleCreateCustomOrder = useCallback(async () => {
    if (!formState.brandId) {
      toast.error(t("customOrderValidationBrand"));
      return;
    }
    if (!formState.modelId) {
      toast.error(t("customOrderValidationModel"));
      return;
    }
    if (formState.problems.length === 0) {
      toast.error(t("customOrderValidationProblems"));
      return;
    }
    if (!formState.customerName.trim()) {
      toast.error(t("customOrderValidationName"));
      return;
    }
    if (!formState.customerPhone.trim()) {
      toast.error(t("customOrderValidationPhone"));
      return;
    }
    if (!formState.schedule) {
      toast.error(t("customOrderValidationSchedule"));
      return;
    }

    const scheduleDate = new Date(formState.schedule);
    if (Number.isNaN(scheduleDate.getTime())) {
      toast.error(t("customOrderValidationSchedule"));
      return;
    }

    setIsSubmittingCustomOrder(true);
    try {
      const problemIds = formState.problems.map((id) => Number(id));
      const payload = {
        brand: Number(formState.brandId),
        model: Number(formState.modelId),
        problem: problemIds,
        customer_name: formState.customerName.trim(),
        customer_email: formState.customerEmail.trim() || null,
        customer_phone: formState.customerPhone.trim(),
        address: formState.customerAddress.trim(),
        notes: formState.notes.trim() || undefined,
        schedule: scheduleDate.toISOString(),
      };

      await apiFetcher.post("/api/repair/custom-orders/", payload);
      toast.success(t("customOrderCreated"));
      setIsCreateModalOpen(false);
      resetCustomOrderForm();
      refetchCustomOrders();
      refetch();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          t("customOrderCreateFailed") ||
          "Failed to create custom order"
      );
    } finally {
      setIsSubmittingCustomOrder(false);
    }
  }, [
    formState,
    refetch,
    refetchCustomOrders,
    resetCustomOrderForm,
    t,
  ]);



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
        originalId: order.id,
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

  const normalizedCustomOrders = useMemo(() => {
    const source = Array.isArray(customOrdersData?.data)
      ? customOrdersData.data
      : Array.isArray(customOrdersData?.results)
      ? customOrdersData.results
      : Array.isArray(customOrdersData)
      ? customOrdersData
      : [];

    return source.map((order) => {
      const problemList = Array.isArray(order.problems)
        ? order.problems
        : Array.isArray(order.problem_details)
        ? order.problem_details
        : Array.isArray(order.problem_names)
        ? order.problem_names
        : [];
      const problemNames = problemList
        .map((problem) => {
          if (typeof problem === "string") return problem;
          return (
            problem?.name ||
            problem?.title ||
            problem?.problem_name ||
            problem?.label ||
            ""
          );
        })
        .filter(Boolean);

      return {
        ...order,
        id: `custom-${order.id}`,
        originalId: order.id,
        orderNumber: order.reference || order.order_number || `CUST-${order.id}`,
        customerName: order.customer_name || "N/A",
        customerPhone: order.customer_phone || "",
        productName:
          order.model_name ||
          order.model?.name ||
          order.phone_model_name ||
          "Repair Service",
        brandName: order.brand_name || order.brand?.name || "Custom",
        status: order.status || "custom",
        paymentStatus: order.payment_status || "unpaid",
        schedule: order.schedule || null,
        problemsSummary: problemNames.join(", "),
        isCustom: true,
      };
    });
  }, [customOrdersData]);

  const allOrders = useMemo(
    () => [...normalizedOrders, ...normalizedCustomOrders],
    [normalizedOrders, normalizedCustomOrders]
  );

  const ordersByDate = useMemo(() => {
    return allOrders.reduce((acc, order) => {
      const key = getScheduleDateKey(order.schedule);
      if (!key) return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    }, {});
  }, [allOrders]);

  const scheduledOrders = allOrders.filter((order) => order.schedule);

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
    const orderKey = order.id;
    const targetId = order.originalId || order.id;
    if (!orderKey || !targetId) return;

    const endpoint = order.isCustom
      ? `/api/repair/custom-orders/${targetId}/`
      : `/api/repair/orders/${targetId}/`;

    setUpdatingSchedule((prev) => ({ ...prev, [orderKey]: true }));
    try {
      await apiFetcher.patch(endpoint, {
        schedule: isoString,
      });
      queryClient.invalidateQueries({ queryKey: ["repairOrdersCalendar"] });
      queryClient.invalidateQueries({ queryKey: ["repairOrders"] });
      if (order.isCustom) {
        refetchCustomOrders();
      }
      toast.success(t("scheduleUpdated"));
      cancelEditing(orderKey);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || t("scheduleUpdateFailed")
      );
    } finally {
      setUpdatingSchedule((prev) => {
        const next = { ...prev };
        delete next[orderKey];
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

  const combinedLoading = isLoadingOrders || isLoadingCustomOrders;
  const error = errorOrders || customOrdersError;

  if (combinedLoading && !ordersData && !customOrdersData) {
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
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" />
              {t("addCustomOrder")}
            </button>
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

          <section className="flex max-h-[75vh] flex-col rounded-3xl border border-gray-200 bg-white shadow-sm">
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
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {order.customerName}
                              </h3>
                              {order.isCustom && (
                                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                                  {t("customOrderTag")}
                                </span>
                              )}
                            </div>
                            {(order.brandName || order.productName) && (
                              <p className="text-sm text-gray-500">
                                {[order.brandName, order.productName]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            )}
                            {order.problemsSummary && (
                              <p className="text-xs text-gray-500">
                                {order.problemsSummary}
                              </p>
                            )}
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
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl border border-gray-200">
          <DialogHeader>
            <DialogTitle>{t("customOrderModalTitle")}</DialogTitle>
            <DialogDescription>
              {t("customOrderModalDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="custom-brand">{t("brandLabel")}</Label>
                <Select
                  value={formState.brandId}
                  onValueChange={handleBrandSelect}
                  disabled={isFetchingBrands || isSubmittingCustomOrder}
                >
                  <SelectTrigger id="custom-brand">
                    <SelectValue placeholder={t("selectBrand")} />
                  </SelectTrigger>
                  <SelectContent>
                    {brandOptions.map((brand) => (
                      <SelectItem key={brand.id} value={String(brand.id)}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-model">{t("modelLabel")}</Label>
                <Select
                  value={formState.modelId}
                  onValueChange={handleModelSelect}
                  disabled={
                    !formState.brandId ||
                    isFetchingModels ||
                    isSubmittingCustomOrder
                  }
                >
                  <SelectTrigger id="custom-model">
                    <SelectValue placeholder={t("selectModel")} />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map((model) => (
                      <SelectItem key={model.id} value={String(model.id)}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("problemsLabel")}</Label>
              <div className="rounded-xl border border-dashed border-gray-200 p-3 max-h-56 overflow-y-auto">
                {isFetchingProblems ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("loadingLabel")}
                  </div>
                ) : problemOptions.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    {t("noProblemsLabel")}
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {problemOptions.map((problem) => {
                      const problemId = String(problem.id);
                      const checked = formState.problems.includes(problemId);
                      return (
                        <label
                          key={problem.id}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                            checked
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) =>
                              handleProblemToggle(problemId, Boolean(value))
                            }
                          />
                          <span className="text-gray-700">{problem.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="custom-name">{t("customerNameLabel")}</Label>
                <Input
                  id="custom-name"
                  value={formState.customerName}
                  onChange={(event) =>
                    updateFormField("customerName", event.target.value)
                  }
                  placeholder={t("customerNamePlaceholder")}
                  disabled={isSubmittingCustomOrder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-email">{t("customerEmailLabel")}</Label>
                <Input
                  id="custom-email"
                  type="email"
                  value={formState.customerEmail}
                  onChange={(event) =>
                    updateFormField("customerEmail", event.target.value)
                  }
                  placeholder={t("customerEmailPlaceholder")}
                  disabled={isSubmittingCustomOrder}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="custom-phone">{t("customerPhoneLabel")}</Label>
                <Input
                  id="custom-phone"
                  value={formState.customerPhone}
                  onChange={(event) =>
                    updateFormField("customerPhone", event.target.value)
                  }
                  placeholder={t("customerPhonePlaceholder")}
                  disabled={isSubmittingCustomOrder}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-schedule">{t("scheduleLabel")}</Label>
                <Input
                  id="custom-schedule"
                  type="datetime-local"
                  value={formState.schedule}
                  onChange={(event) =>
                    updateFormField("schedule", event.target.value)
                  }
                  disabled={isSubmittingCustomOrder}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-address">{t("customerAddressLabel")}</Label>
              <Textarea
                id="custom-address"
                value={formState.customerAddress}
                onChange={(event) =>
                  updateFormField("customerAddress", event.target.value)
                }
                placeholder={t("customerAddressPlaceholder")}
                disabled={isSubmittingCustomOrder}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-notes">{t("notesLabel")}</Label>
              <Textarea
                id="custom-notes"
                value={formState.notes}
                onChange={(event) =>
                  updateFormField("notes", event.target.value)
                }
                placeholder={t("notesPlaceholder")}
                disabled={isSubmittingCustomOrder}
                rows={2}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              disabled={isSubmittingCustomOrder}
            >
              {t("cancelLabel")}
            </button>
            <button
              type="button"
              onClick={handleCreateCustomOrder}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              disabled={isSubmittingCustomOrder}
            >
              {isSubmittingCustomOrder && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {t("createOrderLabel")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}

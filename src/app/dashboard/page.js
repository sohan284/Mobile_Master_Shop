'use client';
import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import PageTransition from '@/components/animations/PageTransition';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingBag, 
  Package, 
  Smartphone, 
  Wrench, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw
} from 'lucide-react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Dashboard() {
  const [hoveredOrderStatus, setHoveredOrderStatus] = useState(null);

  // Fetch statistics from orders API without order_type parameter
  const { data: ordersData, isLoading, error } = useApiGet(
    ['dashboardStatistics'],
    () => apiFetcher.get('/api/admin/orders/')
  );

  const statistics = ordersData?.statistics || null;

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0.00';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Prepare data for bar chart - Revenue by Order Type
  const barChartData = useMemo(() => {
    if (!statistics?.revenue_by_type) return null;
    
    const categories = [];
    const series = [];
    const barColors = [];

    Object.entries(statistics.revenue_by_type).forEach(([type, revenue]) => {
      switch (type.toLowerCase()) {
        case 'phone':
          categories.push('New Phones');
          barColors.push('#10B981'); // green
          break;
        case 'repair':
          categories.push('Repairs');
          barColors.push('#3B82F6'); // blue
          break;
        case 'accessory':
          categories.push('Accessories');
          barColors.push('#8B5CF6'); // purple
          break;
        default:
          categories.push(type);
          barColors.push('#6B7280'); // gray
      }
      series.push(typeof revenue === 'string' ? parseFloat(revenue) : revenue);
    });

    return {
      series: [{
        name: 'Revenue',
        data: series
      }],
      options: {
        chart: {
          type: 'bar',
          height: 250,
          toolbar: { show: false },
          fontFamily: 'inherit'
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            columnWidth: '55%',
            dataLabels: {
              position: 'top'
            },
            distributed: true
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `€${formatCurrency(val)}`,
          offsetY: -20,
          style: {
            fontSize: '11px',
            colors: ['#374151']
          }
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: '11px',
              colors: '#6B7280'
            }
          }
        },
        yaxis: {
          labels: {
            formatter: (val) => `€${formatCurrency(val)}`,
            style: {
              fontSize: '11px',
              colors: '#6B7280'
            }
          }
        },
        colors: barColors,
        tooltip: {
          y: {
            formatter: (val) => `€${formatCurrency(val)}`
          }
        },
        grid: {
          borderColor: '#E5E7EB',
          strokeDashArray: 4
        }
      }
    };
  }, [statistics]);

  // Prepare data for pie chart - Order Type Distribution
  const pieChartData = useMemo(() => {
    if (!statistics?.order_type_summary) return null;

    const labels = [];
    const series = [];
    const colors = [];

    Object.entries(statistics.order_type_summary).forEach(([type, count]) => {
      switch (type.toLowerCase()) {
        case 'phone':
          labels.push('New Phones');
          colors.push('#10B981');
          break;
      case 'repair':
          labels.push('Repairs');
          colors.push('#3B82F6');
        break;
      case 'accessory':
          labels.push('Accessories');
          colors.push('#8B5CF6');
        break;
      default:
          labels.push(type);
          colors.push('#6B7280');
      }
      series.push(count || 0);
    });

    return {
      series: series,
      options: {
        chart: {
          type: 'pie',
          height: 250,
          fontFamily: 'inherit'
        },
        labels: labels,
        colors: colors,
        legend: {
          position: 'bottom',
          fontSize: '12px',
          labels: {
            colors: '#374151'
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val, opts) => {
            return `${opts.w.globals.series[opts.seriesIndex]} (${val.toFixed(1)}%)`;
          },
          style: {
            fontSize: '12px',
            fontWeight: 600,
            colors: ['#fff']
          }
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} orders`
          }
        }
      }
    };
  }, [statistics]);

  // Prepare data for pie chart - Order Status Distribution
  const orderStatusChartData = useMemo(() => {
    if (!statistics?.status_summary) return null;

    const labels = [];
    const series = [];
    const colors = [];

    Object.entries(statistics.status_summary).forEach(([status, count]) => {
      labels.push(status.charAt(0).toUpperCase() + status.slice(1));
      series.push(count || 0);
      
      switch (status.toLowerCase()) {
        case 'pending':
          colors.push('#FFA500'); // yellow
          break;
        case 'confirmed':
          colors.push('#10B981'); // green
          break;
        case 'processing':
          colors.push('#3B82F6'); // blue
          break;
        case 'shipped':
          colors.push('#6366F1'); // indigo
          break;
        case 'delivered':
          colors.push('#059669'); // emerald
          break;
        case 'cancelled':
        case 'canceled':
          colors.push('#EF4444'); // red
          break;
        case 'refunded':
          colors.push('#F97316'); // orange
          break;
        default:
          colors.push('#6B7280'); // gray
      }
    });

    return {
      series: series,
      options: {
        labels: labels,
        colors: colors,
        legend: {
          position: 'bottom',
          fontSize: '12px',
          labels: {
            colors: '#374151'
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val, opts) => {
            return `${opts.w.globals.series[opts.seriesIndex]} (${val.toFixed(1)}%)`;
          },
          style: {
            fontSize: '12px',
            fontWeight: 600,
            colors: ['#fff']
          }
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} orders`
          }
        },
        chart: {
          type: 'donut',
          height: 250,
          fontFamily: 'inherit',
          events: {
            dataPointMouseEnter: function(event, chartContext, config) {
              const dataPointIndex = config.dataPointIndex;
              const series = config.w.globals.series;
              const labels = config.w.globals.labels;
              if (series[dataPointIndex] !== undefined) {
                setHoveredOrderStatus({
                  label: labels[dataPointIndex],
                  value: series[dataPointIndex]
                });
              }
            },
            dataPointMouseLeave: function() {
              setHoveredOrderStatus(null);
            }
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
              labels: {
                show: true,
                total: {
                  show: true,
                  fontSize: '14px',
                  fontWeight: 600,
                  label: hoveredOrderStatus ? hoveredOrderStatus.label : 'Total',
                  formatter: function() {
                    if (hoveredOrderStatus) {
                      return hoveredOrderStatus.value.toString();
                    }
                    const total = this.globals.seriesTotals.reduce((a, b) => a + b, 0);
                    return total.toString();
                  }
                }
              }
            }
          }
        }
      }
    };
  }, [statistics, hoveredOrderStatus]);

  // Prepare data for bar chart - Payment Status Distribution
  const paymentStatusChartData = useMemo(() => {
    if (!statistics?.payment_summary) return null;

    const categories = [];
    const series = [];
    const barColors = [];

    Object.entries(statistics.payment_summary).forEach(([status, count]) => {
      categories.push(status.charAt(0).toUpperCase() + status.slice(1));
      series.push(count || 0);
      
      switch (status.toLowerCase()) {
        case 'paid':
          barColors.push('#10B981'); // green
          break;
        case 'pending':
          barColors.push('#FFA500'); // yellow
          break;
        case 'failed':
          barColors.push('#EF4444'); // red
          break;
        case 'refunded':
          barColors.push('#F97316'); // orange
          break;
        default:
          barColors.push('#6B7280'); // gray
      }
    });

    return {
      series: [{
        name: 'Orders',
        data: series
      }],
      options: {
        chart: {
          type: 'bar',
          height: 250,
          toolbar: { show: false },
          fontFamily: 'inherit'
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            columnWidth: '55%',
            dataLabels: {
              position: 'top'
            },
            distributed: true
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val} orders`,
          offsetY: -20,
          style: {
            fontSize: '11px',
            colors: ['#374151']
          }
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: '11px',
              colors: '#6B7280'
            }
          }
        },
        yaxis: {
          labels: {
            formatter: (val) => `${val}`,
            style: {
              fontSize: '11px',
              colors: '#6B7280'
            }
          }
        },
        colors: barColors,
        tooltip: {
          y: {
            formatter: (val) => `${val} orders`
          }
        },
        grid: {
          borderColor: '#E5E7EB',
          strokeDashArray: 4
        }
      }
    };
  }, [statistics]);

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
          <div className="mb-3">
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {/* Summary Cards Skeleton */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Skeleton - First Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <Skeleton className="h-5 w-40 mb-3" />
                  <Skeleton className="h-[250px] w-full rounded" />
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <Skeleton className="h-5 w-36 mb-3" />
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Charts Skeleton - Second Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <Skeleton className="h-5 w-28 mb-3" />
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <Skeleton className="h-5 w-32 mb-3" />
                  <Skeleton className="h-[250px] w-full rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-600">Error loading statistics: {error.message || 'Unknown error'}</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!statistics) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">No statistics available</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col">
        <div className="mb-3">
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of your business statistics</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Total Orders */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Orders</p>
                    <p className="text-xl font-bold text-gray-900">{statistics.total_orders || 0}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-2">
                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">
                      €{formatCurrency(statistics.total_revenue)}
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-full p-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Pending Revenue */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 mb-1">Pending Revenue</p>
                    <p className="text-xl font-bold text-gray-900">
                      €{formatCurrency(statistics.pending_revenue)}
                    </p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Order Types Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-600 mb-2">Order Types</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-gray-700">Phones: {statistics.order_type_summary?.phone || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wrench className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-gray-700">Repairs: {statistics.order_type_summary?.repair || 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-gray-700">Accessories: {statistics.order_type_summary?.accessory || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section - First Row: Bar (2 cols) + Pie (1 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Bar Chart - Revenue by Order Type - Takes 2 columns */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Revenue by Order Type</h2>
                {barChartData && typeof window !== 'undefined' ? (
                  <Chart
                    options={barChartData.options}
                    series={barChartData.series}
                    type="bar"
                    height={250}
                  />
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">
                    Loading chart...
                  </div>
                )}
              </div>

              {/* Pie Chart - Order Type Distribution - Takes 1 column */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Order Type Distribution</h2>
                {pieChartData && typeof window !== 'undefined' ? (
                  <Chart
                    options={pieChartData.options}
                    series={pieChartData.series}
                    type="pie"
                    height={250}
                  />
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">
                    Loading chart...
                  </div>
                )}
              </div>
            </div>

            {/* Charts Section - Second Row: 2 Donut Charts (1 col each) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Order Status Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Order Status</h2>
                {orderStatusChartData && typeof window !== 'undefined' ? (
                  <Chart
                    options={orderStatusChartData.options}
                    series={orderStatusChartData.series}
                    type="donut"
                    height={250}
                  />
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">
                    Loading chart...
                  </div>
                )}
              </div>

              {/* Payment Status Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Payment Status</h2>
                {paymentStatusChartData && typeof window !== 'undefined' ? (
                  <Chart
                    options={paymentStatusChartData.options}
                    series={paymentStatusChartData.series}
                    type="bar"
                    height={250}
                  />
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-500 text-sm">
                    Loading chart...
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

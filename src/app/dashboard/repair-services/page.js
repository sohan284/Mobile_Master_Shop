'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  Smartphone, 
  Users, 
  Calendar, 
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  Tag,
  List,
  Smartphone as PhoneIcon
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function RepairServicesPage() {
  const t = useTranslations('dashboard.repairServices');
  const router = useRouter();
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeServices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalServices: 6,
          totalBookings: 187,
          totalRevenue: 19180,
          activeServices: 5
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: t('brands'),
      description: t('manageBrands'),
      icon: Tag,
      href: '/dashboard/repair-services/brands',
      color: 'bg-blue-500'
    },
    {
      title: t('models'),
      description: t('manageModels'),
      icon: PhoneIcon,
      href: '/dashboard/repair-services/models',
      color: 'bg-green-500'
    },
    {
      title: t('services'),
      description: t('manageServices'),
      icon: List,
      href: '/dashboard/repair-services/problems',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10  p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('totalServices')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10  p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('totalBookings')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10  p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('totalRevenue')}</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10  p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Smartphone className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('activeServices')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeServices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10  rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{t('quickActions')}</h2>
          <p className="text-sm text-gray-600">{t('quickActionsDescription')}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => router.push(action.href)}
                className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
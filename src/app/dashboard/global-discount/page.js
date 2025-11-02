'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import {  Settings, Save, RefreshCw, Smartphone, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetcher } from '@/lib/api';

export default function GlobalDiscountPage() {
  const [discountSettings, setDiscountSettings] = useState({
    repairServices: {
      id: null,
      percentage: '',
      amount: '',
      is_active: true
    },
    newPhones: {
      id: null,
      percentage: '',
      amount: '',
      is_active: true
    },
    accessories: {
      id: null,
      percentage: '',
      amount: '',
      is_active: true
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRepairServices, setIsLoadingRepairServices] = useState(false);
  const [isLoadingNewPhones, setIsLoadingNewPhones] = useState(false);
  const [isLoadingAccessories, setIsLoadingAccessories] = useState(false);
  const [isSavingRepairServices, setIsSavingRepairServices] = useState(false);
  const [isSavingNewPhones, setIsSavingNewPhones] = useState(false);
  const [isSavingAccessories, setIsSavingAccessories] = useState(false);

  // Load discount settings on component mount
  useEffect(() => {
    loadDiscountSettings();
  }, []);

  const loadDiscountSettings = async () => {
    setIsLoading(true);
    setIsLoadingRepairServices(true);
    setIsLoadingNewPhones(true);
    setIsLoadingAccessories(true);
    
    try {
      // Fetch repair services discount
      const repairResponse = await apiFetcher.get('/api/repair/discount/');
      console.log('Repair services response:', repairResponse);
      if (repairResponse) {
        setDiscountSettings(prev => ({
          ...prev,
          repairServices: {
            id: repairResponse[0]?.id,
            percentage: repairResponse[0]?.percentage || '',
            amount: repairResponse[0]?.amount || '',
            is_active: repairResponse[0]?.is_active || true
          }
        }));
      }
      setIsLoadingRepairServices(false);

      // Fetch new phones discount
      const newPhonesResponse = await apiFetcher.get('/api/brandnew/discount/');
      console.log('New phones response:', newPhonesResponse);
      if (newPhonesResponse) {
        setDiscountSettings(prev => ({
          ...prev,
          newPhones: {
            id: newPhonesResponse?.data[0]?.id,
            percentage: newPhonesResponse?.data[0]?.percentage || '',
            amount: newPhonesResponse?.data[0]?.amount || '',
            is_active: newPhonesResponse?.data[0]?.is_active
          }
        }));
        console.log('Updated new phones state:', {
          id: newPhonesResponse?.data[0]?.id,
          percentage: newPhonesResponse?.data[0]?.percentage,
          amount: newPhonesResponse?.data[0]?.amount
        });
      }
      setIsLoadingNewPhones(false);

      // Fetch accessories discount
      const accessoriesResponse = await apiFetcher.get('/api/accessories/discount/');
      console.log('Accessories response:', accessoriesResponse);
      if (accessoriesResponse) {
        setDiscountSettings(prev => ({
          ...prev,
          accessories: {
            id: accessoriesResponse?.data?.[0]?.id || accessoriesResponse[0]?.id,
            percentage: accessoriesResponse?.data?.[0]?.percentage || accessoriesResponse[0]?.percentage || '',
            amount: accessoriesResponse?.data?.[0]?.amount || accessoriesResponse[0]?.amount || '',
            is_active: accessoriesResponse?.data?.[0]?.is_active ?? accessoriesResponse[0]?.is_active ?? true
          }
        }));
      }
      setIsLoadingAccessories(false);
    } catch (error) {
      console.error('Error loading discount settings:', error);
      toast.error('Failed to load discount settings');
      setIsLoadingRepairServices(false);
      setIsLoadingNewPhones(false);
      setIsLoadingAccessories(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRepairServices = async () => {
    setIsSavingRepairServices(true);
    try {
      if (discountSettings.repairServices?.id) {
        await apiFetcher.patch(`/api/repair/discounts/${discountSettings.repairServices?.id}/`, {
          percentage: discountSettings.repairServices.percentage,
          amount: discountSettings.repairServices.amount
        });
        toast.success('Repair services discount updated successfully!');
      }
    } catch (error) {
      console.error('Error updating repair services discount:', error);
      toast.error('Failed to update repair services discount');
    } finally {
      setIsSavingRepairServices(false);
    }
  };

  const handleUpdateNewPhones = async () => {
    console.log('Updating new phones discount:', discountSettings.newPhones);
    setIsSavingNewPhones(true);
    try {
      if (discountSettings.newPhones?.id) {
        await apiFetcher.patch(`/api/brandnew/discount/${discountSettings.newPhones?.id}/`, {
          percentage: discountSettings.newPhones.percentage,
          amount: discountSettings.newPhones.amount
        });
        toast.success('New phones discount updated successfully!');
      }
    } catch (error) {
      console.error('Error updating new phones discount:', error);
      toast.error('Failed to update new phones discount');
    } finally {
      setIsSavingNewPhones(false);
    }
  };

  const handleUpdateAccessories = async () => {
    console.log('Updating accessories discount:', discountSettings.accessories);
    setIsSavingAccessories(true);
    try {
      if (discountSettings.accessories?.id) {
        await apiFetcher.patch(`/api/accessories/discount/${discountSettings.accessories?.id}/`, {
          percentage: discountSettings.accessories.percentage,
          amount: discountSettings.accessories.amount
        });
        toast.success('Accessories discount updated successfully!');
      }
    } catch (error) {
      console.error('Error updating accessories discount:', error);
      toast.error('Failed to update accessories discount');
    } finally {
      setIsSavingAccessories(false);
    }
  };

  const updateDiscountSetting = (category, field, value) => {
    setDiscountSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const calculateDiscountAmount = (percentage, amount, baseAmount = 1000) => {
    if (percentage && parseFloat(percentage) > 0) {
      return (baseAmount * parseFloat(percentage)) / 100;
    }
    if (amount && parseFloat(amount) > 0) {
      return parseFloat(amount);
    }
    return 0;
  };

  const DiscountCard = ({ icon: Icon, iconColor, title, description, category, isLoading, isSaving, onUpdate }) => (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
            </div>
          </div>
          <Button
            onClick={onUpdate}
            disabled={isSaving || isLoading}
            size="sm"
            className="h-8 px-3 text-secondary cursor-pointer"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Input
                type="number"
                value={discountSettings[category].percentage}
                onChange={(e) => updateDiscountSetting(category, 'percentage', e.target.value)}
                placeholder="Percentage"
                min="0"
                step="0.01"
                className="h-9 pr-7"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
            </div>
            <div className="relative">
              <Input
                type="number"
                value={discountSettings[category].amount}
                onChange={(e) => updateDiscountSetting(category, 'amount', e.target.value)}
                placeholder="Amount"
                min="0"
                step="0.01"
                className="h-9 pr-7"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">€</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Discount Settings</h1>
          <p className="text-gray-600 mt-1">
            Set global discount rates for repair services, new phones, and accessories
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadDiscountSettings}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Discount Cards */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
     <DiscountCard
        icon={Settings}
        iconColor="text-blue-600"
        title="Repair Services Discount"
        description="Set global discount for all repair services"
        category="repairServices"
        isLoading={isLoadingRepairServices}
        isSaving={isSavingRepairServices}
        onUpdate={handleUpdateRepairServices}
      />

      <DiscountCard
        icon={Smartphone}
        iconColor="text-primary"
        title="New Phones Discount"
        description="Set global discount for all new phone models"
        category="newPhones"
        isLoading={isLoadingNewPhones}
        isSaving={isSavingNewPhones}
        onUpdate={handleUpdateNewPhones}
      />

      <DiscountCard
        icon={ShoppingBag}
        iconColor="text-purple-600"
        title="Accessories Discount"
        description="Set global discount for all accessories"
        category="accessories"
        isLoading={isLoadingAccessories}
        isSaving={isSavingAccessories}
        onUpdate={handleUpdateAccessories}
      />
     </div>
    </div>
  );
}
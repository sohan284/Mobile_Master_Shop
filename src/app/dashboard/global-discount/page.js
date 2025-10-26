'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import { Percent, DollarSign, Settings, Save, RefreshCw, Smartphone } from 'lucide-react';
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
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRepairServices, setIsLoadingRepairServices] = useState(false);
  const [isLoadingNewPhones, setIsLoadingNewPhones] = useState(false);
  const [isSavingRepairServices, setIsSavingRepairServices] = useState(false);
  const [isSavingNewPhones, setIsSavingNewPhones] = useState(false);

  // Load discount settings on component mount
  useEffect(() => {
    loadDiscountSettings();
  }, []);

  const loadDiscountSettings = async () => {
    setIsLoading(true);
    setIsLoadingRepairServices(true);
    setIsLoadingNewPhones(true);
    
    try {
      // Fetch repair services discount
      const repairResponse = await apiFetcher.get('/api/repair/discounts/');
      console.log('Repair services response:', repairResponse);
      if (repairResponse) {
        setDiscountSettings(prev => ({
          ...prev,
          repairServices: {
            id: repairResponse[0].id,
            percentage: repairResponse[0].percentage || '',
            amount: repairResponse[0].amount || '',
            is_active: repairResponse[0].is_active || true
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
            id: newPhonesResponse?.data[0].id,
            percentage: newPhonesResponse?.data[0].percentage || '',
            amount: newPhonesResponse?.data[0].amount || '',
            is_active: newPhonesResponse?.data[0].is_active
          }
        }));
        console.log('Updated new phones state:', {
          id: newPhonesResponse?.data[0].id,
          percentage: newPhonesResponse?.data[0].percentage,
          amount: newPhonesResponse?.data[0].amount
        });
      }
      setIsLoadingNewPhones(false);
    } catch (error) {
      console.error('Error loading discount settings:', error);
      toast.error('Failed to load discount settings');
      setIsLoadingRepairServices(false);
      setIsLoadingNewPhones(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRepairServices = async () => {
    setIsSavingRepairServices(true);
    try {
      if (discountSettings.repairServices.id) {
        await apiFetcher.patch(`/api/repair/discounts/${discountSettings.repairServices.id}/`, {
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
    setIsSavingNewPhones(true);
    try {
      if (discountSettings.newPhones.id) {
        await apiFetcher.patch(`/api/brandnew/discount/${discountSettings.newPhones.id}/`, {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Discount Settings</h1>
          <p className="text-gray-600 mt-2">
            Set global discount rates for repair services and new phones
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isLoading && (
            <div className="text-sm text-gray-500">Loading discount settings...</div>
          )}
          <Button
            variant="outline"
            onClick={loadDiscountSettings}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Repair Services Discount Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span>Repair Services Discount</span>
          </CardTitle>
          <CardDescription>
            Set global discount for all repair services
          </CardDescription>
         
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoadingRepairServices ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skeleton for Percentage Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-48" />
              </div>
              
              {/* Skeleton for Amount Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
              
              {/* Skeleton for Update Button */}
              <div className="md:col-span-2 flex justify-end">
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Discount Percentage */}
              <div className="space-y-2">
                <Label htmlFor="repair-percentage">Discount Percentage</Label>
                <div className="relative">
                  <Input
                    id="repair-percentage"
                    type="number"
                    value={discountSettings.repairServices.percentage}
                    onChange={(e) => updateDiscountSetting('repairServices', 'percentage', e.target.value)}
                    placeholder="Enter percentage (e.g., 10)"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </div>
                </div>
                <p className="text-xs text-gray-500">Enter percentage value (e.g., 10 for 10%)</p>
              </div>

              {/* Discount Amount */}
              <div className="space-y-2">
                <Label htmlFor="repair-amount">Discount Amount</Label>
                <div className="relative">
                  <Input
                    id="repair-amount"
                    type="number"
                    value={discountSettings.repairServices.amount}
                    onChange={(e) => updateDiscountSetting('repairServices', 'amount', e.target.value)}
                    placeholder="Enter amount (e.g., 50)"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </div>
                </div>
                <p className="text-xs text-gray-500">Enter fixed amount in dollars</p>
              </div>

              {/* Update Button */}
              <div className="md:col-span-2 flex justify-end">
                <Button
                  onClick={handleUpdateRepairServices}
                  disabled={isSavingRepairServices}
                  className="flex items-center space-x-2 bg-primary text-white hover:bg-primary/90 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSavingRepairServices ? 'Updating...' : 'Update Repair Services'}</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Phones Discount Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <span className="text-primary">New Phones Discount</span>
          </CardTitle>
          <CardDescription>
            Set global discount for all new phone models
          </CardDescription>
         
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoadingNewPhones ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skeleton for Percentage Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-48" />
              </div>
              
              {/* Skeleton for Amount Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-40" />
              </div>
              
              {/* Skeleton for Update Button */}
              <div className="md:col-span-2 flex justify-end">
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Discount Percentage */}
              <div className="space-y-2">
                <Label htmlFor="phones-percentage">Discount Percentage</Label>
                <div className="relative">
                  <Input
                    id="phones-percentage"
                    type="number"
                    value={discountSettings.newPhones.percentage}
                    onChange={(e) => updateDiscountSetting('newPhones', 'percentage', e.target.value)}
                    placeholder="Enter percentage (e.g., 15)"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </div>
                </div>
                <p className="text-xs text-gray-500">Enter percentage value (e.g., 15 for 15%)</p>
              </div>

              {/* Discount Amount */}
              <div className="space-y-2">
                <Label htmlFor="phones-amount">Discount Amount</Label>
                <div className="relative">
                  <Input
                    id="phones-amount"
                    type="number"
                    value={discountSettings.newPhones.amount}
                    onChange={(e) => updateDiscountSetting('newPhones', 'amount', e.target.value)}
                    placeholder="Enter amount (e.g., 100)"
                    min="0"
                    step="0.01"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </div>
                </div>
                <p className="text-xs text-gray-500">Enter fixed amount in dollars</p>
              </div>

              {/* Update Button */}
              <div className="md:col-span-2 flex justify-end">
                <Button
                  onClick={handleUpdateNewPhones}
                  disabled={isSavingNewPhones}
                  className="flex items-center space-x-2 bg-primary text-white hover:bg-primary/90 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSavingNewPhones ? 'Updating...' : 'Update New Phones'}</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

  
    </div>
  );
}

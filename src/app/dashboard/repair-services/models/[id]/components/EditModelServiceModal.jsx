'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import { apiFetcher } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

export default function EditModelServiceModal({ isOpen, onClose, onSuccess, service, modelId }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    problem: '',
    problem_name: '',
    original: {
      id: null,
      enabled: false,
      base_price: '',
      discount_type: 'none',
      discount_percentage: 0,
      discount_amount: 0,
    },
    duplicate: {
      id: null,
      enabled: false,
      base_price: '',
      discount_type: 'none',
      discount_percentage: 0,
      discount_amount: 0,
    },
    warranty_days: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when service prop changes
  useEffect(() => {
    if (service) {
      // Determine discount type for original
      const originalDiscountType = service?.original?.discount_percentage > 0 
        ? 'percentage' 
        : service?.original?.discount_amount > 0 
          ? 'amount' 
          : 'none';

      // Determine discount type for duplicate
      const duplicateDiscountType = service?.duplicate?.discount_percentage > 0 
        ? 'percentage' 
        : service?.duplicate?.discount_amount > 0 
          ? 'amount' 
          : 'none';

      setFormData({
        problem: service.problem_id?.toString() || '',
        problem_name: service.problem_name || '',
        original: {
          id: service?.original?.id || null,
          enabled: !!service?.original,
          base_price: service?.original?.base_price?.toString() || '',
          discount_type: originalDiscountType,
          discount_percentage: service?.original?.discount_percentage || 0,
          discount_amount: service?.original?.discount_amount || 0,
        },
        duplicate: {
          id: service?.duplicate?.id || null,
          enabled: !!service?.duplicate,
          base_price: service?.duplicate?.base_price?.toString() || '',
          discount_type: duplicateDiscountType,
          discount_percentage: service?.duplicate?.discount_percentage || 0,
          discount_amount: service?.duplicate?.discount_amount || 0,
        },
        warranty_days: service?.original?.warranty_days?.toString() || service?.duplicate?.warranty_days?.toString() || ''
      });
    }
  }, [service]);

  const handlePartTypeToggle = (partType, enabled) => {
    setFormData(prev => ({
      ...prev,
      [partType]: {
        ...prev[partType],
        enabled
      }
    }));
  };

  const handlePartTypeInputChange = (partType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [partType]: {
        ...prev[partType],
        [field]: value
      }
    }));
  };

  const handlePartTypeDiscountChange = (partType, discountType) => {
    setFormData(prev => ({
      ...prev,
      [partType]: {
        ...prev[partType],
        discount_type: discountType,
        discount_percentage: 0,
        discount_amount: 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.original.enabled && !formData.duplicate.enabled) {
      toast.error('Please enable at least one part type');
      return;
    }

    // Validate enabled part types
    const enabledPartTypes = [];
    if (formData.original.enabled) {
      if (!formData.original.base_price || isNaN(parseFloat(formData.original.base_price))) {
        toast.error('Please enter a valid base price for Original parts');
        return;
      }
      enabledPartTypes.push('original');
    }

    if (formData.duplicate.enabled) {
      if (!formData.duplicate.base_price || isNaN(parseFloat(formData.duplicate.base_price))) {
        toast.error('Please enter a valid base price for Duplicate parts');
        return;
      }
      enabledPartTypes.push('duplicate');
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Updating services...');

    try {
      // Prepare API calls for each enabled part type
      const apiCalls = [];

      // Update existing or create new for each enabled part type
      for (const partType of enabledPartTypes) {
        const partData = formData[partType];
        
        // Prepare discount fields based on discount type
        const discountData = {};
        if (partData.discount_type === 'percentage') {
          discountData.discount_percentage = parseFloat(partData.discount_percentage) || 0;
          discountData.discount_amount = 0;
        } else if (partData.discount_type === 'amount') {
          discountData.discount_percentage = 0;
          discountData.discount_amount = parseFloat(partData.discount_amount) || 0;
        } else {
          discountData.discount_percentage = 0;
          discountData.discount_amount = 0;
        }

        const payload = {
          phone_model: parseInt(modelId),
          problem: parseInt(formData.problem),
          part_type: partType,
          base_price: parseFloat(partData.base_price),
          ...discountData,
          warranty_days: formData.warranty_days ? parseInt(formData.warranty_days) : 0
        };

        // If ID exists, update; otherwise create new
        if (partData.id) {
          apiCalls.push(apiFetcher.patch(`/api/repair/repair-prices/${partData.id}/`, payload));
        } else {
          apiCalls.push(apiFetcher.post('/api/repair/repair-prices/', payload));
        }
      }

      // Handle disabled part types - delete if they exist
      const disabledPartTypes = [];
      if (!formData.original.enabled && formData.original.id) {
        disabledPartTypes.push({ type: 'original', id: formData.original.id });
      }
      if (!formData.duplicate.enabled && formData.duplicate.id) {
        disabledPartTypes.push({ type: 'duplicate', id: formData.duplicate.id });
      }

      // Delete disabled part types
      const deleteCalls = disabledPartTypes.map(({ id }) => 
        apiFetcher.delete(`/api/repair/repair-prices/${id}/`)
      );

      // Execute all API calls
      await Promise.all([...apiCalls, ...deleteCalls]);

      toast.dismiss(loadingToast);
      const successMessage = enabledPartTypes.length > 1 
        ? `Services updated successfully for ${enabledPartTypes.length} part types!`
        : 'Service updated successfully!';
      toast.success(successMessage);
      
      // Close modal and refresh data
      onClose();
      onSuccess?.();
      
      // Invalidate model services queries to refresh data
      if (modelId) {
        queryClient.invalidateQueries({ queryKey: ['modelServices', modelId] });
      }
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || error.message || 'Failed to update service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        problem: '',
        problem_name: '',
        original: {
          id: null,
          enabled: false,
          base_price: '',
          discount_type: 'none',
          discount_percentage: 0,
          discount_amount: 0,
        },
        duplicate: {
          id: null,
          enabled: false,
          base_price: '',
          discount_type: 'none',
          discount_percentage: 0,
          discount_amount: 0,
        },
        warranty_days: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem Selection - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="problem">Problem</Label>
            <Input
              id="problem"
              type="text"
              value={formData.problem_name}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500">Problem cannot be changed</p>
          </div>

          {/* Part Types Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Parts Section */}
            <div className={`border rounded-lg p-4 space-y-4 ${!formData.original.enabled ? 'opacity-50 bg-gray-50' : ''}`}>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="original_enabled"
                  checked={formData.original.enabled}
                  onChange={(e) => handlePartTypeToggle('original', e.target.checked)}
                  disabled={isSubmitting}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="original_enabled" className="text-lg font-semibold cursor-pointer">
                  Original Parts
                </Label>
              </div>

              <div className="space-y-4">
                {/* Base Price */}
                <div className="space-y-2">
                  <Label htmlFor="original_base_price">Base Price *</Label>
                  <Input
                    id="original_base_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.original.base_price}
                    onChange={(e) => handlePartTypeInputChange('original', 'base_price', e.target.value)}
                    placeholder="Enter base price (e.g., 25.00)"
                    disabled={isSubmitting || !formData.original.enabled}
                    required
                  />
                </div>

                {/* Discount Type */}
                <div className="space-y-2">
                  <Label htmlFor="original_discount_type">Discount Type</Label>
                  <Select
                    value={formData.original.discount_type}
                    onValueChange={(value) => handlePartTypeDiscountChange('original', value)}
                    disabled={isSubmitting || !formData.original.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Discount</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Discount Percentage - Conditional */}
                {formData.original.discount_type === 'percentage' && (
                  <div className="space-y-2">
                    <Label htmlFor="original_discount_percentage">Discount Percentage *</Label>
                    <Input
                      id="original_discount_percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.original.discount_percentage}
                      onChange={(e) => handlePartTypeInputChange('original', 'discount_percentage', e.target.value)}
                      placeholder="Enter discount percentage (e.g., 10)"
                      disabled={isSubmitting || !formData.original.enabled}
                      required
                    />
                  </div>
                )}

                {/* Discount Amount - Conditional */}
                {formData.original.discount_type === 'amount' && (
                  <div className="space-y-2">
                    <Label htmlFor="original_discount_amount">Discount Amount *</Label>
                    <Input
                      id="original_discount_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.original.discount_amount}
                      onChange={(e) => handlePartTypeInputChange('original', 'discount_amount', e.target.value)}
                      placeholder="Enter discount amount (e.g., 5.00)"
                      disabled={isSubmitting || !formData.original.enabled}
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Duplicate Parts Section */}
            <div className={`border rounded-lg p-4 space-y-4 ${!formData.duplicate.enabled ? 'opacity-50 bg-gray-50' : ''}`}>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="duplicate_enabled"
                  checked={formData.duplicate.enabled}
                  onChange={(e) => handlePartTypeToggle('duplicate', e.target.checked)}
                  disabled={isSubmitting}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="duplicate_enabled" className="text-lg font-semibold cursor-pointer">
                  Duplicate Parts
                </Label>
              </div>

              <div className="space-y-4">
                {/* Base Price */}
                <div className="space-y-2">
                  <Label htmlFor="duplicate_base_price">Base Price *</Label>
                  <Input
                    id="duplicate_base_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.duplicate.base_price}
                    onChange={(e) => handlePartTypeInputChange('duplicate', 'base_price', e.target.value)}
                    placeholder="Enter base price (e.g., 25.00)"
                    disabled={isSubmitting || !formData.duplicate.enabled}
                    required
                  />
                </div>

                {/* Discount Type */}
                <div className="space-y-2">
                  <Label htmlFor="duplicate_discount_type">Discount Type</Label>
                  <Select
                    value={formData.duplicate.discount_type}
                    onValueChange={(value) => handlePartTypeDiscountChange('duplicate', value)}
                    disabled={isSubmitting || !formData.duplicate.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Discount</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Discount Percentage - Conditional */}
                {formData.duplicate.discount_type === 'percentage' && (
                  <div className="space-y-2">
                    <Label htmlFor="duplicate_discount_percentage">Discount Percentage *</Label>
                    <Input
                      id="duplicate_discount_percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.duplicate.discount_percentage}
                      onChange={(e) => handlePartTypeInputChange('duplicate', 'discount_percentage', e.target.value)}
                      placeholder="Enter discount percentage (e.g., 10)"
                      disabled={isSubmitting || !formData.duplicate.enabled}
                      required
                    />
                  </div>
                )}

                {/* Discount Amount - Conditional */}
                {formData.duplicate.discount_type === 'amount' && (
                  <div className="space-y-2">
                    <Label htmlFor="duplicate_discount_amount">Discount Amount *</Label>
                    <Input
                      id="duplicate_discount_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.duplicate.discount_amount}
                      onChange={(e) => handlePartTypeInputChange('duplicate', 'discount_amount', e.target.value)}
                      placeholder="Enter discount amount (e.g., 5.00)"
                      disabled={isSubmitting || !formData.duplicate.enabled}
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Warranty Days */}
         

          {/* Form Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || 
                (!formData.original.enabled && !formData.duplicate.enabled) ||
                (formData.original.enabled && (!formData.original.base_price || 
                  (formData.original.discount_type === 'percentage' && !formData.original.discount_percentage) ||
                  (formData.original.discount_type === 'amount' && !formData.original.discount_amount))) ||
                (formData.duplicate.enabled && (!formData.duplicate.base_price || 
                  (formData.duplicate.discount_type === 'percentage' && !formData.duplicate.discount_percentage) ||
                  (formData.duplicate.discount_type === 'amount' && !formData.duplicate.discount_amount)))
              }
              className="text-secondary cursor-pointer"
            >
              {isSubmitting ? 'Updating...' : `Update Service${(formData.original.enabled && formData.duplicate.enabled) ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

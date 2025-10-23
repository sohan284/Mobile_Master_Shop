'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { apiFetcher } from '@/lib/api';
import { useApiGet } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';

export default function AddModelServiceModal({ isOpen, onClose, onSuccess, modelId, existingServices }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    phone_model: modelId,
    problem: '',
    original: {
      enabled: true,
      base_price: '',
      discount_type: 'none',
      discount_percentage: 0,
      discount_amount: 0,
    },
    duplicate: {
      enabled: false,
      base_price: '',
      discount_type: 'none',
      discount_percentage: 0,
      discount_amount: 0,
    },
    warranty_days: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch problems for this model
  const { data: problemsResponse, isLoading, error, refetch } = useApiGet(
    ['problems'],
    () => apiFetcher.get('/api/repair/problems/')
  );
  const problems = problemsResponse?.data || [];

  // Filter out problems that already have services for this model
  const availableProblems = problems.filter(problem => {
    const hasService = existingServices.some(service => service.problem_name === problem.name);
    return !hasService;
  });
 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProblemSelect = (problemId) => {
    const selectedProblem = availableProblems.find(p => p.id === parseInt(problemId));
    if (selectedProblem) {
      setFormData(prev => ({
        ...prev,
        problem: problemId,
        original: {
          ...prev.original,
          base_price: selectedProblem.price || ''
        },
        duplicate: {
          ...prev.duplicate,
          base_price: selectedProblem.price || ''
        },
        warranty_days: selectedProblem.warranty_days || ''
      }));
    }
  };

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
    
    if (!formData.problem) {
      toast.error('Please select a problem');
      return;
    }

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
    const loadingToast = toast.loading('Creating services...');

    try {
      // Make API calls for each enabled part type
      const apiCalls = enabledPartTypes.map(partType => {
        const partData = formData[partType];
        
        // Prepare discount fields based on discount type
        const discountData = {};
        if (partData.discount_type === 'percentage') {
          discountData.discount_percentage = partData.discount_percentage;
          discountData.discount_amount = 0;
        } else if (partData.discount_type === 'amount') {
          discountData.discount_percentage = 0;
          discountData.discount_amount = partData.discount_amount;
        } else {
          discountData.discount_percentage = 0;
          discountData.discount_amount = 0;
        }

        return apiFetcher.post('/api/repair/repair-prices/', {
          phone_model: parseInt(modelId),
          problem: parseInt(formData.problem),
          part_type: partType,
          base_price: partData.base_price,
          ...discountData,
          warranty_days: formData.warranty_days ? parseInt(formData.warranty_days) : 0
        });
      });

      // Execute all API calls
      await Promise.all(apiCalls);

      toast.dismiss(loadingToast);
      const successMessage = enabledPartTypes.length > 1 
        ? `Services created successfully for ${enabledPartTypes.length} part types!`
        : 'Service created successfully!';
      toast.success(successMessage);
      
      // Reset form
      setFormData({
        phone_model: modelId,
        problem: '',
        original: {
          enabled: true,
          base_price: '',
          discount_type: 'none',
          discount_percentage: 0,
          discount_amount: 0,
        },
        duplicate: {
          enabled: false,
          base_price: '',
          discount_type: 'none',
          discount_percentage: 0,
          discount_amount: 0,
        },
        warranty_days: ''
      });
      
      // Close modal and refresh data
      onClose();
      onSuccess?.();
      
      // Invalidate model services queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['modelServices', modelId] });
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || error.message || 'Failed to create service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        phone_model: modelId,
        problem: '',
        original: {
          enabled: true,
          base_price: '',
          discount_type: 'none',
          discount_percentage: 0,
          discount_amount: 0,
        },
        duplicate: {
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
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem Selection */}
          <div className="space-y-2">
            <Label htmlFor="problem">Select Problem *</Label>
            <Select
              value={formData.problem}
              onValueChange={handleProblemSelect}
              disabled={isSubmitting || isLoading }
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading problems..." : "Choose a problem"} />
              </SelectTrigger>
              <SelectContent>
                {availableProblems.map((problem) => (
                  <SelectItem key={problem.id} value={problem.id.toString()}>
                    {problem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableProblems.length === 0 && !isLoading  && (
              <p className="text-sm text-gray-500">No available problems for this model (all problems already have services)</p>
            )}
          </div>

          {/* Warranty Days - Global */}
          <div className="space-y-2">
            <Label htmlFor="warranty_days">Warranty Days</Label>
            <Input
              id="warranty_days"
              name="warranty_days"
              type="number"
              min="0"
              value={formData.warranty_days}
              onChange={handleInputChange}
              placeholder="Enter warranty days (e.g., 30)"
              disabled={isSubmitting}
            />
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
                !formData.problem || 
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
              {isSubmitting ? 'Creating...' : isLoading ? 'Loading...' : `Create Service${(formData.original.enabled && formData.duplicate.enabled) ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

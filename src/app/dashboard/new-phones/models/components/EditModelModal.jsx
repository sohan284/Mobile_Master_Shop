'use client';

import { useState, useEffect } from 'react';
import { Upload, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { apiFetcher } from '@/lib/api';

export default function EditModelModal({ isOpen, onClose, onSuccess, model, brands, colors }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    ram: '',
    memory: '',
    main_amount: '',
    discount_type: 'amount', // 'amount' or 'percentage'
    discount_value: '',
    description: '',
    icon: null,
    iconPreview: null,
    stock_quantity: '',
    colors: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleColorChange = (colorId, checked) => {
    setFormData(prev => ({
      ...prev,
      colors: checked 
        ? [...prev.colors, colorId]
        : prev.colors.filter(id => id !== colorId)
    }));
  };

  useEffect(() => {
    if (model) {
      // Calculate discount type and value from existing data
      let discount_type = 'amount';
      let discount_value = '';
      
      if (model.main_amount && model.discounted_amount) {
        const main = parseFloat(model.main_amount);
        const discounted = parseFloat(model.discounted_amount);
        const difference = main - discounted;
        
        // If difference is more than 50% of main amount, likely percentage
        if (difference > main * 0.5) {
          discount_type = 'percentage';
          discount_value = ((difference / main) * 100).toString();
        } else {
          discount_type = 'amount';
          discount_value = difference.toString();
        }
      }

      setFormData({
        name: model.name || '',
        brand: model.brand_slug || '',
        ram: model.ram || '',
        memory: model.memory || '',
        main_amount: model.main_amount?.toString() || '',
        discount_type: discount_type,
        discount_value: discount_value,
        description: model.description || '',
        icon: null,
        iconPreview: model.icon || null,
        stock_quantity: model.stock_quantity?.toString() || '',
        colors: model.colors || []
      });
    }
  }, [model]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        icon: file,
        iconPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter model name');
      return;
    }

    if (!formData.brand) {
      toast.error('Please select a brand');
      return;
    }

    if (!formData.main_amount) {
      toast.error('Please enter main amount');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Updating model...');

    try {
      // Calculate discounted amount based on type
      let discounted_amount = formData.main_amount;
      if (formData.discount_value) {
        if (formData.discount_type === 'percentage') {
          const discount = (parseFloat(formData.main_amount) * parseFloat(formData.discount_value)) / 100;
          discounted_amount = (parseFloat(formData.main_amount) - discount).toString();
        } else {
          discounted_amount = (parseFloat(formData.main_amount) - parseFloat(formData.discount_value)).toString();
        }
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('brand', formData.brand);
      submitData.append('ram', formData.ram.trim());
      submitData.append('memory', formData.memory.trim());
      submitData.append('main_amount', formData.main_amount);
      submitData.append('discounted_amount', discounted_amount);
      submitData.append('description', formData.description.trim());
      submitData.append('stock_quantity', formData.stock_quantity || '0');
      
      // Add color_ids as array
      if (formData.colors.length > 0) {
        submitData.append('color_ids', JSON.stringify(formData.colors));
      }

      if (formData.icon) {
        submitData.append('icon', formData.icon);
      }

      // Make API call using apiFetcher
      await apiFetcher.put(`https://save-co.lumivancelabs.com/api/brandnew/models/${model.id}/`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.dismiss(loadingToast);
      toast.success('Model updated successfully!');
      
      // Close modal and refresh data
      onClose();
      onSuccess?.();
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || error.message || 'Failed to update model');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        brand: '',
        ram: '',
        memory: '',
        main_amount: '',
        discount_type: 'amount',
        discount_value: '',
        description: '',
        icon: null,
        iconPreview: null,
        stock_quantity: '',
        colors: []
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        style={{ maxWidth: '700px', width: '90vw' }}
      >
        <DialogHeader>
          <DialogTitle>Edit Model</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row - Brand and Model Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand Selection */}
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.slug}>
                      <div className="flex items-center space-x-2">
                        {brand.icon && (
                          <Image 
                            src={brand.icon} 
                            alt={brand.name}
                            className="h-4 w-4 object-contain"
                            width={16}
                            height={16}
                          />
                        )}
                        <span>{brand.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Model Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter model name"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Second Row - RAM and Memory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* RAM */}
            <div className="space-y-2">
              <Label htmlFor="ram">RAM</Label>
              <Input
                id="ram"
                name="ram"
                type="text"
                value={formData.ram}
                onChange={handleInputChange}
                placeholder="e.g., 16GB"
                disabled={isSubmitting}
              />
            </div>

            {/* Memory */}
            <div className="space-y-2">
              <Label htmlFor="memory">Memory</Label>
              <Input
                id="memory"
                name="memory"
                type="text"
                value={formData.memory}
                onChange={handleInputChange}
                placeholder="e.g., 512GB"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Third Row - Main Amount and Stock Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Amount */}
            <div className="space-y-2">
              <Label htmlFor="main_amount">Main Amount *</Label>
              <Input
                id="main_amount"
                name="main_amount"
                type="number"
                value={formData.main_amount}
                onChange={handleInputChange}
                placeholder="Enter main amount"
                disabled={isSubmitting}
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Stock Quantity */}
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                placeholder="Enter stock quantity"
                disabled={isSubmitting}
                min="0"
              />
            </div>
          </div>

          {/* Fourth Row - Discount Type and Discount Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Type */}
            <div className="space-y-2">
              <Label htmlFor="discount_type">Discount Type</Label>
              <Select value={formData.discount_type} onValueChange={(value) => setFormData(prev => ({ ...prev, discount_type: value }))}>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <Label htmlFor="discount_value">
                Discount {formData.discount_type === 'percentage' ? 'Percentage' : 'Amount'}
              </Label>
              <Input
                id="discount_value"
                name="discount_value"
                type="number"
                value={formData.discount_value}
                onChange={handleInputChange}
                placeholder={
                  formData.discount_type === 'percentage' 
                    ? 'Enter discount percentage (e.g., 10)' 
                    : 'Enter discount amount'
                }
                disabled={isSubmitting}
                min="0"
                step={formData.discount_type === 'percentage' ? '1' : '0.01'}
              />
              {formData.discount_type === 'percentage' && (
                <p className="text-xs text-gray-500">Enter percentage value (e.g., 10 for 10%)</p>
              )}
            </div>
          </div>

         

          {/* Description - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter model description"
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Available Colors</span>
            </Label>
            {colors.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border border-gray-200 rounded-lg">
                {colors.map((color) => (
                    <div key={color.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color.id}`}
                        checked={formData.colors.includes(color.id)}
                        onCheckedChange={(checked) => handleColorChange(color.id, checked)}
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center space-x-2 flex-1">
                        <div 
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: color.hex_code }}
                          title={color.name}
                        />
                        <label 
                          htmlFor={`color-${color.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {color.name}
                        </label>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 p-4 border border-gray-200 rounded-lg">
                No colors available. Please add colors first.
              </div>
            )}
            <p className="text-xs text-gray-500">
              Select the colors available for this phone model
            </p>
          </div>

          {/* Icon Upload */}
          <div className="space-y-2">
            <Label htmlFor="icon">Model Icon</Label>
            
            {/* Icon Preview */}
            {formData.iconPreview && (
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="relative w-16 h-16">
                  <Image
                    src={formData.iconPreview}
                    alt="Icon preview"
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {formData.icon?.name || 'Current icon'}
                  </p>
                  {formData.icon && (
                    <p className="text-xs text-gray-500">
                      {(formData.icon.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    icon: null,
                    iconPreview: null
                  }))}
                  className="text-red-500 hover:text-red-700"
                  disabled={isSubmitting}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Upload Button */}
            {!formData.iconPreview && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  id="icon"
                  name="icon"
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="icon"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Upload className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload icon</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              </div>
            )}
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
              disabled={isSubmitting || !formData.name.trim() || !formData.brand || !formData.main_amount}
              className="text-secondary cursor-pointer"
            >
              {isSubmitting ? 'Updating...' : 'Update Model'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

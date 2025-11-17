'use client';

import { useState, useEffect } from 'react';
import { Upload, Palette, ChevronDown, ChevronUp, X, CheckCircle, AlertCircle, Image as ImageIcon, Check } from 'lucide-react';
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
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { apiFetcher } from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamically import RichTextEditor with no SSR
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 text-gray-400">Loading editor...</div>
    </div>
  ),
});

export default function AddModelModal({ isOpen, onClose, onSuccess, brands, colors }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    ram: '',
    memory: '',
    main_amount: '',
    discount_type: 'amount',
    discount_value: '',
    description: '',
    stock_management: []
  });
  const [expandedColors, setExpandedColors] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset options for RAM and ROM (memory)
  const ramOptions = ['2', '4', '6', '8', '12', '16'];
  const memoryOptions = ['16', '32', '64', '128', '256', '512', '1024'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Get variant for a color
  const getColorVariant = (colorId) => {
    return formData.stock_management.find(v => v.color_id === colorId);
  };

  // Check if color is selected
  const isColorSelected = (colorId) => {
    return formData.stock_management.some(v => v.color_id === colorId);
  };

  // Toggle color card expansion and selection
  const handleColorClick = (color) => {
    const isSelected = isColorSelected(color.id);
    
    if (!isSelected) {
      // Select the color and add to variants
      setFormData(prev => ({
        ...prev,
        stock_management: [...prev.stock_management, {
          color_id: color.id,
          color_name: color.name,
          color_hex: color.hex_code,
          image: null,
          imagePreview: null,
          quantity: ''
        }]
      }));
      // Auto-expand
      setExpandedColors(prev => new Set([...prev, color.id]));
    } else {
      // Toggle expansion
      setExpandedColors(prev => {
        const newSet = new Set(prev);
        if (newSet.has(color.id)) {
          newSet.delete(color.id);
        } else {
          newSet.add(color.id);
        }
        return newSet;
      });
    }
  };

  // Deselect color
  const handleColorDeselect = (colorId, e) => {
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      stock_management: prev.stock_management.filter(v => v.color_id !== colorId)
    }));
    setExpandedColors(prev => {
      const newSet = new Set(prev);
      newSet.delete(colorId);
      return newSet;
    });
  };

  // Handle image upload for a color variant
  const handleVariantImageUpload = (colorId, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const preview = URL.createObjectURL(file);

    setFormData(prev => ({
      ...prev,
      stock_management: prev.stock_management.map(variant =>
        variant.color_id === colorId
          ? {
              ...variant,
              image: file,
              imagePreview: preview
            }
          : variant
      )
    }));
  };

  // Remove image from color variant
  const handleRemoveVariantImage = (colorId) => {
    setFormData(prev => ({
      ...prev,
      stock_management: prev.stock_management.map(variant =>
        variant.color_id === colorId
          ? {
              ...variant,
              image: null,
              imagePreview: null
            }
          : variant
      )
    }));
  };

  // Update quantity for a color
  const handleQuantityChange = (colorId, quantity) => {
    setFormData(prev => ({
      ...prev,
      stock_management: prev.stock_management.map(variant =>
        variant.color_id === colorId
          ? { ...variant, quantity }
          : variant
      )
    }));
  };

  // Check if variant is complete
  const isVariantComplete = (variant) => {
    return variant.image && variant.quantity && parseInt(variant.quantity) > 0;
  };

  // Get warning message for incomplete variant
  const getVariantWarningMessage = (variant) => {
    if (!variant) return 'Please add image and quantity';
    const missing = [];
    if (!variant.image) missing.push('product image');
    if (!variant.quantity || parseInt(variant.quantity) <= 0) missing.push('stock quantity');
    return `Missing: ${missing.join(' and ')}`;
  };

  // Get completion status
  const getCompletionStatus = () => {
    const total = formData.stock_management.length;
    const complete = formData.stock_management.filter(isVariantComplete).length;
    return { total, complete };
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
  
    if (!formData.ram) {
      toast.error('Please select RAM');
      return;
    }
  
    if (!formData.memory) {
      toast.error('Please select memory');
      return;
    }
  
    if (formData.stock_management.length === 0) {
      toast.error('Please add at least one color variant');
      return;
    }
  
    const status = getCompletionStatus();
    if (status.complete !== status.total) {
      toast.error('Please complete all color variants (add image and quantity)');
      return;
    }
  
    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating model...');
  
    try {
      // Calculate discounted amount
      let discounted_amount = formData.main_amount;
      if (formData.discount_value) {
        if (formData.discount_type === 'percentage') {
          const discount = (parseFloat(formData.main_amount) * parseFloat(formData.discount_value)) / 100;
          discounted_amount = (parseFloat(formData.main_amount) - discount).toString();
        } else {
          discounted_amount = (parseFloat(formData.main_amount) - parseFloat(formData.discount_value)).toString();
        }
      }
  
      // Build the payload as a plain object (JSON only, files handled separately)
      const payload = {
        name: formData.name.trim(),
        brand: Number(formData.brand),
        ram: formData.ram.trim(),
        memory: formData.memory.trim(),
        main_amount: formData.main_amount,
        discounted_amount: discounted_amount,
        description: formData.description.trim(),
        stock_management: formData.stock_management.map((variant) => ({
          color: variant.color_id,
          stock: parseInt(variant.quantity, 10)
        }))
      };
  
      console.log('Payload:', payload);
  
      // Send JSON payload (server returns newly created stock rows with their ids)
      const createdModel = await apiFetcher.post('/api/brandnew/models/', payload);
      console.log('Model Response:', createdModel);

      const createdStocks = createdModel?.data?.stock_management || [];
      if (!Array.isArray(createdStocks) || createdStocks.length !== formData.stock_management.length) {
        throw new Error('Mismatch between requested and created stock variants.');
      }

      // Map stock records back to the variants we just submitted
      const stockLookup = new Map();
      createdStocks.forEach((stock, index) => {
        const colorId =
          stock?.color?.id ??
          (typeof stock?.color === 'number' ? stock.color : undefined) ??
          stock?.color_id;
        if (colorId !== undefined) {
          stockLookup.set(String(colorId), stock);
        } else {
          stockLookup.set(`index-${index}`, stock);
        }
      });

      toast.loading('Uploading color images...', { id: loadingToast });

      await Promise.all(
        formData.stock_management.map(async (variant, index) => {
          const stockRecord =
            stockLookup.get(String(variant.color_id)) ||
            stockLookup.get(`index-${index}`);

          if (!stockRecord?.id) {
            throw new Error('Unable to find stock id for color variant upload.');
          }

          const stockFormData = new FormData();
          stockFormData.append('icon_color_based', variant.image);

          await apiFetcher.patch(
            `/api/brandnew/stock-management/${stockRecord.id}/`,
            stockFormData
          );
        })
      );
  
      toast.dismiss(loadingToast);
      toast.success('Model created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        brand: '',
        ram: '',
        memory: '',
        main_amount: '',
        discount_type: 'amount',
        discount_value: '',
        description: '',
        stock_management: []
      });
      setExpandedColors(new Set());
      
      onClose();
      onSuccess?.();
      
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error creating model:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || error.message || 'Failed to create model');
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
        stock_management: []
      });
      setExpandedColors(new Set());
      onClose();
    }
  };

  const status = getCompletionStatus();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent style={{ width: '95vw', maxHeight: '90vh', overflowY: 'auto' }} className="w-[95vw] sm:max-w-xl lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Model</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row - Model Name and Brand */}
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
                    <SelectItem key={brand.id} value={brand.id.toString()}>
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
              <Label htmlFor="ram">RAM *</Label>
              <div className="flex flex-wrap gap-2">
                {ramOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, ram: opt }))}
                    className={`px-3 py-1 cursor-pointer rounded-full border text-sm transition ${
                      formData.ram === opt
                        ? 'text-secondary bg-primary/80 border-secondary font-bold'
                        : 'border-accent/30 text-black/30 hover:border-secondary/50'
                    }`}
                    disabled={isSubmitting}
                  >
                    {opt} GB
                  </button>
                ))}
              </div>
            </div>

            {/* Memory */}
            <div className="space-y-2">
              <Label htmlFor="memory">Memory *</Label>
              <div className="flex flex-wrap gap-2">
                {memoryOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, memory: opt }))}
                    className={`px-3 cursor-pointer py-1 rounded-full border text-sm transition ${
                      formData.memory === opt
                        ? 'text-secondary bg-primary/80 border-secondary font-bold'
                        : 'border-accent/30 text-black/30 hover:border-secondary/50'
                    }`}
                    disabled={isSubmitting}
                  >
                    {opt} GB
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Third Row - Main Amount, Discount Type, and Discount Value */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Color Variants Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-gray-700" />
                <Label className="text-base font-semibold">Color Variants *</Label>
              </div>
              {formData.stock_management.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    status.complete === status.total 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {status.complete}/{status.total} Complete
                  </div>
                  {status.complete !== status.total && (
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${(status.complete / status.total) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-2">
              💡 <strong>Tip:</strong> Click on a color card to select it, then expand to add product image and stock quantity.
            </p>

            {/* All Colors as Collapsible Items */}
            {colors.length > 0 ? (
              <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                {colors.map((color) => {
                  const variant = getColorVariant(color.id);
                  const isSelected = isColorSelected(color.id);
                  const isExpanded = expandedColors.has(color.id);
                  const isComplete = variant && isVariantComplete(variant);

                  return (
                    <div 
                      key={color.id}
                      className={`border-2 rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                        isSelected
                          ? isComplete
                            ? 'border-green-500 bg-gradient-to-br from-green-50/50 to-white shadow-green-100'
                            : 'border-blue-400 bg-gradient-to-br from-blue-50/50 to-white shadow-blue-100'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                      }`}
                    >
                      {/* Color Header - Clickable */}
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/60 transition-all duration-200 rounded-t-xl"
                        onClick={() => handleColorClick(color)}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          {/* Color Circle */}
                          <div className="relative flex-shrink-0">
                            <div 
                              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                isSelected ? 'ring-2 ring-offset-2' : ''
                              }`}
                              style={{ 
                                backgroundColor: color.hex_code,
                                borderColor: isSelected ? '#10b981' : '#d1d5db',
                                ringColor: isSelected ? '#10b981' : 'transparent',
                                boxShadow: isSelected ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 shadow-lg animate-in zoom-in duration-200">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Color Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold text-gray-900 truncate">{color.name}</p>
                             
                            </div>
                            <p className={`text-xs mt-1 ${
                              isSelected 
                                ? isComplete
                                  ? 'text-green-600 font-medium'
                                  : 'text-amber-600 font-medium'
                                : 'text-gray-500'
                            }`}>
                              {isSelected 
                                ? isComplete
                                  ? `✓ Complete - ${variant.quantity} units in stock`
                                  : '⚠️ Add image and quantity'
                                : 'Click to select this color'
                              }
                            </p>
                          </div>
                        </div>
                        
                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {isSelected && (
                            <>
                              {isComplete ? (
                                <CheckCircle className="h-5 w-5 text-green-600 animate-in zoom-in duration-200" />
                              ) : (
                               <></>
                              )}
                              <button
                                type="button"
                                onClick={(e) => handleColorDeselect(color.id, e)}
                                className="p-1.5 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
                                disabled={isSubmitting}
                                title="Remove color"
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </button>
                            </>
                          )}
                          {isSelected && (
                            <div className="transition-transform duration-300">
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded Content - Image and Quantity */}
                      {isSelected && (
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="p-4 pt-2 space-y-4 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50/30">
                            <div className="grid grid-cols-1 gap-4">
                              {/* Image Upload */}
                              <div className="space-y-2">
                                <Label className="text-sm font-semibold flex items-center space-x-2 text-gray-700">
                                  <ImageIcon className="h-4 w-4 text-blue-600" />
                                  <span>Product Image *</span>
                                </Label>
                                
                                {variant.imagePreview ? (
                                  <div className="relative group rounded-lg overflow-hidden border-2 border-gray-200 bg-white">
                                    <img
                                      src={variant.imagePreview}
                                      alt={`${variant.color_name} preview`}
                                      className="w-full h-48 object-contain bg-gray-50"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveVariantImage(variant.color_id)}
                                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                      disabled={isSubmitting}
                                      title="Remove image"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-3">
                                      <p className="font-medium truncate">{variant.image?.name}</p>
                                      <p className="text-xs opacity-90">
                                        {(variant.image?.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group">
                                    <input
                                      id={`variant-image-${variant.color_id}`}
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleVariantImageUpload(variant.color_id, e.target.files[0])}
                                      className="hidden"
                                      disabled={isSubmitting}
                                    />
                                    <label
                                      htmlFor={`variant-image-${variant.color_id}`}
                                      className="cursor-pointer flex flex-col items-center justify-center h-48 space-y-3"
                                    >
                                      <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                                        <Upload className="h-8 w-8 text-blue-600" />
                                      </div>
                                      <div className="text-center">
                                        <p className="text-sm font-semibold text-gray-900">Click to upload image</p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                      </div>
                                    </label>
                                  </div>
                                )}
                              </div>

                              {/* Quantity Input */}
                              <div className="space-y-2">
                                <Label htmlFor={`quantity-${variant.color_id}`} className="text-sm font-semibold text-gray-700">
                                  Stock Quantity *
                                </Label>
                                <Input
                                  id={`quantity-${variant.color_id}`}
                                  type="number"
                                  min="0"
                                  value={variant.quantity}
                                  onChange={(e) => handleQuantityChange(variant.color_id, e.target.value)}
                                  placeholder="Enter stock quantity"
                                  className="text-lg font-semibold border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                  disabled={isSubmitting}
                                />
                                <p className="text-xs text-gray-500 flex items-center space-x-1">
                                  <span>📦</span>
                                  <span>Available units in stock</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                <Palette className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No colors available. Please add colors first.</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <RichTextEditor
              content={formData.description}
              onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
              disabled={isSubmitting}
            />
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
                !formData.name.trim() || 
                !formData.brand || 
                !formData.main_amount || 
                !formData.ram || 
                !formData.memory ||
                formData.stock_management.length === 0 ||
                status.complete !== status.total
              }
              className="text-secondary cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create Model'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
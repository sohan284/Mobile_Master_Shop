'use client';

import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

export default function EditAccessoryModal({ isOpen, onClose, onSuccess, accessory }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image: null,
    imagePreview: null,
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when accessory prop changes
  useEffect(() => {
    if (accessory) {
      setFormData({
        name: accessory.title || '',
        description: accessory.subtitle || '',
        price: accessory.main_amount || '',
        stock_quantity: accessory.stock_quantity || '',
        image: null,
        imagePreview: accessory.picture || null,
        is_active: accessory.is_active !== undefined ? accessory.is_active : true
      });
    }
  }, [accessory]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
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
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter accessory name');
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Updating accessory...');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.name.trim());
      submitData.append('subtitle', formData.description.trim());
      submitData.append('main_amount', parseFloat(formData.price));
      submitData.append('stock_quantity', parseInt(formData.stock_quantity) || 0);

      // Only append image if a new one was selected
      if (formData.image) {
        submitData.append('picture', formData.image);
      }

      // Make API call using apiFetcher
      await apiFetcher.patch(`/api/accessories/products/${accessory.id}/`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.dismiss(loadingToast);
      toast.success('Accessory updated successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        image: null,
        imagePreview: null,
        is_active: true
      });
      
      // Close modal and refresh data
      onClose();
      onSuccess?.();
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || error.message || 'Failed to update accessory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        image: null,
        imagePreview: null,
        is_active: true
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Accessory</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Accessory Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Accessory Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter accessory name"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter accessory description"
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  disabled={isSubmitting}
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
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  disabled={isSubmitting}
                />
              </div>

            
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Accessory Image</Label>
              
              {/* Current Image Preview */}
              {formData.imagePreview && !formData.image && (
                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="relative w-24 h-24">
                    <Image
                      src={formData.imagePreview}
                      alt="Current image"
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Current image</p>
                    <p className="text-xs text-gray-500">Click upload to change</p>
                  </div>
                </div>
              )}

              {/* New Image Preview */}
              {formData.image && (
                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="relative w-24 h-24">
                    <Image
                      src={formData.imagePreview}
                      alt="New image preview"
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{formData.image.name}</p>
                    <p className="text-xs text-gray-500">
                      {(formData.image.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      image: null,
                      imagePreview: accessory?.picture || null
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
              {!formData.image && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Upload className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formData.imagePreview ? 'Change image' : 'Upload new image'}
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  </label>
                </div>
              )}
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
              disabled={isSubmitting || !formData.name.trim() || !formData.price}
              className="text-secondary cursor-pointer"
            >
              {isSubmitting ? 'Updating...' : 'Update Accessory'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

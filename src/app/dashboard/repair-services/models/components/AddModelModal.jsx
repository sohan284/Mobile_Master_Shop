'use client';

import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
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

export default function AddModelModal({ isOpen, onClose, onSuccess, brands }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    image: null,
    imagePreview: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);





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
      toast.error('Please enter model name');
      return;
    }

    if (!formData.brand) {
      toast.error('Please select a brand');
      return;
    }

    if (!formData.image) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating model...');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('brand', formData.brand);
      submitData.append('image', formData.image);
      if (formData.description) {
        submitData.append('description', formData.description);
      }

      // Make API call using apiFetcher
      await apiFetcher.post('/api/repair/models/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.dismiss(loadingToast);
      toast.success('Model created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        brand: '',
        description: '',
        image: null,
        imagePreview: null
      });
      
      // Close modal and refresh data
      onClose();
      onSuccess?.();
      
    } catch (error) {
      toast.dismiss(loadingToast);
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
        image: null,
        imagePreview: null
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
       <DialogContent style={{ width: '95vw', maxHeight: '90vh', overflowY: 'auto' }} className="w-[95vw] sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
       <DialogHeader>
          <DialogTitle>Add New Model</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Brand Selection */}
           <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Select
              value={formData.brand}
              onValueChange={(value) => handleSelectChange('brand', value)}
              disabled={isSubmitting || isLoadingBrands}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingBrands ? "Loading brands..." : "Select a brand"} />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.slug}>
                    {brand.name}
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
{/* Image Upload */}
<div className="space-y-2">
            <Label htmlFor="image">Model Image *</Label>
            
            {/* Image Preview */}
            {formData.imagePreview && (
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="relative w-16 h-16">
                  <Image
                    src={formData.imagePreview}
                    alt="Image preview"
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
                    imagePreview: null
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
            {!formData.imagePreview && (
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
                    <p className="text-sm font-medium text-gray-900">Upload image</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              </div>
            )}
          </div>
        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
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
              disabled={isSubmitting || !formData.name.trim() || !formData.brand || !formData.image}
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

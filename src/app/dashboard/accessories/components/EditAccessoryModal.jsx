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
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

// Dynamically import RichTextEditor with no SSR (match Add modal behavior)
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 text-gray-400">Loading editor...</div>
    </div>
  ),
});

export default function EditAccessoryModal({ isOpen, onClose, onSuccess, accessory }) {
  const t = useTranslations('dashboard.accessories');
  const tCommon = useTranslations('dashboard.common');
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
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
        subtitle: accessory.subtitle || '',
        description: accessory.description || '',
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
        toast.error(t('pleaseSelectImageFile'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('imageSizeLimit'));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleDescriptionChange = (htmlContent) => {
    setFormData(prev => ({
      ...prev,
      description: htmlContent
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t('pleaseEnterName'));
      return;
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      toast.error(t('pleaseEnterValidPrice'));
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(t('updatingAccessory'));

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.name.trim());
      submitData.append('subtitle', (formData.subtitle || '').trim());
      submitData.append('description', formData.description || '');
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
      toast.success(t('updatedSuccessfully'));
      
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
      toast.error(error.response?.data?.message || error.message || t('failedToUpdate'));
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
       <DialogContent style={{ width: '95vw', maxHeight: '90vh', overflowY: 'auto' }} className="w-[95vw] sm:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
       <DialogHeader>
          <DialogTitle>{t('editAccessory')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Accessory Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('accessoryName')} *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('accessoryNamePlaceholder')}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <Label htmlFor="subtitle">{t('subtitle2')}</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  type="text"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder={t('subtitlePlaceholder')}
                  disabled={isSubmitting}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">{t('priceLabel')} *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder={t('pricePlaceholder')}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Stock Quantity */}
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">{t('stockQuantity')}</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder={t('stockQuantityPlaceholder')}
                  disabled={isSubmitting}
                />
              </div>

            
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">{t('accessoryImage')}</Label>
              
              {/* Current Image Preview */}
              {formData.imagePreview && !formData.image && (
                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="relative w-24 h-24">
                    <Image
                      src={formData.imagePreview}
                      alt={t('currentImage')}
                      fill
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t('currentImage')}</p>
                    <p className="text-xs text-gray-500">{t('clickUploadToChange')}</p>
                  </div>
                </div>
              )}

              {/* New Image Preview */}
              {formData.image && (
                <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="relative w-24 h-24">
                    <Image
                      src={formData.imagePreview}
                      alt={t('imagePreview')}
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
                        {formData.imagePreview ? t('changeImage') : t('uploadNewImage')}
                      </p>
                      <p className="text-xs text-gray-500">{t('imageFormat')}</p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Rich Text Description (like Add page) */}
          <div className="space-y-2">
            <Label>{t('description')}</Label>
            <RichTextEditor
              content={formData.description}
              onChange={handleDescriptionChange}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              {t('descriptionHint')}
            </p>
          </div>

          {/* Form Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.price}
              className="text-secondary cursor-pointer"
            >
              {isSubmitting ? t('updating') : t('updateAccessory')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

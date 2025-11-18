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
import toast from 'react-hot-toast';
import Image from 'next/image';
import { apiFetcher } from '@/lib/api';
import { useTranslations } from 'next-intl';

export default function EditBrandModal({ isOpen, onClose, onSuccess, brand }) {
  const t = useTranslations('dashboard.repairServices.brandsManagement');
  const tCommon = useTranslations('dashboard.common');
  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    logoPreview: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when brand prop changes
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || '',
        logo: null,
        logoPreview: brand.logo || null
      });
    }
  }, [brand]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
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
        logo: file,
        logoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t('pleaseEnterBrandName'));
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(t('updatingBrand'));

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      
      // Only append logo if a new one was selected
      if (formData.logo) {
        submitData.append('logo', formData.logo);
      }

      // Make API call using apiFetcher
      await apiFetcher.patch(`/api/repair/brands/${brand.id}/`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.dismiss(loadingToast);
      toast.success(t('updatedSuccessfully'));
      
      // Reset form
      setFormData({
        name: '',
        logo: null,
        logoPreview: null
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
        logo: null,
        logoPreview: null
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('editBrand')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('brandNameLabel')} *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('brandNamePlaceholder')}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo">{t('brandLogo')}</Label>
            
            {/* Current Logo Preview */}
            {formData.logoPreview && !formData.logo && (
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="relative w-16 h-16">
                  <Image
                    src={formData.logoPreview}
                    alt={t('currentLogo')}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{t('currentLogo')}</p>
                  <p className="text-xs text-gray-500">{t('clickUploadToChange')}</p>
                </div>
              </div>
            )}

            {/* New Logo Preview */}
            {formData.logo && (
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="relative w-16 h-16">
                  <Image
                    src={formData.logoPreview}
                    alt={t('logoPreview')}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{formData.logo.name}</p>
                  <p className="text-xs text-gray-500">
                    {(formData.logo.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    logo: null,
                    logoPreview: brand?.logo || null
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
            {!formData.logo && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="logo"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Upload className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.logoPreview ? t('changeLogo') : t('uploadNewLogo')}
                    </p>
                    <p className="text-xs text-gray-500">{t('imageFormat')}</p>
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
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="text-secondary cursor-pointer"
            >
              {isSubmitting ? t('updating') : t('updateBrand')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
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
import { useTranslations } from 'next-intl';

export default function AddBrandModal({ isOpen, onClose, onSuccess }) {
  const t = useTranslations('dashboard.newPhones.brandsManagement');
  const tCommon = useTranslations('dashboard.common');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: null,
    iconPreview: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        icon: file,
        iconPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t('pleaseEnterBrandName'));
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(t('creatingBrand'));

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());

      if (formData.icon) {
        submitData.append('icon', formData.icon);
      }

      // Make API call using apiFetcher
      await apiFetcher.post('/api/brandnew/brands/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.dismiss(loadingToast);
      toast.success(t('createdSuccessfully'));
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        icon: null,
        iconPreview: null
      });
      
      // Close modal and refresh data
      onClose();
      onSuccess?.();
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || error.message || t('failedToCreate'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        description: '',
        icon: null,
        iconPreview: null
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addNewBrand')}</DialogTitle>
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
              onChange={handleNameChange}
              placeholder={t('brandNamePlaceholder')}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('descriptionLabel')}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('descriptionPlaceholder')}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          {/* Icon Upload */}
          <div className="space-y-2">
            <Label htmlFor="icon">{t('brandIcon')}</Label>
            
            {/* Icon Preview */}
            {formData.iconPreview && (
              <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="relative w-16 h-16">
                  <Image
                    src={formData.iconPreview}
                    alt={t('iconPreview')}
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{formData.icon.name}</p>
                  <p className="text-xs text-gray-500">
                    {(formData.icon.size / 1024).toFixed(1)} KB
                  </p>
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
                    <p className="text-sm font-medium text-gray-900">{t('uploadIcon')}</p>
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
              {isSubmitting ? t('creating') : t('createBrand')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

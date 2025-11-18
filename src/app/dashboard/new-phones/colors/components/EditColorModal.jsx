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
import toast from 'react-hot-toast';
import { apiFetcher } from '@/lib/api';
import { useTranslations } from 'next-intl';

export default function EditColorModal({ isOpen, onClose, onSuccess, color }) {
  const t = useTranslations('dashboard.newPhones.colorsManagement');
  const tCommon = useTranslations('dashboard.common');
  const [formData, setFormData] = useState({
    name: '',
    code: '#000000'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (color) {
      setFormData({
        name: color.name || '',
        code: color.hex_code || '#000000'
      });
    }
  }, [color]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t('pleaseEnterColorName'));
      return;
    }

    if (!formData.code.trim()) {
      toast.error(t('pleaseEnterColorCode'));
      return;
    }

    // Validate hex color code
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(formData.code)) {
      toast.error(t('pleaseEnterValidHexCode'));
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(t('updatingColor'));

    try {
      await apiFetcher.put(`/api/brandnew/color/${color.id}/`, {
        name: formData.name.trim(),
        hex_code: formData.code.trim()
      });

      toast.dismiss(loadingToast);
      toast.success(t('updatedSuccessfully'));
      
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
        code: '#000000'
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('editColor')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Color Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('colorNameLabel')}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('colorNamePlaceholder')}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Color Code */}
          <div className="space-y-2">
            <Label htmlFor="code">{t('colorCodeLabel')}</Label>
            <div className="flex items-center space-x-3">
              <input
                id="code"
                name="code"
                type="color"
                value={formData.code}
                onChange={handleInputChange}
                disabled={isSubmitting}
                required
                className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                title={t('selectColor')}
              />
              <Input
                value={formData.code}
                onChange={handleInputChange}
                placeholder={t('colorCodePlaceholder')}
                disabled={isSubmitting}
                required
                className="flex-1"
              />
              <div 
                className="w-12 h-10 rounded border border-gray-300"
                style={{ backgroundColor: formData.code }}
                title={t('colorPreview')}
              />
            </div>
            <p className="text-xs text-gray-500">
              {t('colorCodeHint')}
            </p>
          </div>


          <DialogFooter>
            <Button type="button" className='bg-white hover:bg-white/60 cursor-pointer' variant="outline" onClick={handleClose} disabled={isSubmitting}>
              {tCommon('cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.name.trim() || !formData.code.trim()}
              className="bg-black text-white hover:bg-black/90 cursor-pointer"
            >
              {isSubmitting ? t('updating') : t('updateColor')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

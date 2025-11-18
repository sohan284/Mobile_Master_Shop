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
import toast from 'react-hot-toast';
import { apiFetcher } from '@/lib/api';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from 'next-intl';

export default function AddProblemModal({ isOpen, onClose, onSuccess }) {
  const t = useTranslations('dashboard.repairServices.problemsManagement');
  const tCommon = useTranslations('dashboard.common');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t('pleaseEnterProblemName'));
      return;
    }

    if (!formData.description.trim()) {
      toast.error(t('pleaseEnterDescription'));
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(t('creatingProblem'));

    try {
      // Make API call using apiFetcher
      await apiFetcher.post('/api/repair/problems/', {
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      toast.dismiss(loadingToast);
      toast.success(t('createdSuccessfully'));
      
      // Reset form
      setFormData({
        name: '',
        description: '',
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
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('addNewProblem')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('problemNameLabel')} *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('problemNamePlaceholder')}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('descriptionLabel')} *</Label>
            <Textarea
              id="description"
              name="description"
              type="textarea"
              rows={2}
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('descriptionPlaceholder')}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Price */}
          

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
              disabled={isSubmitting || !formData.name.trim() || !formData.description.trim() }
              className="text-secondary cursor-pointer"
            >
              {isSubmitting ? t('creating') : t('createProblem')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { Textarea } from '@/components/ui/textarea';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export default function EditProblemModal({ isOpen, onClose, onSuccess, problem }) {
  const t = useTranslations('dashboard.repairServices.problemsManagement');
  const tCommon = useTranslations('dashboard.common');
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when problem prop changes
  useEffect(() => {
    if (problem) {
      setFormData({
        name: problem.name || '',
        description: problem.description || '',
      });
    }
  }, [problem]);

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
    const loadingToast = toast.loading(t('updatingProblem'));

    try {
      // Make API call using apiFetcher
      await apiFetcher.patch(`/api/repair/problems/${problem.id}/`, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      toast.dismiss(loadingToast);
      toast.success(t('updatedSuccessfully'));
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      onClose();

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
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('editProblem')}</DialogTitle>
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('descriptionLabel')} *</Label>
            <Textarea
              id="description"
                name="description"
                type="textarea"
                rows={2}
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t('problemDescriptionPlaceholder')}
              disabled={isSubmitting}
              required
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
              {tCommon('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.description.trim() }
              className="text-secondary cursor-pointer"
            >
              {isSubmitting ? t('updating') : t('updateProblem')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

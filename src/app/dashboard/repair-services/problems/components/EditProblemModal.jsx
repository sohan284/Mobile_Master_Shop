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
export default function EditProblemModal({ isOpen, onClose, onSuccess, problem }) {
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
      toast.error('Please enter problem name');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter description');
      return;
    }


    setIsSubmitting(true);
    const loadingToast = toast.loading('Updating problem...');

    try {
      // Make API call using apiFetcher
      await apiFetcher.patch(`/api/repair/problems/${problem.id}/`, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      toast.dismiss(loadingToast);
      toast.success("Problem updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      onClose();

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || error.message || 'Failed to update problem');
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
          <DialogTitle>Edit Problem</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Problem Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Problem Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter problem name"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
                name="description"
                type="textarea"
                rows={2}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter problem description"
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.description.trim() }
              className="text-secondary cursor-pointer"
            >
              {isSubmitting ? 'Updating...' : 'Update Problem'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

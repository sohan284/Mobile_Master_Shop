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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import { apiFetcher } from '@/lib/api';

export default function EditProblemModal({ isOpen, onClose, onSuccess, problem }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    duration: '',
    status: 'Active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when problem prop changes
  useEffect(() => {
    if (problem) {
      setFormData({
        name: problem.name || '',
        category: problem.category || '',
        price: problem.price || '',
        duration: problem.duration || '',
        status: problem.status || 'Active'
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

  const handleSelectChange = (name, value) => {
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

    if (!formData.category.trim()) {
      toast.error('Please enter category');
      return;
    }

    if (!formData.price.trim()) {
      toast.error('Please enter price');
      return;
    }

    if (!formData.duration.trim()) {
      toast.error('Please enter duration');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Updating problem...');

    try {
      // Make API call using apiFetcher
      await apiFetcher.patch(`/api/repair/problems/${problem.id}/`, {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: formData.price.trim(),
        duration: formData.duration.trim(),
        status: formData.status
      });

      toast.dismiss(loadingToast);
      toast.success('Problem updated successfully!');
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        price: '',
        duration: '',
        status: 'Active'
      });
      
      // Close modal and refresh data
      onClose();
      onSuccess?.();
      
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
        category: '',
        price: '',
        duration: '',
        status: 'Active'
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

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Enter category (e.g., Display, Battery)"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              name="price"
              type="text"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price (e.g., $120)"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration *</Label>
            <Input
              id="duration"
              name="duration"
              type="text"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="Enter duration (e.g., 2-3 hours)"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={isSubmitting || !formData.name.trim() || !formData.category.trim() || !formData.price.trim() || !formData.duration.trim()}
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

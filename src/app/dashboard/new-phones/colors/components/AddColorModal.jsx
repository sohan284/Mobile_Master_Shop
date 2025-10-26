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
import toast from 'react-hot-toast';
import { apiFetcher } from '@/lib/api';

export default function AddColorModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '#000000'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error('Please enter color name');
      return;
    }

    if (!formData.code.trim()) {
      toast.error('Please enter color code');
      return;
    }

    // Validate hex color code
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(formData.code)) {
      toast.error('Please enter a valid hex color code (e.g., #FF0000)');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating color...');

    try {
      await apiFetcher.post('/api/brandnew/color/', {
        name: formData.name.trim(),
        hex_code: formData.code.trim()
      });

      toast.dismiss(loadingToast);
      toast.success('Color created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        code: '#000000'
      });
      
      // Close modal and refresh data
      onClose();
      onSuccess?.();
      
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || error.message || 'Failed to create color');
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
          <DialogTitle>Add New Color</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Color Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Color Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter color name (e.g., Midnight Black)"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Color Code */}
          <div className="space-y-2">
            <Label htmlFor="code">Color Code</Label>
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
                title="Select color"
              />
              <Input
                value={formData.code}
                onChange={handleInputChange}
                placeholder="#000000"
                disabled={isSubmitting}
                required
                className="flex-1"
              />
              <div 
                className="w-12 h-10 rounded border border-gray-300"
                style={{ backgroundColor: formData.code }}
                title="Color preview"
              />
            </div>
            <p className="text-xs text-gray-500">
              Use the color picker or enter a hex color code (e.g., #FF0000 for red)
            </p>
          </div>


          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.name.trim() || !formData.code.trim()}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isSubmitting ? 'Creating...' : 'Create Color'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

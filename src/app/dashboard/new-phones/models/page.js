'use client';

import { useState, useEffect, useMemo } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { useApiGet, useApiPatch } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import AddModelModal from './components/AddModelModal';
import EditModelModal from './components/EditModelModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useQueryClient } from '@tanstack/react-query';

export default function NewPhoneModelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [movingModels, setMovingModels] = useState({}); // Track which models are being moved
  
  const queryClient = useQueryClient();
  
  // Fetch brands for the dropdown
  const { data: brandsResponse, isLoading: brandsLoading } = useApiGet(
    ['new-phone-brands'],
    () => apiFetcher.get('/api/brandnew/brands/')
  );
  const brands = brandsResponse?.data || [];

  // Fetch colors for the dropdown
  const { data: colorsResponse, isLoading: colorsLoading } = useApiGet(
    ['new-phone-colors'],
    () => apiFetcher.get('/api/brandnew/color/')
  );
  const colors = colorsResponse?.data || [];

  // Fetch models from API
  const { data: modelsResponse, isLoading, error, refetch } = useApiGet(
    ['new-phone-models'],
    () => apiFetcher.get('/api/brandnew/models/')
  );
  
  // Sort models by rank (if available) or by id as fallback
  const models = useMemo(() => {
    const modelsData = modelsResponse?.data || [];
    return [...modelsData].sort((a, b) => {
      const rankA = a.rank !== undefined && a.rank !== null ? a.rank : a.id || 0;
      const rankB = b.rank !== undefined && b.rank !== null ? b.rank : b.id || 0;
      return rankA - rankB;
    });
  }, [modelsResponse?.data]);

  const columns = [
    {
      header: 'Icon',
      accessor: 'icon',
      render: (item) => (
        <div className="flex items-center">
          {item?.icon ? (
            <Image 
              src={item.icon} 
              alt={item?.name}
              className="h-12 w-12 object-contain rounded"
              width={48}
              height={48}
            />
          ) : (
            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">No Icon</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Model Name',
      accessor: 'name',
      sortable: true
    },
    {
      header: 'Brand',
      accessor: 'brand_name',
      render: (item) => (
        <div className="flex items-center space-x-2">
          <span>{item.brand_name || 'Unknown Brand'}</span>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Price',
      accessor: 'main_amount',
      render: (item) => (
        <div className="font-medium">
          {item.main_amount ? `$${parseFloat(item.main_amount).toLocaleString()}` : 'N/A'}
        </div>
      ),
      sortable: true
    }, 
    {
      header: 'Discounted Price',
      accessor: 'discounted_amount',
      render: (item) => (
        <div className="font-medium">
          {item.discounted_amount ? `$${parseFloat(item.discounted_amount).toLocaleString()}` : 'N/A'}
        </div>
      ),
    }, 
    {
      header: 'RAM',
      accessor: 'ram',
      render: (item) => (
        <div className="text-sm">
          {item.ram || 'N/A'}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Memory',
      accessor: 'memory',
      render: (item) => (
        <div className="text-sm">
          {item.memory || 'N/A'}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Created At',
      accessor: 'created_at',
      render: (item) => (
        <div className="text-sm text-gray-500">
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
        </div>
      ),  
      sortable: true
    }
  ];

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedModel(null);
  };

  const handleModalSuccess = () => {
    // Refresh the data after successful creation
    refetch();
  };

  const handleEditModalSuccess = () => {
    // Refresh the data after successful update
    refetch();
  };

  const handleEdit = (model) => {
    setSelectedModel(model);
    setIsEditModalOpen(true);
  };

  const handleDelete = (model) => {
    setSelectedModel(model);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedModel) return;

    setIsDeleting(true);
    try {
      await apiFetcher.delete(`/api/brandnew/models/${selectedModel.id}/`);
      setIsDeleteDialogOpen(false);
      setSelectedModel(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete model');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedModel(null);
    setIsDeleting(false);
  };

  // Mutation for updating model rank
  const updateRankMutation = useApiPatch({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['new-phone-models'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update model rank');
    }
  });

  // Handle move up
  const handleMoveUp = async (model, currentIndex) => {
    // currentIndex is the index in the full sorted dataset from DataTable
    if (currentIndex === 0) {
      toast.error('Cannot move up: Already at the top');
      return;
    }

    const previousModel = models[currentIndex - 1];
    if (!previousModel) return;

    // Get current ranks (use index + 1 as fallback if rank doesn't exist)
    const currentRank = model.rank !== undefined && model.rank !== null ? model.rank : currentIndex + 1;
    const previousRank = previousModel.rank !== undefined && previousModel.rank !== null ? previousModel.rank : currentIndex;

    setMovingModels(prev => ({ ...prev, [model.id]: true, [previousModel.id]: true }));

    try {
      // Update both models' ranks with PATCH API calls - swap the ranks
      await Promise.all([
        apiFetcher.patch(`/api/brandnew/models/${model.id}/`, { rank: previousRank }),
        apiFetcher.patch(`/api/brandnew/models/${previousModel.id}/`, { rank: currentRank })
      ]);
      
      toast.success('Model moved up successfully');
      refetch();
    } catch (error) {
      console.error('Error moving model up:', error);
      toast.error(error.response?.data?.message || 'Failed to move model');
    } finally {
      setMovingModels(prev => {
        const newState = { ...prev };
        delete newState[model.id];
        delete newState[previousModel.id];
        return newState;
      });
    }
  };

  // Handle move down
  const handleMoveDown = async (model, currentIndex) => {
    // currentIndex is the index in the full sorted dataset from DataTable
    if (currentIndex === models.length - 1) {
      toast.error('Cannot move down: Already at the bottom');
      return;
    }

    const nextModel = models[currentIndex + 1];
    if (!nextModel) return;

    // Get current ranks (use index + 1 as fallback if rank doesn't exist)
    const currentRank = model.rank !== undefined && model.rank !== null ? model.rank : currentIndex + 1;
    const nextRank = nextModel.rank !== undefined && nextModel.rank !== null ? nextModel.rank : currentIndex + 2;

    setMovingModels(prev => ({ ...prev, [model.id]: true, [nextModel.id]: true }));

    try {
      // Update both models' ranks with PATCH API calls - swap the ranks
      await Promise.all([
        apiFetcher.patch(`/api/brandnew/models/${model.id}/`, { rank: nextRank }),
        apiFetcher.patch(`/api/brandnew/models/${nextModel.id}/`, { rank: currentRank })
      ]);
      
      toast.success('Model moved down successfully');
      refetch();
    } catch (error) {
      console.error('Error moving model down:', error);
      toast.error(error.response?.data?.message || 'Failed to move model');
    } finally {
      setMovingModels(prev => {
        const newState = { ...prev };
        delete newState[model.id];
        delete newState[nextModel.id];
        return newState;
      });
    }
  };

  return (
    <div className="space-y-6">
    

      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Phone Models</h1>
        <p className="text-gray-600">Manage new phone models and their information</p>
      </div>

      <DataTable
        data={models}
        columns={columns}
        title="Models"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
        loading={isLoading}
        movingItems={movingModels}
      />

      {/* Add Model Modal */}
      <AddModelModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        brands={brands}
        colors={colors}
      />

      {/* Edit Model Modal */}
      <EditModelModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditModalSuccess}
        model={selectedModel}
        brands={brands}
        colors={colors}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Model"
        message={`Are you sure you want to delete "${selectedModel?.name}"? This action cannot be undone.`}
        confirmText="Yes, delete it!"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

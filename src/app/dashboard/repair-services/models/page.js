'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher, deleteModel } from '@/lib/api';
import AddModelModal from './components/AddModelModal';
import EditModelModal from './components/EditModelModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ModelsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: modelsResponse, isLoading, error, refetch } = useApiGet(
    ['models'],
    () => apiFetcher.get('/api/repair/models/')
  );
  const { data: brandsResponse, isLoading: brandsLoading, error: brandsError, refetch: refetchBrands } = useApiGet(
    ['brands'],
    () => apiFetcher.get('/api/repair/brands/')
  );
  const brands = brandsResponse?.data || [];
  const models = modelsResponse || [];
  const columns = [
    {
      header: 'Image',
      accessor: 'image',
      render: (item) => (
        <div className="flex items-center">
          <Image 
            src={item?.image || '/Apple.png'} 
            alt={item?.name}
            className="h-8 w-8 object-contain"
            width={32}
            height={32}
          />
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
      accessor: 'brand',
      render: (item) => (
        <div className="flex items-center">
          <span className="text-sm font-medium">{item.brand || 'N/A'}</span>
        </div>
      ),
      sortable: true
    },  
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
    refetch(); // Refresh the data after successful creation
  };

  const handleEditModalSuccess = () => {
    refetch(); // Refresh the data after successful update
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
      await deleteModel(selectedModel.id);
      toast.success(`${selectedModel.name} deleted successfully`);
      refetch(); // Refresh the data after successful deletion
      setIsDeleteDialogOpen(false);
      setSelectedModel(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete model');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedModel(null);
    setIsDeleting(false);
  };

  const handleView = (model) => {
    router.push(`/dashboard/repair-services/models/${model.id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Models Management</h1>
        <p className="text-gray-600">Manage phone models and their information</p>
      </div>

      <DataTable
        data={models}
        columns={columns}
        title="Phone Models"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onRowClick={handleView}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
        loading={isLoading}
      />

      {/* Add Model Modal */}
      <AddModelModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        brands={brands}
      />

      {/* Edit Model Modal */}
      <EditModelModal
        brands={brands}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditModalSuccess}
        model={selectedModel}
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

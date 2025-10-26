'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import AddModelModal from './components/AddModelModal';
import EditModelModal from './components/EditModelModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function NewPhoneModelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  // Fetch brands for the dropdown
  const { data: brandsResponse, isLoading: brandsLoading } = useApiGet(
    ['new-phone-brands'],
    () => apiFetcher.get('/api/brandnew/brands/')
  );
  const brands = brandsResponse?.data || [];

  // Fetch models from API
  const { data: modelsResponse, isLoading, error, refetch } = useApiGet(
    ['new-phone-models'],
    () => apiFetcher.get('/api/brandnew/models/')
  );
  const models = modelsResponse?.data || [];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/dashboard/new-phones"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to New Phones
        </Link>
      </div>

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
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditModalSuccess}
        model={selectedModel}
        brands={brands}
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

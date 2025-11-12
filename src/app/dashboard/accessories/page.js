'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher, deleteAccessory } from '@/lib/api';
import Image from 'next/image';
import AddAccessoryModal from './components/AddAccessoryModal';
import EditAccessoryModal from './components/EditAccessoryModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import PageTransition from '@/components/animations/PageTransition';

export default function AccessoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: accessoriesResponse, isLoading, error, refetch } = useApiGet(
    ['accessories'],
    () => apiFetcher.get('/api/accessories/products/')
  );
  const accessories = accessoriesResponse?.data || accessoriesResponse || [];

  const columns = [
    {
      header: 'Image',
      accessor: 'image',
      render: (item) => (
        <div className="flex items-center">
          <Image
            src={item?.picture || '/placeholder-image.png'}
            alt={item?.name || item?.title || 'Product image'}
            className="h-12 w-12 object-contain rounded"
            width={48}
            height={48}
          />
        </div>
      )
    },
    {
      header: 'Name',
      accessor: 'title',
      sortable: true
    },
  
    {
      header: 'Price',
      accessor: 'main_amount',
      render: (item) => (
        <div className="font-medium text-green-600">
          ${item.main_amount || '0.00'}
        </div>
      ),
      sortable: true
    },
    {
      header: 'Stock',
      accessor: 'stock_quantity',
      render: (item) => (
        <div className={`text-sm ${item.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {item.stock_quantity || 0} in stock
        </div>
      ),
      sortable: true
    },
    {
      header: 'Created At',
      accessor: 'created_at',
      render: (item) => (
        <div className="text-sm text-gray-500">
          {new Date(item.created_at).toLocaleDateString()}
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
    setSelectedAccessory(null);
  };

  const handleModalSuccess = () => {
    refetch(); // Refresh the data after successful creation
  };

  const handleEditModalSuccess = () => {
    refetch(); // Refresh the data after successful update
  };

  const handleEdit = (accessory) => {
    setSelectedAccessory(accessory);
    setIsEditModalOpen(true);
  };

  const handleDelete = (accessory) => {
    setSelectedAccessory(accessory);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAccessory) return;

    setIsDeleting(true);
    try {
      await deleteAccessory(selectedAccessory.id);
      toast.success(`${selectedAccessory.name} deleted successfully`);
      refetch(); // Refresh the data after successful deletion
      setIsDeleteDialogOpen(false);
      setSelectedAccessory(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete accessory');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedAccessory(null);
    setIsDeleting(false);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accessories Management</h1>
          <p className="text-gray-600">Manage phone accessories and their information</p>
        </div>

        <DataTable
          data={accessories}
          columns={columns}
          title="Accessories"
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
          loading={isLoading}
        />

        {/* Add Accessory Modal */}
        <AddAccessoryModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />

        {/* Edit Accessory Modal */}
        <EditAccessoryModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onSuccess={handleEditModalSuccess}
          accessory={selectedAccessory}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Accessory"
          message={`Are you sure you want to delete "${selectedAccessory?.name}"? This action cannot be undone.`}
          confirmText="Yes, delete it!"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />
      </div>
    </PageTransition>
  );
}

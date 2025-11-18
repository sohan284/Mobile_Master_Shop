'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher, deleteBrand } from '@/lib/api';
import Image from 'next/image';
import AddBrandModal from './components/AddBrandModal';
import EditBrandModal from './components/EditBrandModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useTranslations } from 'next-intl';

export default function BrandsPage() {
  const t = useTranslations('dashboard.repairServices.brandsManagement');
  const tCommon = useTranslations('dashboard.common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: brandsResponse, isLoading, error, refetch } = useApiGet(
    ['brands'],
    () => apiFetcher.get('/api/repair/brands/')
  );
  const brands = brandsResponse?.data || [];

  const columns = [
    {
      header: t('logo'),
      accessor: 'logo',
      render: (item) => (
        <div className="flex items-center">
          <Image
            src={item?.logo}
            alt={item?.name}
            className="h-10 w-10 object-contain bg-gray-400 p-1 rounded-md"
            width={32}
            height={32}
          />
        </div>
      )
    },
    {
      header: t('brandName'),
      accessor: 'name',
      sortable: true
    },

    {
      header: t('createdAt'),
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
    setSelectedBrand(null);
  };

  const handleModalSuccess = () => {
    refetch(); // Refresh the data after successful creation
  };

  const handleEditModalSuccess = () => {
    refetch(); // Refresh the data after successful update
  };

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setIsEditModalOpen(true);
  };

  const handleDelete = (brand) => {
    setSelectedBrand(brand);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBrand) return;

    setIsDeleting(true);
    try {
      await deleteBrand(selectedBrand.id);
      toast.success(t('deletedSuccessfully', { name: selectedBrand.name }));
      refetch(); // Refresh the data after successful deletion
      setIsDeleteDialogOpen(false);
      setSelectedBrand(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('failedToDelete'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedBrand(null);
    setIsDeleting(false);
  };



  // Remove the loading check - let DataTable handle it

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <DataTable
        data={brands}
        columns={columns}
        title={t('tableTitle')}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
        loading={isLoading}
      />

      {/* Add Brand Modal */}
      <AddBrandModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Brand Modal */}
      <EditBrandModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditModalSuccess}
        brand={selectedBrand}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={t('deleteBrand')}
        message={t('deleteConfirm', { name: selectedBrand?.name || '' })}
        confirmText={t('yesDelete')}
        cancelText={tCommon('cancel')}
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

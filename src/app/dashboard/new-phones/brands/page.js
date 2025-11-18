'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import Image from 'next/image';
import AddBrandModal from './components/AddBrandModal';
import EditBrandModal from './components/EditBrandModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useTranslations } from 'next-intl';

export default function NewPhoneBrandsPage() {
  const t = useTranslations('dashboard.newPhones.brandsManagement');
  const tCommon = useTranslations('dashboard.common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: brandsResponse, isLoading, error, refetch } = useApiGet(
    ['new-phone-brands'],
    () => apiFetcher.get('/api/brandnew/brands/')
  );
  const brands = brandsResponse?.data || [];

  const columns = [
    {
      header: t('icon'),
      accessor: 'icon',
      render: (item) => (
        <div className="flex items-center">
          {item?.icon ? (
            <Image 
              src={item.icon} 
              alt={item?.name}
              className="h-10 w-10 object-contain bg-gray-400 p-1 rounded-md"
              width={32}
              height={32}
            />
          ) : (
            <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">{t('noIcon')}</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: t('brandName'),
      accessor: 'name',
      sortable: true
    },
  
    {
      header: t('description'),
      accessor: 'description',
      render: (item) => (
        <div className="max-w-xs truncate" title={item.description}>
          {item.description || t('noDescription')}
        </div>
      )
    },
 
    {
      header: t('modelsCount'),
      accessor: 'models_count',
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
      await apiFetcher.delete(`/api/brandnew/brands/${selectedBrand.slug}/`);
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

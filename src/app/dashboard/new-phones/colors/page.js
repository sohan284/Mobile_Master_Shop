'use client';

import { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, ArrowLeft, Palette } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import Link from 'next/link';
import AddColorModal from './components/AddColorModal';
import EditColorModal from './components/EditColorModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useTranslations } from 'next-intl';

export default function ColorsPage() {
  const t = useTranslations('dashboard.newPhones.colorsManagement');
  const tCommon = useTranslations('dashboard.common');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch colors data
  const { data: colorsResponse, isLoading, error, refetch } = useApiGet(
    ['new-phone-colors'],
    () => apiFetcher.get('/api/brandnew/color/')
  );
  const colors = colorsResponse?.data || [];

  const columns = [
    {
      header: t('colorName'),
      accessor: 'name',
      sortable: true
    },
    {
      header: t('colorCode'),
      accessor: 'hex_code',
      render: (item) => (
        <div className="flex items-center space-x-2">
          <div 
            className="w-6 h-6 rounded-full border border-gray-300"
            style={{ backgroundColor: item.hex_code }}
          />
          <span className="font-mono text-sm">{item.hex_code}</span>
        </div>
      ),
      sortable: true
    },
    
  ];

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (color) => {
    setSelectedColor(color);
    setIsEditModalOpen(true);
  };

  const handleDelete = (color) => {
    setSelectedColor(color);
    setIsDeleteDialogOpen(true);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const handleEditModalSuccess = () => {
    refetch();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedColor) return;
    setIsDeleting(true);
    try {
      await apiFetcher.delete(`/api/brandnew/color/${selectedColor.id}/`);
      toast.success(t('deletedSuccessfully'));
      setIsDeleteDialogOpen(false);
      setSelectedColor(null);
      refetch();
    } catch (error) {
      toast.error(t('failedToDelete'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('failedToLoad')}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
   

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Data Table */}
      <DataTable
        data={colors}
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

      {/* Add Color Modal */}
      <AddColorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Color Modal */}
      <EditColorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditModalSuccess}
        color={selectedColor}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('deleteColor')}
        description={t('deleteConfirm', { name: selectedColor?.name || '' })}
        confirmText={tCommon('delete')}
        cancelText={tCommon('cancel')}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}

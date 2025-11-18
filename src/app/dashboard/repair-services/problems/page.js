'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher, deleteProblem } from '@/lib/api';
import AddProblemModal from './components/AddProblemModal';
import EditProblemModal from './components/EditProblemModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';

export default function ProblemsPage() {
  const t = useTranslations('dashboard.repairServices.problemsManagement');
  const tCommon = useTranslations('dashboard.common');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: problemsResponse, isLoading, error, refetch } = useApiGet(
    ['problems'],
    () => apiFetcher.get('/api/repair/problems/')
  );
  const problems = problemsResponse?.data || [];

  const columns = [
    {
      header: t('problemName'),
      accessor: 'name',
      sortable: true
    },
    {
      header: t('description'),
      accessor: 'description',
      render: (item) => (
        <div className="max-w-[200px]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm text-gray-500 truncate cursor-pointer">
                  {item.description}
                </div>
              </TooltipTrigger>
              <TooltipContent>{item.description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
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
    setSelectedProblem(null);
  };

  const handleModalSuccess = () => {
    refetch(); // Refresh the data after successful creation
  };

  const handleEditModalSuccess = () => {
    refetch(); // Refresh the data after successful update
  };

  const handleEdit = (problem) => {
    setSelectedProblem(problem);
    setIsEditModalOpen(true);
  };

  const handleDelete = (problem) => {
    setSelectedProblem(problem);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProblem) return;

    setIsDeleting(true);
    try {
      await deleteProblem(selectedProblem.id);
      toast.success(t('deletedSuccessfully', { name: selectedProblem.name }));
      refetch(); // Refresh the data after successful deletion
      setIsDeleteDialogOpen(false);
      setSelectedProblem(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('failedToDelete'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProblem(null);
    setIsDeleting(false);
  };

  const handleView = (problem) => {
    toast.success(`View problem: ${problem.name}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <DataTable
        data={problems}
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

      {/* Add Problem Modal */}
      <AddProblemModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Problem Modal */}
      <EditProblemModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditModalSuccess}
        problem={selectedProblem}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={t('deleteProblem')}
        message={t('deleteConfirm', { name: selectedProblem?.name || '' })}
        confirmText={t('yesDelete')}
        cancelText={tCommon('cancel')}
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

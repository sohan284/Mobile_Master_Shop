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

export default function ProblemsPage() {
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
      header: 'Problem Name',
      accessor: 'name',
      sortable: true
    },
    {
      header: 'Description',
      accessor: 'description',
      sortable: true
    },

    {
      header: 'Duration',
      accessor: 'duration',
      render: (item) => (
        <div className="text-sm text-gray-500">
          {item.estimated_time} 
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
      toast.success(`${selectedProblem.name} deleted successfully`);
      refetch(); // Refresh the data after successful deletion
      setIsDeleteDialogOpen(false);
      setSelectedProblem(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete problem');
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
        <h1 className="text-2xl font-bold text-gray-900">Problems Management</h1>
        <p className="text-gray-600">Manage repair problems and their pricing</p>
      </div>

      <DataTable
        data={problems}
        columns={columns}
        title="Repair Problems"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
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
        title="Delete Problem"
        message={`Are you sure you want to delete "${selectedProblem?.name}"? This action cannot be undone.`}
        confirmText="Yes, delete it!"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

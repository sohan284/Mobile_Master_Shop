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
  const [selectedBrandSlug, setSelectedBrandSlug] = useState('apple'); // Track selected brand slug for filtering
  const [modelsList, setModelsList] = useState([]);
  const [movingItems, setMovingItems] = useState({});

  const { data: brandsResponse } = useApiGet(
    ['brands'],
    () => apiFetcher.get('/api/repair/brands/')
  );
  const brands = brandsResponse?.data || [];

  // Fetch models from API - include brand filter if selected
  const { data: modelsResponse, isLoading, error, refetch } = useApiGet(
    ['models', selectedBrandSlug],
    () => {
      const url = selectedBrandSlug 
        ? `/api/repair/models/?brand=${selectedBrandSlug}`
        : '/api/repair/models/';
      return apiFetcher.get(url);
    }
  );

  // Initialize local models list - maintain API order
  useEffect(() => {
    if (modelsResponse) {
      // Keep models in the exact order from API
      const modelsData = Array.isArray(modelsResponse) ? modelsResponse : [];
      setModelsList(modelsData);
    }
  }, [modelsResponse]);

  const columns = [
    {
      header: 'Image',
      accessor: 'image',
      render: (item) => (
        <div className="flex items-center">
          <Image
            src={item?.image || '/Apple.png'}
            alt={item?.name}
            className="h-11 w-11 object-contain"
            width={40}
            height={40}
          />
        </div>
      ),
    },
    {
      header: 'Model Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Brand',
      accessor: 'brand',
      render: (item) => (
        <div className="flex items-center">
          <span className="text-sm font-medium">{item.brand || 'N/A'}</span>
        </div>
      ),
      sortable: true,
    },
  ];

  const handleAdd = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedModel(null);
  };

  const handleModalSuccess = () => refetch();
  const handleEditModalSuccess = () => refetch();

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
      refetch();
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

  // Move up - API calls
  const handleMoveUp = async (model, currentIndex) => {
    if (currentIndex === 0) {
      toast.error('Already at the top');
      return;
    }

    const modelAbove = modelsList[currentIndex - 1];
    if (!modelAbove || !model) {
      toast.error('Cannot move item');
      return;
    }

    // Use existing rank fields from the models
    if (model.rank === undefined || modelAbove.rank === undefined) {
      toast.error('Rank information is missing');
      return;
    }

    const currentRank = model.rank;
    const aboveRank = modelAbove.rank;

    // Mark both items as moving
    setMovingItems({ [model.id]: true, [modelAbove.id]: true });
    
    try {
      // Update current model: rank + 1
      // Update model above: rank - 1
      await Promise.all([
        apiFetcher.patch(`/api/repair/models/${model.id}/`, { rank: currentRank + 1 }),
        apiFetcher.patch(`/api/repair/models/${modelAbove.id}/`, { rank: aboveRank - 1 })
      ]);
      
      toast.success('Model moved up successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to move model');
    } finally {
      setMovingItems({});
    }
  };

  // Move down - API calls
  const handleMoveDown = async (model, currentIndex) => {
    if (currentIndex === modelsList.length - 1) {
      toast.error('Already at the bottom');
      return;
    }

    const modelBelow = modelsList[currentIndex + 1];
    if (!modelBelow || !model) {
      toast.error('Cannot move item');
      return;
    }

    // Use existing rank fields from the models
    if (model.rank === undefined || modelBelow.rank === undefined) {
      toast.error('Rank information is missing');
      return;
    }

    const currentRank = model.rank;
    const belowRank = modelBelow.rank;

    // Mark both items as moving
    setMovingItems({ [model.id]: true, [modelBelow.id]: true });
    
    try {
      // Update current model: rank - 1
      // Update model below: rank + 1
      await Promise.all([
        apiFetcher.patch(`/api/repair/models/${model.id}/`, { rank: currentRank - 1 }),
        apiFetcher.patch(`/api/repair/models/${modelBelow.id}/`, { rank: belowRank + 1 })
      ]);
      
      toast.success('Model moved down successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to move model');
    } finally {
      setMovingItems({});
    }
  };

  // Handle brand tab selection
  const handleBrandSelect = (brandSlug) => {
    setSelectedBrandSlug(brandSlug);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-2xl font-bold text-gray-900">Models Management</p>
        <p className="text-gray-600">Manage phone models and their information</p>
      </div>

      {/* Brand Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 flex-wrap" aria-label="Brands">
          {/* <button
            onClick={() => handleBrandSelect(null)}
            className={`
              whitespace-nowrap py-4 cursor-pointer px-1 border-b-2 font-medium text-sm
              ${
                selectedBrandSlug === null
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            All Brands
          </button> */}
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleBrandSelect(brand.slug)}
              className={`
                whitespace-nowrap py-4 cursor-pointer px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                ${
                  selectedBrandSlug === brand.slug
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {brand.logo && (
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  className="h-5 w-5 object-contain"
                  width={20}
                  height={20}
                />
              )}
              <span>{brand.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <DataTable
        data={modelsList}
        columns={columns}
        title="Phone Models"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onRowClick={handleView}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
        loading={isLoading}
        movingItems={movingItems}
        height='72vh'
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

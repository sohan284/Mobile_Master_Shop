'use client';

import { useState, useEffect, Suspense } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';

function ModelsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState('apple');
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

  // Initialize brand from URL params on mount and when URL changes
  useEffect(() => {
    const brandFromUrl = searchParams.get('brand');
    if (brandFromUrl) {
      setSelectedBrandSlug(brandFromUrl);
    } else {
      // If no brand in URL, set default and update URL
      setSelectedBrandSlug('apple');
      const params = new URLSearchParams(searchParams.toString());
      params.set('brand', 'apple');
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

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
      header: '',
      accessor: 'index',
      render: (item, index) => (
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">{index + 1}</span>
        </div>
      ),
    },
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

  // Drag and drop handler - swap any two items
  const handleDragDrop = async (draggedModel, targetModel, draggedIndex, targetIndex) => {
    if (!draggedModel || !targetModel || draggedModel.id === targetModel.id) {
      return;
    }

    // Use existing rank fields from the models
    if (draggedModel.rank === undefined || targetModel.rank === undefined) {
      toast.error('Rank information is missing');
      return;
    }

    const draggedRank = draggedModel.rank;
    const targetRank = targetModel.rank;

    // Mark both items as moving
    setMovingItems({ [draggedModel.id]: true, [targetModel.id]: true });
    
    try {
      // Swap ranks between the two models
      await Promise.all([
        apiFetcher.patch(`/api/repair/models/${draggedModel.id}/`, { rank: targetRank }),
        apiFetcher.patch(`/api/repair/models/${targetModel.id}/`, { rank: draggedRank })
      ]);
      
      toast.success('Models reordered successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to reorder models');
    } finally {
      setMovingItems({});
    }
  };

  // Handle brand tab selection - update URL and state
  const handleBrandSelect = (brandSlug) => {
    setSelectedBrandSlug(brandSlug);
    // Update URL with brand parameter
    const params = new URLSearchParams(searchParams.toString());
    if (brandSlug) {
      params.set('brand', brandSlug);
    } else {
      params.delete('brand');
    }
    router.push(`?${params.toString()}`, { scroll: false });
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
        onDragDrop={handleDragDrop}
        searchable={true}
        pagination={false}
        showMore={true}
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

export default function ModelsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ModelsPageContent />
    </Suspense>
  );
}

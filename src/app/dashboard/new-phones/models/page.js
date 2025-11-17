'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import Image from 'next/image';
import AddModelModal from './components/AddModelModal';
import EditModelModal from './components/EditModelModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

function NewPhoneModelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  // Get brand from URL params, default to 'apple' if not present
  const [selectedBrandSlug, setSelectedBrandSlug] = useState('apple');
  const [movingModels, setMovingModels] = useState({}); // Track which models are being moved
  
  // Fetch brands for the dropdown
  const { data: brandsResponse, isLoading: brandsLoading } = useApiGet(
    ['new-phone-brands'],
    () => apiFetcher.get('/api/brandnew/brands/')
  );
  const brands = brandsResponse?.data || [];

  // Fetch colors for the dropdown
  const { data: colorsResponse, isLoading: colorsLoading } = useApiGet(
    ['new-phone-colors'],
    () => apiFetcher.get('/api/brandnew/color/')
  );
  const colors = colorsResponse?.data || [];

  // Fetch models from API - include brand filter if selected
  const { data: modelsResponse, isLoading, error, refetch } = useApiGet(
    ['new-phone-models', selectedBrandSlug],
    () => {
      const url = selectedBrandSlug 
        ? `/api/brandnew/models/?brand=${selectedBrandSlug}`
        : '/api/brandnew/models/';
      return apiFetcher.get(url);
    }
  );
  
  const [modelsList, setModelsList] = useState([]);

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

  // Initialize local models list - sort by rank (higher rank first)
  useEffect(() => {
    if (modelsResponse) {
      const modelsData = Array.isArray(modelsResponse) ? modelsResponse : (modelsResponse?.data || []);
      // Sort by rank in descending order (higher rank first)
      const sortedModels = [...modelsData].sort((a, b) => {
        const rankA = parseFloat(a.rank || 0);
        const rankB = parseFloat(b.rank || 0);
        return rankB - rankA; // Higher rank first
      });
      setModelsList(sortedModels);
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
      header: 'Icon',
      accessor: 'icon',
      render: (item) => (
        <div className="flex items-center">
          {item?.icon || item?.stock_management[0]?.icon_color_based ? (
            <Image 
              src={item?.icon || item?.stock_management[0]?.icon_color_based || '/Apple.png'} 
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
      header: 'Stock',
      accessor: 'stock_management',
      render: (item) => (
        <div className="text-sm">
          {item.stock_management.reduce((acc, curr) => acc + curr.stock, 0) || 'N/A'}
        </div>
      ),
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
    setMovingModels({ [draggedModel.id]: true, [targetModel.id]: true });
    
    try {
      // Swap ranks between the two models
      await Promise.all([
        apiFetcher.patch(`/api/brandnew/models/${draggedModel.id}/`, { rank: targetRank }),
        // apiFetcher.patch(`/api/brandnew/models/${targetModel.id}/`, { rank: draggedRank })
      ]);
      
      toast.success('Models reordered successfully');
      refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to reorder models');
    } finally {
      setMovingModels({});
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
        <h1 className="text-2xl font-bold text-gray-900">New Phone Models</h1>
        <p className="text-gray-600">Manage new phone models and their information</p>
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
              {brand.icon && (
                <Image
                  src={brand.icon}
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
        title="Models"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDragDrop={handleDragDrop}
        searchable={true}
        pagination={false}
        showMore={true}
        itemsPerPage={10}
        loading={isLoading}
        height='72vh'
        movingItems={movingModels}
      />

      {/* Add Model Modal */}
      <AddModelModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        brands={brands}
        colors={colors}
      />

      {/* Edit Model Modal */}
      <EditModelModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditModalSuccess}
        model={selectedModel}
        brands={brands}
        colors={colors}
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

export default function NewPhoneModelsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <NewPhoneModelsContent />
    </Suspense>
  );
}

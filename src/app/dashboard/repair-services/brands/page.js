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

export default function BrandsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: brandsResponse, isLoading, error, refetch } = useApiGet(
    ['brands'],
    () => apiFetcher.get('/api/repair/brands/')
  );
  const brands = brandsResponse?.data || [];

  const columns = [
    {
      header: 'Logo',
      accessor: 'logo',
      render: (item) => (
        <div className="flex items-center">
          <Image 
            src={item?.logo || '/Apple.png'} 
            alt={item?.name}
            className="h-8 w-8 object-contain"
            width={32}
            height={32}
          />
        </div>
      )
    },
    {
      header: 'Brand Name',
      accessor: 'name',
      sortable: true
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <Badge variant={item.status === 'Active' ? 'default' : 'destructive'}>
          {item.status}
        </Badge>
      )
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

  const handleModalSuccess = () => {
    refetch(); // Refresh the data after successful creation
  };

  const handleEdit = (brand) => {
    toast.success(`Edit brand: ${brand.name}`);
  };

  const handleDelete = (brand) => {
    if (confirm(`Are you sure you want to delete ${brand.name}?`)) {
      setBrands(prev => prev.filter(b => b.id !== brand.id));
      toast.success(`${brand.name} deleted successfully`);
    }
  };

  const handleView = (brand) => {
    toast.success(`View brand: ${brand.name}`);
  };

  // Remove the loading check - let DataTable handle it

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Brands Management</h1>
        <p className="text-gray-600">Manage phone brands and their information</p>
      </div>

      <DataTable
        data={brands}
        columns={columns}
        title="Brands"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
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
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function ModelsPage() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data - replace with API call
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sampleModels = [
          { id: 1, name: 'iPhone 14 Pro', brand: 'Apple', category: 'Smartphone', status: 'Active', createdAt: '2024-01-15' },
          { id: 2, name: 'Galaxy S23 Ultra', brand: 'Samsung', category: 'Smartphone', status: 'Active', createdAt: '2024-01-15' },
          { id: 3, name: 'P60 Pro', brand: 'Huawei', category: 'Smartphone', status: 'Active', createdAt: '2024-01-15' },
          { id: 4, name: 'Mi 13 Pro', brand: 'Xiaomi', category: 'Smartphone', status: 'Active', createdAt: '2024-01-15' },
          { id: 5, name: 'Find X6 Pro', brand: 'Oppo', category: 'Smartphone', status: 'Active', createdAt: '2024-01-15' },
          { id: 6, name: 'Magic 5 Pro', brand: 'Honor', category: 'Smartphone', status: 'Inactive', createdAt: '2024-01-15' },
        ];
        
        setModels(sampleModels);
      } catch (error) {
        toast.error('Failed to fetch models');
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const columns = [
    {
      header: 'Model Name',
      accessor: 'name',
      sortable: true
    },
    {
      header: 'Brand',
      accessor: 'brand',
      sortable: true
    },
    {
      header: 'Category',
      accessor: 'category',
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
      accessor: 'createdAt',
      sortable: true
    }
  ];

  const handleAdd = () => {
    toast.success('Add model functionality will be implemented');
  };

  const handleEdit = (model) => {
    toast.success(`Edit model: ${model.name}`);
  };

  const handleDelete = (model) => {
    if (confirm(`Are you sure you want to delete ${model.name}?`)) {
      setModels(prev => prev.filter(m => m.id !== model.id));
      toast.success(`${model.name} deleted successfully`);
    }
  };

  const handleView = (model) => {
    toast.success(`View model: ${model.name}`);
  };

  // Remove the loading check - let DataTable handle it

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Models Management</h1>
        <p className="text-gray-600">Manage phone models and their information</p>
      </div>

      <DataTable
        data={models}
        columns={columns}
        title="Phone Models"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchable={true}
        pagination={true}
        itemsPerPage={10}
        loading={loading}
      />
    </div>
  );
}

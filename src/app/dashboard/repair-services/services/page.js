'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data - replace with API call
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const sampleServices = [
          { 
            id: 1, 
            name: 'Screen Replacement', 
            category: 'Display', 
            price: '$120', 
            duration: '2-3 hours',
            status: 'Active', 
            createdAt: '2024-01-15' 
          },
          { 
            id: 2, 
            name: 'Battery Replacement', 
            category: 'Battery', 
            price: '$80', 
            duration: '1-2 hours',
            status: 'Active', 
            createdAt: '2024-01-15' 
          },
          { 
            id: 3, 
            name: 'Camera Repair', 
            category: 'Camera', 
            price: '$150', 
            duration: '3-4 hours',
            status: 'Active', 
            createdAt: '2024-01-15' 
          },
          { 
            id: 4, 
            name: 'Charging Port Repair', 
            category: 'Charging', 
            price: '$60', 
            duration: '1 hour',
            status: 'Active', 
            createdAt: '2024-01-15' 
          },
          { 
            id: 5, 
            name: 'Water Damage Repair', 
            category: 'General', 
            price: '$200', 
            duration: '4-6 hours',
            status: 'Active', 
            createdAt: '2024-01-15' 
          },
          { 
            id: 6, 
            name: 'Speaker Repair', 
            category: 'Audio', 
            price: '$90', 
            duration: '2 hours',
            status: 'Inactive', 
            createdAt: '2024-01-15' 
          },
        ];
        
        setServices(sampleServices);
      } catch (error) {
        toast.error('Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const columns = [
    {
      header: 'Service Name',
      accessor: 'name',
      sortable: true
    },
    {
      header: 'Category',
      accessor: 'category',
      sortable: true
    },
    {
      header: 'Price',
      accessor: 'price',
      sortable: true
    },
    {
      header: 'Duration',
      accessor: 'duration',
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
    toast.success('Add service functionality will be implemented');
  };

  const handleEdit = (service) => {
    toast.success(`Edit service: ${service.name}`);
  };

  const handleDelete = (service) => {
    if (confirm(`Are you sure you want to delete ${service.name}?`)) {
      setServices(prev => prev.filter(s => s.id !== service.id));
      toast.success(`${service.name} deleted successfully`);
    }
  };

  const handleView = (service) => {
    toast.success(`View service: ${service.name}`);
  };

  // Remove the loading check - let DataTable handle it

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
        <p className="text-gray-600">Manage repair services and their pricing</p>
      </div>

      <DataTable
        data={services}
        columns={columns}
        title="Repair Services"
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

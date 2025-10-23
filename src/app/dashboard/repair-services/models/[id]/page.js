'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/ui/DataTable';
import DataTableSkeleton from '@/components/ui/DataTableSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useApiGet } from '@/hooks/useApi';
import { apiFetcher, deleteService } from '@/lib/api';
import Image from 'next/image';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import AddModelServiceModal from './components/AddModelServiceModal';
import EditModelServiceModal from './components/EditModelServiceModal';

export default function ModelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const modelId = params.id;
  
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch model details
  const { data: modelResponse, isLoading: modelLoading, error: modelError, refetch: refetchModel } = useApiGet(
    ['model', modelId],
    () => apiFetcher.get(`/api/repair/models/${modelId}/`)
  );
  const model = modelResponse;



  const {data: modelServicesResponse, isLoading: isModelServicesLoading, error: modelServicesError, refetch: modelServicesRefetch} = useApiGet(
    ['modelServices',modelId],
    () => apiFetcher.get(`/api/repair/repair-prices/?phone_model=${modelId}`)
  );
  const modelServices = modelServicesResponse?.data || [];
  const serviceColumns = [
    {
      header: 'Problem',
      accessor: 'problem_name',
      sortable: true
    },
    {
      header:"Original Price",
      render: (item) => (
        <div className="font-medium">
          {item?.original?.base_price || '0.00'}
        </div>
      ),
    },  
    {
      header:"Original Discount Percentage",
      render: (item) => (
        <div className="font-medium text-center">
          {item?.original?.discount_percentage || 'N/A'}
        </div>
      ),
    },  
    {
      header:"Original Discount Amount",
      render: (item) => (
        <div className="font-medium text-center">
          {item?.original?.discount_amount || '0.00'}
        </div>
      ),
    },  
    {
      header:"Duplicate Price",
      render: (item) => (
        <div className="font-medium">
          {item?.duplicate?.base_price || '0.00'}
        </div>
      ),
    },
    {header:"Duplicate Discount Percentage",
      render: (item) => (
        <div className="font-medium text-center">
          {item?.duplicate?.discount_percentage || '0.00'}
        </div>
      ),
    },  
    {
      header:"Duplicate Discount Amount",
      render: (item) => (
        <div className="font-medium text-center">
        {item?.duplicate?.discount_amount || '0.00'}
        </div>
      ),
    },  
    {
      header:"Warranty Days",
      accessor: 'warranty_days',
      render: (item) => (
        <div className="text-sm text-gray-600">
          {item?.original?.warranty_days || item?.duplicate?.warranty_days || 'N/A'}
        </div>
      ),
    },
   
    {
      header: 'Created At',
      accessor: 'created_at',
      render: (item) => (
        <div className="text-sm text-gray-500">
          {new Date(item?.original?.created_at).toLocaleDateString() || new Date(item?.duplicate?.created_at).toLocaleDateString() || 'N/A'}
        </div>
      ),  
    }
  ];

  const handleAddService = () => {
    setIsAddServiceModalOpen(true);
  };

  const handleAddServiceModalClose = () => {
    setIsAddServiceModalOpen(false);
  };

  const handleEditServiceModalClose = () => {
    setIsEditServiceModalOpen(false);
    setSelectedService(null);
  };

  const handleAddServiceSuccess = () => {
    refetchServices(); // Refresh the services data
  };

  const handleEditServiceSuccess = () => {
    refetchServices(); // Refresh the services data
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsEditServiceModalOpen(true);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteServiceConfirm = async () => {
    if (!selectedService) return;

    setIsDeleting(true);
    console.log(selectedService);
    
    try {
      await deleteService(selectedService.problem_id);
      toast.success(`${selectedService.name} deleted successfully`);
      refetchServices(); // Refresh the services data
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete service');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteServiceCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedService(null);
    setIsDeleting(false);
  };

  const handleViewService = (service) => {
    toast.success(`View service: ${service.name}`);
  };

  if (modelLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-9 w-20" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Model Information Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Model Image Skeleton */}
              <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-24 w-24 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Model Details Skeleton */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-12 w-12 rounded" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Section Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </CardHeader>
          <CardContent>
            <DataTableSkeleton 
              columns={serviceColumns}
              rows={5}
              showHeader={true}
              showSearch={true}
              showPagination={true}
            />
          </CardContent>
        </Card>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{model?.name}</h1>
          <p className="text-gray-600">Model details and services</p>
        </div>
      </div>

      {/* Model Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Model Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Model Image */}
            <div className="flex flex-col items-center space-y-2">
              <Image 
                src={model?.image || '/Apple.png'} 
                alt={model?.name}
                className="h-24 w-24 object-contain"
                width={96}
                height={96}
              />
              <span className="text-sm text-gray-500">Model Image</span>
            </div>

            {/* Model Details */}
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Brand</label>
                <p className="text-lg font-semibold">{model?.brand_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Brand Logo</label>
                <Image 
                src={model?.brand_logo || '/Apple.png'} 
                alt={model?.name}
                className="h-12 w-12 object-contain"
                width={24}
                height={24}
              />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div>
                  <Badge variant={model?.status === 'Active' ? 'default' : 'destructive'}>
                    {model?.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-sm">{new Date(model?.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Services Count</label>
                <p className="text-2xl font-bold text-blue-600">{model.available_repairs_count}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

   <DataTable
            data={modelServices}
            columns={serviceColumns}
            title="Services"
            onAdd={handleAddService}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            onView={handleViewService}
            searchable={true}
            pagination={true}
            itemsPerPage={10}
            loading={isModelServicesLoading}
          />
    

      {/* Add Service Modal */}
      <AddModelServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={handleAddServiceModalClose}
        onSuccess={handleAddServiceSuccess}
        modelId={modelId}
        existingServices={modelServices}
      />

      {/* Edit Service Modal */}
      <EditModelServiceModal
        isOpen={isEditServiceModalOpen}
        onClose={handleEditServiceModalClose}
        onSuccess={handleEditServiceSuccess}
        service={selectedService}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteServiceCancel}
        onConfirm={handleDeleteServiceConfirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedService?.name}"? This action cannot be undone.`}
        confirmText="Yes, delete it!"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

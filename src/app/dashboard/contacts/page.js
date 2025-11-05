'use client';
import React, { useState, useMemo } from 'react';
import { 
  MessageSquare,
  Calendar,
  Mail,
  Phone,
  User,
  Trash2
} from 'lucide-react';
import PageTransition from '@/components/animations/PageTransition';
import { useApiGet, useApiPatch } from '@/hooks/useApi';
import { apiFetcher } from '@/lib/api';
import DataTable from '@/components/ui/DataTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ApiErrorMessage from '@/components/ui/ApiErrorMessage';

export default function ContactsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'pending', 'resolved'
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const queryClient = useQueryClient();

  // Reset page when status filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  // Mutation for updating contact status
  const updateStatusMutation = useApiPatch({
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts', selectedStatus, currentPage] });
      
      setUpdatingStatus(prev => {
        const newState = { ...prev };
        delete newState[variables.contactId];
        return newState;
      });
      toast.success('Contact status updated successfully');
    },
    onError: (error, variables) => {
      setUpdatingStatus(prev => {
        const newState = { ...prev };
        delete newState[variables.contactId];
        return newState;
      });
      toast.error(error.response?.data?.message || 'Failed to update contact status');
    }
  });

  // Function to handle delete
  const handleDelete = (contact) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedContact) return;

    setIsDeleting(true);
    try {
      await apiFetcher.delete(`/api/contact/${selectedContact.id}/`);
      toast.success('Contact deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['contacts', selectedStatus, currentPage] });
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to delete contact');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedContact(null);
    setIsDeleting(false);
  };

  // Function to handle status change
  const handleStatusChange = async (contact, newStatus) => {
    const currentStatus = (contact.status || '').toLowerCase();
    if (currentStatus === newStatus.toLowerCase()) return;
    
    const contactId = contact.id;
    if (!contactId) {
      toast.error('Contact ID not found');
      return;
    }
    
    setUpdatingStatus(prev => ({ ...prev, [contactId]: true }));
    
    const endpoint = `/api/contact/${contactId}/`;

    updateStatusMutation.mutate({
      url: endpoint,
      data: { status: newStatus },
      contactId: contactId
    });
  };

  // Fetch contacts from API with status filter and pagination
  const { data: contactsData, isLoading: isLoadingContacts, error: errorContacts, refetch } = useApiGet(
    ['contacts', selectedStatus, currentPage],
    () => {
      const url = '/api/contact/';
      const params = new URLSearchParams();
      
      // Add status query parameter if status filter is not 'all'
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }
      
      // Add page parameter
      params.append('page', currentPage.toString());
      
      // Build URL with query parameters
      const queryString = params.toString();
      return apiFetcher.get(queryString ? `${url}?${queryString}` : url);
    }
  );

  // Extract and normalize contacts from API
  const normalizedContacts = useMemo(() => {
    const normalizeContact = (contact) => {
      return {
        ...contact,
        id: contact.id,
        name: contact.name || contact.full_name || 'N/A',
        email: contact.email || 'N/A',
        phone: contact.phone || contact.phone_number || 'N/A',
        message: contact.message || contact.message_text || 'N/A',
        status: contact.status || 'pending',
        statusDisplay: contact.status_display || contact.status || 'Pending',
        createdAt: contact.created_at || contact.createdAt || null,
        updatedAt: contact.updated_at || contact.updatedAt || null,
      };
    };

    // Extract contacts from response
    const contacts = Array.isArray(contactsData?.data) ? contactsData.data : 
                   Array.isArray(contactsData?.results) ? contactsData.results :
                   Array.isArray(contactsData) ? contactsData : 
                   [];
    return contacts.map(contact => normalizeContact(contact)).sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [contactsData]);

  // Extract pagination info from API response
  const pagination = contactsData?.pagination || {};
  const totalCount = pagination.count || 0;
  const totalPages = pagination.total_pages || 1;
  const pageSize = pagination.page_size || 20;
  const apiCurrentPage = pagination.current_page || currentPage;

  const isLoading = isLoadingContacts;
  const error = errorContacts;

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'resolved') {
      return 'bg-green-100 text-green-800';
    } else if (statusLower === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Get status badge classes for Select component
  const getStatusBadgeClasses = (status) => {
    return getStatusBadge(status);
  };

  // Status options for dropdown
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
  ];

  // Status options for filter dropdown (with 'all')
  const filterStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...statusOptions,
  ];

  // Define columns for DataTable
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
      render: (contact) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{contact.name}</span>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true,
      render: (contact) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span>{contact.email}</span>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
      sortable: true,
      render: (contact) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{contact.phone}</span>
        </div>
      ),
    },
    {
      header: 'Message',
      accessor: 'message',
      sortable: false,
      render: (contact) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (contact) => {
        const isUpdating = updatingStatus[contact.id];
        const currentStatus = contact.status?.toLowerCase() || 'pending';
        const badgeClasses = getStatusBadgeClasses(currentStatus);
        
        return (
          <Select 
            value={currentStatus} 
            onValueChange={(newStatus) => handleStatusChange(contact, newStatus)}
            disabled={isUpdating}
          >
            <SelectTrigger 
              className={`w-[140px] h-8 text-xs rounded-lg cursor-pointer border-0 ${badgeClasses} font-semibold hover:opacity-80`}
            >
              <SelectValue>
                {isUpdating ? (
                  <span className="text-xs">Updating...</span>
                ) : (
                  <span className="text-xs font-semibold capitalize">
                    {statusOptions.find(opt => opt.value === currentStatus)?.label || contact.statusDisplay}
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="capitalize">{option.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      sortable: true,
      render: (contact) => (
        contact.createdAt ? (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>
              {new Date(contact.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        ) : (
          'N/A'
        )
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="flex flex-col gap-6" style={{ height: 'calc(100vh - 10rem)' }}>
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Contacts
          </h1>
          <p className="text-gray-600">Manage contact messages and inquiries</p>
        </div>

        {/* Contacts Table Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col">
            {error ? (
              <ApiErrorMessage
                error={error}
                title="Error Loading Contacts"
                onRetry={() => refetch()}
                retryLabel="Try Again"
                showReload={true}
              />
            ) : (
              <DataTable
                data={normalizedContacts}
                columns={columns}
                title="Contact Messages"
                searchable={true}
                pagination={true}
                itemsPerPage={pageSize}
                loading={isLoading}
                className="bg-white border-gray-200"
                height="80vh"
                totalCount={totalCount}
                totalPages={totalPages}
                currentPage={apiCurrentPage}
                onPageChange={setCurrentPage}
                onDelete={handleDelete}
                statusFilter={
                  <Select className="cursor-pointer" value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px] h-10">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact"
        message={`Are you sure you want to delete the contact from "${selectedContact?.name || 'N/A'}"? This action cannot be undone.`}
        confirmText="Yes, delete it!"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </PageTransition>
  );
}


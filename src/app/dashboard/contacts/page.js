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
import { useTranslations } from 'next-intl';

export default function ContactsPage() {
  const t = useTranslations('dashboard.contacts');
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
      toast.success(t('contactStatusUpdatedSuccessfully'));
    },
    onError: (error, variables) => {
      setUpdatingStatus(prev => {
        const newState = { ...prev };
        delete newState[variables.contactId];
        return newState;
      });
      toast.error(error.response?.data?.message || t('failedToUpdateContactStatus'));
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
      await apiFetcher.delete(`/auth/contact/${selectedContact.id}/`);
      toast.success(t('contactDeletedSuccessfully'));
      queryClient.invalidateQueries({ queryKey: ['contacts', selectedStatus, currentPage] });
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || t('failedToDeleteContact'));
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
    // Convert string status to boolean
    const newStatusBoolean = newStatus === 'resolved' || newStatus === true;
    const currentStatus = contact.status === true || contact.status === 'true';
    
    // If status is already the same, return
    if (currentStatus === newStatusBoolean) return;
    
    const contactId = contact.id;
    if (!contactId) {
      toast.error(t('failedToUpdateContactStatus'));
      return;
    }
    
    setUpdatingStatus(prev => ({ ...prev, [contactId]: true }));
    
    const endpoint = `/auth/contact/${contactId}/`;

    updateStatusMutation.mutate({
      url: endpoint,
      data: { status: newStatusBoolean }, // Send boolean value
      contactId: contactId
    });
  };

  // Fetch contacts from API with status filter and pagination
  const { data: contactsData, isLoading: isLoadingContacts, error: errorContacts, refetch } = useApiGet(
    ['contacts', selectedStatus, currentPage],
    () => {
      const url = '/auth/contact/';
      const params = new URLSearchParams();
      
      // Add status query parameter if status filter is not 'all'
      // Convert 'pending' to false and 'resolved' to true for API
      if (selectedStatus !== 'all') {
        const statusBoolean = selectedStatus === 'resolved' ? 'true' : 'false';
        params.append('status', statusBoolean);
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
      // Handle boolean status: false = pending, true = resolved
      const status = contact.status;
      const isResolved = status === true || status === 'true' || status === 'resolved';
      
      return {
        ...contact,
        id: contact.id,
        name: contact.name || contact.full_name || 'N/A',
        email: contact.email || 'N/A',
        phone: contact.phone || contact.phone_number || 'N/A',
        message: contact.message || contact.message_text || 'N/A',
        status: isResolved, // Store as boolean
        statusDisplay: isResolved ? t('resolved') : t('pending'),
        createdAt: contact.created_at || contact.createdAt || null,
        updatedAt: contact.updated_at || contact.updatedAt || null,
      };
    };

    // Extract contacts from response
    const contacts = Array.isArray(contactsData?.results.data) ? contactsData.results.data : 
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

  // Get status badge styling (handles boolean status)
  const getStatusBadge = (status) => {
    // Handle boolean or string status
    const isResolved = status === true || status === 'true' || status === 'resolved';
    if (isResolved) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Get status badge classes for Select component
  const getStatusBadgeClasses = (status) => {
    return getStatusBadge(status);
  };

  // Status options for dropdown
  const statusOptions = [
    { value: 'pending', label: t('pending') },
    { value: 'resolved', label: t('resolved') },
  ];

  // Status options for filter dropdown (with 'all')
  const filterStatusOptions = [
    { value: 'all', label: t('allStatuses') },
    ...statusOptions,
  ];

  // Define columns for DataTable
  const columns = [
    {
      header: t('name'),
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
      header: t('email'),
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
      header: t('subject'),
      accessor: 'subject',
      sortable: true,
      render: (contact) => (
        <div className="flex items-center gap-2">
          <span>{contact.subject}</span>
        </div>
      ),
    },
    
    {
      header: t('message'),
      accessor: 'message',
      sortable: false,
      render: (contact) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-700 line-clamp-2">{contact.message}</p>
        </div>
      ),
    },
    {
      header: t('status'),
      accessor: 'status',
      sortable: true,
      render: (contact) => {
        const isUpdating = updatingStatus[contact.id];
        // Convert boolean status to string for Select component
        const isResolved = contact.status === true || contact.status === 'true';
        const currentStatusString = isResolved ? 'resolved' : 'pending';
        const badgeClasses = getStatusBadgeClasses(contact.status);
        
        return (
          <Select 
            value={currentStatusString} 
            onValueChange={(newStatus) => handleStatusChange(contact, newStatus)}
            disabled={isUpdating}
          >
            <SelectTrigger 
              className={`w-[140px] h-8 text-xs rounded-lg cursor-pointer border-0 ${badgeClasses} font-semibold hover:opacity-80`}
            >
              <SelectValue>
                {isUpdating ? (
                  <span className="text-xs">{t('updating')}</span>
                ) : (
                  <span className="text-xs font-semibold capitalize">
                    {contact.statusDisplay || (isResolved ? t('resolved') : t('pending'))}
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
      header: t('date'),
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
            {t('title')}
          </h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Contacts Table Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col">
            {error ? (
              <ApiErrorMessage
                error={error}
                title={t('errorLoadingContacts')}
                onRetry={() => refetch()}
                retryLabel={t('tryAgain')}
                showReload={true}
              />
            ) : (
              <DataTable
                data={normalizedContacts}
                columns={columns}
                title={t('tableTitle')}
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
                      <SelectValue placeholder={t('filterByStatus')} />
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
        title={t('deleteContact')}
        message={t('deleteConfirm', { name: selectedContact?.name || 'N/A' })}
        confirmText={t('yesDelete')}
        cancelText={t('cancel')}
        type="danger"
        isLoading={isDeleting}
      />
    </PageTransition>
  );
}


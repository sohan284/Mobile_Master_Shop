'use client';

import React, { useEffect, useState } from 'react';
import PageTransition from '@/components/animations/PageTransition';
import DataTable from '@/components/ui/DataTable';
import { apiFetcher } from '@/lib/api';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await apiFetcher.get('/auth/users');
        if (!isMounted) return;
        // Some APIs wrap data; support both array and {results: []}
        const list = Array.isArray(data) ? data : (data?.results || []);
        setUsers(list);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          (error?.response?.status === 404 ? 'Users endpoint not found' : '') ||
          (error?.response?.status === 403 ? 'You do not have permission to view users' : '') ||
          (error?.response?.status === 401 ? 'Session expired. Please log in again.' : '') ||
          (error?.message?.toLowerCase().includes('network') ? 'Network error. Check your connection.' : '') ||
          'Failed to load users.';
        toast.error(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => { isMounted = false; };
  }, []);

  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Username', accessor: 'username', sortable: true },
    { header: 'Email', accessor: 'email', sortable: true },
    { header: 'Role', accessor: 'role', sortable: true },
    { header: 'Status', accessor: 'is_active', render: (u) => (u?.is_active ? 'Active' : 'Inactive'), sortable: true },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">List of registered users</p>
        </div>

        <DataTable 
          title="Users"
          data={users}
          columns={columns}
          loading={loading}
          onAdd={undefined}
          onEdit={undefined}
          onDelete={undefined}
          onView={undefined}
        />
      </div>
    </PageTransition>
  );
}



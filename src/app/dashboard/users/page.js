'use client';

import React from 'react';
import PageTransition from '@/components/animations/PageTransition';
import DataTable from '@/components/ui/DataTable';
import { apiFetcher } from '@/lib/api';
import { useApiGet } from '@/hooks/useApi';

export default function UsersPage() {
  const { data: usersData, isLoading: loading, error } = useApiGet(
    ['users'],
    () => apiFetcher.get('/auth/user-list/')
  );

  // Extract users from response - support both array and {results: []}
  const users = usersData?.users || [];

  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Username', accessor: 'username', sortable: true },
    { header: 'Email', accessor: 'email', sortable: true },
    { header: 'Role', accessor: 'role', sortable: true , render: (user) => (
      <div className={user.role === 'admin' ? 'text-green-500 capitalize' : 'text-gray-500 capitalize'}>
        {user.role || 'User'}
      </div>
    ) },
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



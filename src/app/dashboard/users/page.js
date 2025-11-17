'use client';

import React from 'react';
import PageTransition from '@/components/animations/PageTransition';
import DataTable from '@/components/ui/DataTable';
import { apiFetcher } from '@/lib/api';
import { useApiGet } from '@/hooks/useApi';
import { useTranslations } from 'next-intl';

export default function UsersPage() {
  const t = useTranslations('dashboard.users');
  const { data: usersData, isLoading: loading, error } = useApiGet(
    ['users'],
    () => apiFetcher.get('/auth/user-list/')
  );

  // Extract users from response - support both array and {results: []}
  const users = usersData?.users || [];

  const columns = [
    { header: t('id'), accessor: 'id', sortable: true },
    { header: t('username'), accessor: 'username', sortable: true },
    { header: t('email'), accessor: 'email', sortable: true },
    { header: t('role'), accessor: 'role', sortable: true , render: (user) => (
      <div className={user.role === 'admin' ? 'text-green-500 capitalize' : 'text-gray-500 capitalize'}>
        {user.role || t('user')}
      </div>
    ) },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <DataTable 
          title={t('tableTitle')}
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



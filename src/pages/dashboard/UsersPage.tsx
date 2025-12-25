import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { User, UserRole } from '@/types';

// Mock data
const mockUsers: User[] = [
  { id: '1', email: 'admin@library.com', role: 'ADMIN', name: 'Admin User' },
  { id: '2', email: 'manager@library.com', role: 'RESPONSABLE', name: 'Library Manager' },
  { id: '3', email: 'john.doe@email.com', role: 'CLIENT', name: 'John Doe' },
  { id: '4', email: 'jane.smith@email.com', role: 'CLIENT', name: 'Jane Smith' },
  { id: '5', email: 'bob.wilson@email.com', role: 'CLIENT', name: 'Bob Wilson' },
  { id: '6', email: 'assistant@library.com', role: 'RESPONSABLE', name: 'Library Assistant' },
];

const getRoleBadgeVariant = (role: UserRole): 'admin' | 'responsable' | 'client' => {
  switch (role) {
    case 'ADMIN':
      return 'admin';
    case 'RESPONSABLE':
      return 'responsable';
    case 'CLIENT':
      return 'client';
    default:
      return 'client';
  }
};

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold uppercase text-primary">
            {user.name?.charAt(0) || user.email.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{user.name || 'Unknown'}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: 'ID',
      render: (user: User) => (
        <span className="text-sm text-muted-foreground">{user.id}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="View all registered library users"
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        emptyMessage="No users found"
      />
    </div>
  );
}

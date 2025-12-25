import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/common/StatCard';
import { BookOpen, Users, ClipboardList, FolderOpen, Clock, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Admin Overview</h2>
        <p className="text-muted-foreground">Manage books, categories, and users</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Books"
          value="1,247"
          icon={<BookOpen className="h-6 w-6" />}
          description="In library collection"
        />
        <StatCard
          title="Categories"
          value="24"
          icon={<FolderOpen className="h-6 w-6" />}
          description="Active categories"
        />
        <StatCard
          title="Total Users"
          value="856"
          icon={<Users className="h-6 w-6" />}
          description="Registered members"
        />
        <StatCard
          title="Active Emprunts"
          value="142"
          icon={<ClipboardList className="h-6 w-6" />}
          description="Books currently borrowed"
        />
      </div>
    </div>
  );

  const renderResponsableDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Responsable Overview</h2>
        <p className="text-muted-foreground">Manage book loans and returns</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Validation"
          value="12"
          icon={<Clock className="h-6 w-6" />}
          description="Awaiting approval"
        />
        <StatCard
          title="Active Emprunts"
          value="142"
          icon={<ClipboardList className="h-6 w-6" />}
          description="Books currently out"
        />
        <StatCard
          title="Late Returns"
          value="8"
          icon={<AlertTriangle className="h-6 w-6" />}
          description="Overdue books"
          className="border-destructive/20"
        />
        <StatCard
          title="Today's Returns"
          value="5"
          icon={<BookOpen className="h-6 w-6" />}
          description="Expected today"
        />
      </div>
    </div>
  );

  const renderClientDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Welcome to the Library</h2>
        <p className="text-muted-foreground">Browse books and manage your borrows</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Available Books"
          value="1,105"
          icon={<BookOpen className="h-6 w-6" />}
          description="Ready to borrow"
        />
        <StatCard
          title="My Active Borrows"
          value="3"
          icon={<ClipboardList className="h-6 w-6" />}
          description="Currently borrowed"
        />
        <StatCard
          title="Due Soon"
          value="1"
          icon={<Clock className="h-6 w-6" />}
          description="Return within 3 days"
        />
        <StatCard
          title="Total Borrowed"
          value="47"
          icon={<FolderOpen className="h-6 w-6" />}
          description="All time"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {user?.role === 'ADMIN' && renderAdminDashboard()}
      {user?.role === 'RESPONSABLE' && renderResponsableDashboard()}
      {user?.role === 'CLIENT' && renderClientDashboard()}
    </div>
  );
}

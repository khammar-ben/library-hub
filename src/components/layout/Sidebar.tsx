import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Users,
  FolderOpen,
  ClipboardList,
  LayoutDashboard,
  Library,
  ChevronLeft,
  BookMarked,
} from 'lucide-react';
import type { UserRole } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    roles: ['ADMIN', 'RESPONSABLE', 'CLIENT'],
  },
  {
    label: 'Books',
    icon: BookOpen,
    href: '/dashboard/books',
    roles: ['ADMIN', 'CLIENT'],
  },
  {
    label: 'Categories',
    icon: FolderOpen,
    href: '/dashboard/categories',
    roles: ['ADMIN'],
  },
  {
    label: 'Users',
    icon: Users,
    href: '/dashboard/users',
    roles: ['ADMIN'],
  },
  {
    label: 'All Emprunts',
    icon: ClipboardList,
    href: '/dashboard/emprunts',
    roles: ['RESPONSABLE'],
  },
  {
    label: 'My Emprunts',
    icon: BookMarked,
    href: '/dashboard/my-emprunts',
    roles: ['CLIENT'],
  },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Library className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {isOpen && (
            <span className="text-lg font-semibold tracking-tight">
              LibraryMS
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className={cn(
            'rounded-lg p-2 transition-all hover:bg-sidebar-accent',
            !isOpen && 'rotate-180'
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User info */}
      {isOpen && user && (
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold uppercase">
              {user.email.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user.email}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {user.role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

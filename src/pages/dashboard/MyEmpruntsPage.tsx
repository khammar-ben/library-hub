import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw } from 'lucide-react';
import type { Emprunt, EmpruntStatus } from '@/types';
import { format, differenceInDays } from 'date-fns';

// Mock data for current client
const mockMyEmprunts: Emprunt[] = [
  {
    id: '1',
    borrower: { id: '3', email: 'client@library.com', role: 'CLIENT', name: 'Client User' },
    book: { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: '', quantity: 5, category: { id: '1', name: 'Fiction' } },
    borrowDate: '2024-01-10',
    returnDate: null,
    status: 'EN_RETARD',
  },
  {
    id: '4',
    borrower: { id: '3', email: 'client@library.com', role: 'CLIENT', name: 'Client User' },
    book: { id: '4', title: 'Clean Code', author: 'Robert C. Martin', description: '', quantity: 4, category: { id: '4', name: 'Technology' } },
    borrowDate: '2024-01-15',
    returnDate: null,
    status: 'EN_COURS',
  },
  {
    id: '5',
    borrower: { id: '3', email: 'client@library.com', role: 'CLIENT', name: 'Client User' },
    book: { id: '2', title: 'A Brief History of Time', author: 'Stephen Hawking', description: '', quantity: 3, category: { id: '2', name: 'Science' } },
    borrowDate: '2024-01-01',
    returnDate: '2024-01-10',
    status: 'RETOURNE',
  },
];

const getStatusBadgeVariant = (status: EmpruntStatus): 'enCours' | 'retourne' | 'enRetard' => {
  switch (status) {
    case 'EN_COURS':
      return 'enCours';
    case 'RETOURNE':
      return 'retourne';
    case 'EN_RETARD':
      return 'enRetard';
    default:
      return 'enCours';
  }
};

const getStatusLabel = (status: EmpruntStatus): string => {
  switch (status) {
    case 'EN_COURS':
      return 'In Progress';
    case 'RETOURNE':
      return 'Returned';
    case 'EN_RETARD':
      return 'Late';
    default:
      return status;
  }
};

export default function MyEmpruntsPage() {
  const [emprunts, setEmprunts] = useState<Emprunt[]>(mockMyEmprunts);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReturn = async (empruntId: string) => {
    setIsLoading(empruntId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEmprunts(emprunts.map((e) =>
        e.id === empruntId
          ? { ...e, status: 'RETOURNE' as EmpruntStatus, returnDate: new Date().toISOString() }
          : e
      ));
      toast({ title: 'Book returned successfully' });
    } catch {
      toast({ title: 'An error occurred', variant: 'destructive' });
    } finally {
      setIsLoading(null);
    }
  };

  const columns = [
    {
      key: 'book',
      header: 'Book',
      render: (emprunt: Emprunt) => (
        <div>
          <p className="font-medium">{emprunt.book.title}</p>
          <p className="text-sm text-muted-foreground">{emprunt.book.author}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (emprunt: Emprunt) => (
        <Badge variant="secondary">{emprunt.book.category.name}</Badge>
      ),
    },
    {
      key: 'borrowDate',
      header: 'Borrow Date',
      render: (emprunt: Emprunt) => (
        <span>{format(new Date(emprunt.borrowDate), 'MMM dd, yyyy')}</span>
      ),
    },
    {
      key: 'returnDate',
      header: 'Return Date',
      render: (emprunt: Emprunt) => (
        <span>
          {emprunt.returnDate
            ? format(new Date(emprunt.returnDate), 'MMM dd, yyyy')
            : '—'}
        </span>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (emprunt: Emprunt) => {
        const endDate = emprunt.returnDate ? new Date(emprunt.returnDate) : new Date();
        const days = differenceInDays(endDate, new Date(emprunt.borrowDate));
        return <span>{days} days</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (emprunt: Emprunt) => (
        <Badge variant={getStatusBadgeVariant(emprunt.status)}>
          {getStatusLabel(emprunt.status)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (emprunt: Emprunt) => (
        <div className="flex justify-end">
          {emprunt.status !== 'RETOURNE' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleReturn(emprunt.id)}
              disabled={isLoading === emprunt.id}
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              Return Book
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Emprunts"
        description="View and manage your borrowed books"
      />

      <DataTable
        columns={columns}
        data={emprunts}
        emptyMessage="You haven't borrowed any books yet"
        rowClassName={(emprunt) =>
          emprunt.status === 'EN_RETARD' ? 'bg-destructive/5' : ''
        }
      />
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { Search, BookOpen, User2 } from 'lucide-react';
import type { Book, Category } from '@/types';

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Fiction' },
  { id: '2', name: 'Science' },
  { id: '3', name: 'History' },
  { id: '4', name: 'Technology' },
];

const mockBooks: Book[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'A novel about the American dream and the roaring twenties.', quantity: 5, category: mockCategories[0] },
  { id: '2', title: 'A Brief History of Time', author: 'Stephen Hawking', description: 'Exploring the universe from the Big Bang to black holes.', quantity: 3, category: mockCategories[1] },
  { id: '3', title: 'Sapiens', author: 'Yuval Noah Harari', description: 'A brief history of humankind from the Stone Age to the present.', quantity: 7, category: mockCategories[2] },
  { id: '4', title: 'Clean Code', author: 'Robert C. Martin', description: 'A handbook of agile software craftsmanship.', quantity: 4, category: mockCategories[3] },
  { id: '5', title: '1984', author: 'George Orwell', description: 'A dystopian social science fiction novel.', quantity: 6, category: mockCategories[0] },
  { id: '6', title: 'The Selfish Gene', author: 'Richard Dawkins', description: 'A book on evolution centered on the gene.', quantity: 2, category: mockCategories[1] },
];

export default function ClientBooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [borrowingBook, setBorrowingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || book.category.id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleBorrow = async () => {
    if (!borrowingBook) return;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setBooks(books.map((b) =>
        b.id === borrowingBook.id ? { ...b, quantity: b.quantity - 1 } : b
      ));
      toast({
        title: 'Book borrowed successfully',
        description: `You have borrowed "${borrowingBook.title}"`,
      });
      setBorrowingBook(null);
    } catch {
      toast({ title: 'An error occurred', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Books"
        description="Find and borrow books from our collection"
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {mockCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No books found</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{book.category.name}</Badge>
                </div>
                <h3 className="mb-1 text-lg font-semibold line-clamp-1">
                  {book.title}
                </h3>
                <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                  <User2 className="h-3 w-3" />
                  <span>{book.author}</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {book.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      book.quantity === 0 ? 'text-destructive' : 'text-success'
                    }`}
                  >
                    {book.quantity > 0 ? `${book.quantity} available` : 'Out of stock'}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setBorrowingBook(book)}
                    disabled={book.quantity === 0}
                  >
                    Borrow
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Borrow Confirmation */}
      <ConfirmDialog
        open={!!borrowingBook}
        onOpenChange={(open) => !open && setBorrowingBook(null)}
        title="Borrow Book"
        description={`Are you sure you want to borrow "${borrowingBook?.title}" by ${borrowingBook?.author}?`}
        confirmLabel="Borrow"
        onConfirm={handleBorrow}
        variant="default"
        isLoading={isLoading}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Search } from 'lucide-react';
import type { Book, Category } from '@/types';

// Mock data for demo
const mockCategories: Category[] = [
  { id: '1', name: 'Fiction' },
  { id: '2', name: 'Science' },
  { id: '3', name: 'History' },
  { id: '4', name: 'Technology' },
];

const mockBooks: Book[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'A novel about the American dream', quantity: 5, category: mockCategories[0] },
  { id: '2', title: 'A Brief History of Time', author: 'Stephen Hawking', description: 'Exploring the universe', quantity: 3, category: mockCategories[1] },
  { id: '3', title: 'Sapiens', author: 'Yuval Noah Harari', description: 'A brief history of humankind', quantity: 7, category: mockCategories[2] },
  { id: '4', title: 'Clean Code', author: 'Robert C. Martin', description: 'A handbook of agile software craftsmanship', quantity: 4, category: mockCategories[3] },
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [categories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    quantity: 1,
    categoryId: '',
  });

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        description: editingBook.description,
        quantity: editingBook.quantity,
        categoryId: editingBook.category.id,
      });
    } else {
      setFormData({
        title: '',
        author: '',
        description: '',
        quantity: 1,
        categoryId: '',
      });
    }
  }, [editingBook]);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const category = categories.find((c) => c.id === formData.categoryId);
      
      if (editingBook) {
        setBooks(books.map((b) =>
          b.id === editingBook.id
            ? { ...b, ...formData, category: category! }
            : b
        ));
        toast({ title: 'Book updated successfully' });
      } else {
        const newBook: Book = {
          id: Date.now().toString(),
          ...formData,
          category: category!,
        };
        setBooks([...books, newBook]);
        toast({ title: 'Book added successfully' });
      }
      
      setIsDialogOpen(false);
      setEditingBook(null);
    } catch {
      toast({ title: 'An error occurred', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBook) return;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setBooks(books.filter((b) => b.id !== deletingBook.id));
      toast({ title: 'Book deleted successfully' });
      setIsDeleteDialogOpen(false);
      setDeletingBook(null);
    } catch {
      toast({ title: 'An error occurred', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (book: Book) => (
        <div>
          <p className="font-medium">{book.title}</p>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (book: Book) => (
        <Badge variant="secondary">{book.category.name}</Badge>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (book: Book) => (
        <span className={book.quantity === 0 ? 'text-destructive' : ''}>
          {book.quantity}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (book: Book) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditingBook(book);
              setIsDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setDeletingBook(book);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Books"
        description="Manage your library's book collection"
        action={{
          label: 'Add Book',
          onClick: () => {
            setEditingBook(null);
            setIsDialogOpen(true);
          },
        }}
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredBooks}
        emptyMessage="No books found"
      />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : editingBook ? 'Update' : 'Add'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Book"
        description={`Are you sure you want to delete "${deletingBook?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}

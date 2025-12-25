import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/common/DataTable';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2 } from 'lucide-react';
import type { Category } from '@/types';

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Fiction' },
  { id: '2', name: 'Science' },
  { id: '3', name: 'History' },
  { id: '4', name: 'Technology' },
  { id: '5', name: 'Biography' },
  { id: '6', name: 'Philosophy' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName('');
    }
  }, [editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (editingCategory) {
        setCategories(categories.map((c) =>
          c.id === editingCategory.id ? { ...c, name } : c
        ));
        toast({ title: 'Category updated successfully' });
      } else {
        const newCategory: Category = {
          id: Date.now().toString(),
          name,
        };
        setCategories([...categories, newCategory]);
        toast({ title: 'Category added successfully' });
      }
      
      setIsDialogOpen(false);
      setEditingCategory(null);
    } catch {
      toast({ title: 'An error occurred', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCategories(categories.filter((c) => c.id !== deletingCategory.id));
      toast({ title: 'Category deleted successfully' });
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
    } catch {
      toast({ title: 'An error occurred', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Category Name',
      render: (category: Category) => (
        <span className="font-medium">{category.name}</span>
      ),
    },
    {
      key: 'id',
      header: 'ID',
      render: (category: Category) => (
        <span className="text-sm text-muted-foreground">{category.id}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (category: Category) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditingCategory(category);
              setIsDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setDeletingCategory(category);
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
        title="Categories"
        description="Organize books by categories"
        action={{
          label: 'Add Category',
          onClick: () => {
            setEditingCategory(null);
            setIsDialogOpen(true);
          },
        }}
      />

      <DataTable
        columns={columns}
        data={categories}
        emptyMessage="No categories found"
      />

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                required
              />
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
                {isLoading ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? This may affect books assigned to this category.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, Loader } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"

import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import InfoCard from '@/components/common/InfoCard';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getQuizCategories, deleteQuizCategory, QuizCategory } from '@/services/quizCategory.service';
import QuizCategoryFormModal from './QuizCategoryFormModal';

const QuizCategoryList = () => {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<QuizCategory | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast()

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getQuizCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch quiz categories");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem fetching quiz categories.",
      })
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Stats calculation
  const totalCategories = categories.length;
  const activeCategories = categories.filter(category => category.status === 'active').length;
  const inactiveCategories = categories.filter(category => category.status === 'inactive').length;

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: QuizCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete === null) {
      return;
    }
    try {
      await deleteQuizCategory(categoryToDelete);
      setCategories(categories.filter(cat => cat._id !== categoryToDelete));
      toast({
        title: "Success",
        description: "Quiz category deleted successfully.",
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete quiz category.",
      })
    } finally {
      setIsConfirmDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleFormSubmit = async () => {
    await fetchCategories();
  };

  return (
    <Layout>
      <PageHeader
        title="Quiz Category Management"
        subtitle="Create and manage your quiz categories"
        icon={Tag}
        action={
          <Button onClick={handleAddCategory} className="bg-admin-primary hover:bg-admin-secondary">
            <Plus size={16} className="mr-2" /> Create Category
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <InfoCard
          title="Total Categories"
          value={totalCategories}
          icon={Tag}
          color="blue"
        />
        <InfoCard
          title="Active Categories"
          value={activeCategories}
          icon={Tag}
          color="green"
        />
        <InfoCard
          title="Inactive Categories"
          value={inactiveCategories}
          icon={Tag}
          color="red"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="mr-2"
                  >
                    <Edit size={16} className="mr-2" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePrompt(category._id)}
                  >
                    <Trash2 size={16} className="mr-2" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Quiz Category Form Modal */}
      <QuizCategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFormSubmit}
        initialData={editingCategory}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
      isOpen={isConfirmDialogOpen}
      onClose={() => setIsConfirmDialogOpen(false)}
      onConfirm={handleDeleteConfirm}
      title="Delete Quiz Category"
      description="Are you sure you want to delete this quiz category? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
    />
    </Layout>
  );
};

export default QuizCategoryList;

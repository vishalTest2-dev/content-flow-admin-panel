
import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import InfoCard from '@/components/common/InfoCard';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import QuizCategoryFormModal from './QuizCategoryFormModal';

// Mock quiz category data
const initialCategories = [
  {
    id: 1,
    name: "Geography",
    icon: "/placeholder.svg",
    description: "Questions about countries, capitals, and geography",
    quizCount: 12,
    status: "active"
  },
  {
    id: 2,
    name: "Science",
    icon: "/placeholder.svg",
    description: "Questions about physics, chemistry, and biology",
    quizCount: 8,
    status: "active"
  },
  {
    id: 3,
    name: "History",
    icon: "/placeholder.svg",
    description: "Questions about historical events and figures",
    quizCount: 5,
    status: "inactive"
  }
];

const QuizCategoryList = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Stats calculation
  const totalCategories = categories.length;
  const activeCategories = categories.filter(category => category.status === 'active').length;
  const inactiveCategories = categories.filter(category => category.status === 'inactive').length;

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (id: number) => {
    setCategoryToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(category => category.id !== categoryToDelete));
    }
    setIsConfirmDialogOpen(false);
  };

  const handleFormSubmit = (categoryData: any) => {
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === editingCategory.id ? { ...category, ...categoryData } : category
      ));
    } else {
      // Add new category
      const newCategory = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        quizCount: 0, // New categories start with 0 quizzes
        ...categoryData
      };
      setCategories([...categories, newCategory]);
    }
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <PageHeader 
        title="Quiz Category Management" 
        subtitle="Create and manage your quiz categories" 
        icon={Tag}
        action={
          <Button onClick={handleAddCategory} className="bg-admin-primary hover:bg-admin-secondary">
            <Plus size={16} className="mr-1" /> Create Category
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard
          title="Total Categories"
          value={totalCategories}
          icon={Tag}
          color="#3b82f6" // Blue
        />
        <InfoCard
          title="Active Categories"
          value={activeCategories}
          icon={Tag}
          color="#22c55e" // Green
        />
        <InfoCard
          title="Inactive Categories"
          value={inactiveCategories}
          icon={Tag}
          color="#ef4444" // Red
        />
      </div>

      {/* Quiz Category Table */}
      <div className="admin-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="admin-table-header">
              <tr>
                <th className="admin-table-cell text-left font-semibold">Category Name</th>
                <th className="admin-table-cell text-left font-semibold">Category Icon</th>
                <th className="admin-table-cell text-left font-semibold">No. of Quizzes</th>
                <th className="admin-table-cell text-left font-semibold">Description</th>
                <th className="admin-table-cell text-left font-semibold">Status</th>
                <th className="admin-table-cell text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="admin-table-row">
                  <td className="admin-table-cell">{category.name}</td>
                  <td className="admin-table-cell">
                    <img 
                      src={category.icon} 
                      alt={category.name} 
                      className="w-10 h-10 object-cover rounded-md"
                    />
                  </td>
                  <td className="admin-table-cell">{category.quizCount}</td>
                  <td className="admin-table-cell max-w-xs truncate">{category.description}</td>
                  <td className="admin-table-cell">
                    <StatusBadge status={category.status} />
                  </td>
                  <td className="admin-table-cell text-right">
                    <div className="admin-table-actions justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditCategory(category)}
                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeletePrompt(category.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-table-cell text-center py-8 text-gray-500">
                    No categories found. Click "Create Category" to add your first category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz Category Form Modal */}
      <QuizCategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCategory}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Layout>
  );
};

export default QuizCategoryList;

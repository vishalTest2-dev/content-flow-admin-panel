
import React, { useState, useEffect } from 'react';
import { Folder, Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import InfoCard from '@/components/common/InfoCard';
import StatusBadge from '@/components/common/StatusBadge';
import {
  getPostCategories,
  deletePostCategory,
} from '@/services/postCategory.service'; // Import API functions
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import BlogCategoryFormModal from './BlogCategoryFormModal';

// Mock blog category data
const initialCategories = [
  {
    id: 1,
    name: "React",
    icon: "/placeholder.svg",
    description: "Articles about React and its ecosystem",
    status: "active"
  },
  {
    id: 2,
    name: "JavaScript",
    icon: "/placeholder.svg",
    description: "Articles about JavaScript language and features",
    status: "active"
  },
  {
    id: 3,
    name: "CSS",
    icon: "/placeholder.svg",
    description: "Articles about CSS styling and design",
    status: "inactive"
  }
];

const BlogCategoryList = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Stats calculation
  const totalCategories = categories.length;
  const activeCategories = categories.filter(category => category.status === 'active').length;
  const inactiveCategories = categories.filter(category => category.status === 'inactive').length;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPostCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };
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

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await deletePostCategory(categoryToDelete);
        fetchCategories(); // Refresh the category list
      } catch (err: any) {
        // Handle deletion error (e.g., display an error message)
        console.error('Error deleting category:', err.message);
      }
    }
    setIsConfirmDialogOpen(false);
  };

  const handleFormSubmit = async () => {
    setIsModalOpen(false); // Close modal regardless of success/failure
    fetchCategories(); // Refresh categories after submission
  };

  if (loading) {
    return <Layout>Loading categories...</Layout>;
  }

  return (
    <Layout>
      <PageHeader 
        title="Post Category Management" 
        subtitle="Create and manage your post categories" 
        icon={Folder}
        action={
          <Button onClick={handleAddCategory} className="bg-admin-primary hover:bg-admin-secondary">
            <Plus size={16} className="mr-1" /> Add New Category
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard
          title="Total Categories"
          value={totalCategories}
          icon={Folder}
          color="#3b82f6" // Blue
        />
        <InfoCard
          title="Active Categories"
          value={activeCategories}
          icon={Folder}
          color="#22c55e" // Green
        />
        <InfoCard
          title="Inactive Categories"
          value={inactiveCategories}
          icon={Folder}
          color="#ef4444" // Red
        />
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {/* Post Category Table */}
      <div className="admin-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="admin-table-header">
              <tr>
                <th className="admin-table-cell text-left font-semibold">Category Name</th>
                <th className="admin-table-cell text-left font-semibold">Category Icon</th>
                <th className="admin-table-cell text-left font-semibold">Description</th>
                <th className="admin-table-cell text-left font-semibold">Status</th>
                <th className="admin-table-cell text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((category) => (
                <tr key={category.id} className="admin-table-row">
                  <td className="admin-table-cell">{category.name}</td>
                  <td className="admin-table-cell">
                    <img 
                      src={category.icon} 
                      alt={category.name} 
                      className="w-10 h-10 object-cover rounded-md"
                    />
                  </td>
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
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
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
              {categories?.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-table-cell text-center py-8 text-gray-500">
                    No categories found. Click "Add New Category" to create your first category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blog Category Form Modal */}
      <BlogCategoryFormModal
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
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Layout>
  );
};

export default BlogCategoryList;

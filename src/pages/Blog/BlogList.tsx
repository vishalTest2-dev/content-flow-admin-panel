
import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import InfoCard from '@/components/common/InfoCard';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import BlogFormModal from './BlogFormModal';
import { formatDate } from '@/lib/utils';

// Mock blog data
const initialBlogs = [
  {
    id: 1,
    title: "Introduction to React Hooks",
    shortDescription: "Learn the basics of React Hooks and how to use them in your projects.",
    image: "/placeholder.svg",
    category: "React",
    rating: 4.5,
    status: "active",
    createdAt: "2024-04-01T00:00:00Z"
  },
  {
    id: 2,
    title: "Advanced CSS Techniques",
    shortDescription: "Discover advanced CSS techniques to create stunning web designs.",
    image: "/placeholder.svg",
    category: "CSS",
    rating: 4,
    status: "active",
    createdAt: "2024-03-25T00:00:00Z"
  },
  {
    id: 3,
    title: "Getting Started with TypeScript",
    shortDescription: "A beginner's guide to TypeScript and its benefits.",
    image: "/placeholder.svg",
    category: "TypeScript",
    rating: 5,
    status: "draft",
    createdAt: "2024-03-15T00:00:00Z"
  }
];

const BlogList = () => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

  // Stats calculation
  const totalBlogs = blogs.length;
  const liveBlogs = blogs.filter(blog => blog.status === 'active').length;
  const draftBlogs = blogs.filter(blog => blog.status === 'draft').length;

  const handleAddBlog = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (id: number) => {
    setBlogToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (blogToDelete) {
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete));
    }
    setIsConfirmDialogOpen(false);
  };

  const handleFormSubmit = (blogData: any) => {
    if (editingBlog) {
      // Update existing blog
      setBlogs(blogs.map(blog => 
        blog.id === editingBlog.id ? { ...blog, ...blogData } : blog
      ));
    } else {
      // Add new blog
      const newBlog = {
        id: Math.max(...blogs.map(b => b.id), 0) + 1,
        createdAt: new Date().toISOString(),
        ...blogData
      };
      setBlogs([...blogs, newBlog]);
    }
    setIsModalOpen(false);
  };

  // Function to render rating stars
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="text-yellow-400" size={16} />
          <Star className="absolute top-0 left-0 fill-yellow-400 text-yellow-400" size={16} style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={16} />);
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <Layout>
      <PageHeader 
        title="Blog Management" 
        subtitle="Create and manage your blog posts" 
        icon={BookOpen}
        action={
          <Button onClick={handleAddBlog} className="bg-admin-primary hover:bg-admin-secondary">
            <Plus size={16} className="mr-1" /> Add New Blog
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard
          title="Total Blogs"
          value={totalBlogs}
          icon={BookOpen}
          color="#3b82f6" // Blue
        />
        <InfoCard
          title="Live Blogs"
          value={liveBlogs}
          icon={BookOpen}
          color="#22c55e" // Green
        />
        <InfoCard
          title="Draft Blogs"
          value={draftBlogs}
          icon={BookOpen}
          color="#f59e0b" // Yellow/Orange
        />
      </div>

      {/* Blog Table */}
      <div className="admin-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="admin-table-header">
              <tr>
                <th className="admin-table-cell text-left font-semibold">Date Created</th>
                <th className="admin-table-cell text-left font-semibold">Blog Image</th>
                <th className="admin-table-cell text-left font-semibold">Blog Title</th>
                <th className="admin-table-cell text-left font-semibold">Category</th>
                <th className="admin-table-cell text-left font-semibold">Rating</th>
                <th className="admin-table-cell text-left font-semibold">Status</th>
                <th className="admin-table-cell text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="admin-table-row">
                  <td className="admin-table-cell">{formatDate(blog.createdAt)}</td>
                  <td className="admin-table-cell">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-16 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="admin-table-cell">{blog.title}</td>
                  <td className="admin-table-cell">{blog.category}</td>
                  <td className="admin-table-cell">{renderRating(blog.rating)}</td>
                  <td className="admin-table-cell">
                    <StatusBadge status={blog.status} />
                  </td>
                  <td className="admin-table-cell text-right">
                    <div className="admin-table-actions justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditBlog(blog)}
                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeletePrompt(blog.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-table-cell text-center py-8 text-gray-500">
                    No blogs found. Click "Add New Blog" to create your first blog post.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blog Form Modal */}
      <BlogFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingBlog}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Layout>
  );
};

export default BlogList;

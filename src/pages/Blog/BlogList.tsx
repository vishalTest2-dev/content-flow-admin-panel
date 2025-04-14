
import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import InfoCard from '@/components/common/InfoCard';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import BlogFormModal from "@/pages/Blog/BlogFormModal";
import { formatDate } from '@/lib/utils';

// Mock blog data
const initialBlogs = [
  {
    id: 1,
    title: "Introduction to React Hooks",
    shortDescription: "Learn the basics of React Hooks and how to use them in your projects.",
    image: "/placeholder.svg",
    category: "React",
    status: "active",
    createdAt: "2024-04-01T00:00:00Z"
  },
  {
    id: 2,
    title: "Advanced CSS Techniques",
    shortDescription: "Discover advanced CSS techniques to create stunning web designs.",
    image: "/placeholder.svg",
    category: "CSS",
    status: "active",
    createdAt: "2024-03-25T00:00:00Z"
  },
  {
    id: 3,
    title: "Getting Started with TypeScript",
    shortDescription: "A beginner's guide to TypeScript and its benefits.",
    image: "/placeholder.svg",
    category: "TypeScript",
    status: "draft",
    createdAt: "2024-03-15T00:00:00Z"
  }
];

import { getPosts, deletePost } from "@/services/post.service"; // Adjust import path as needed

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Stats calculation
  const totalPosts = posts.length;
  const livePosts = posts.filter(post => post.status === 'published').length; // Assuming 'published' is the live status
  const draftPosts = posts.filter(post => post.status === 'draft').length;

  const handleCreatePost = () => {
    setEditingPost(null);
    setIsFormModalOpen(true);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setIsFormModalOpen(true);
  };

  const handleDeletePost = (post: any) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePost = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete._id);
        setPosts(posts.filter(post => post._id !== postToDelete._id));
      } catch (err: any) {
        // Handle error, e.g., show a toast
        console.error("Error deleting post:", err);
      }
      setPostToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingPost(null);
    fetchPosts();
  };

  return (
    <Layout>
      <PageHeader
        title="Post Management"
        subtitle="Create and manage your posts"
        icon={FileText}
        action={
          <Button onClick={handleCreatePost} className="bg-admin-primary hover:bg-admin-secondary">
            <Plus size={16} className="mr-1" /> Add New Post
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard title="Total Posts" value={totalPosts} icon={FileText} color="#3b82f6" />
        <InfoCard title="Live Posts" value={livePosts} icon={FileText} color="#22c55e" />
        <InfoCard title="Draft Posts" value={draftPosts} icon={FileText} color="#f59e0b" />
      </div>

      {isLoading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category ? post.category.name : "Uncategorized"}</TableCell>
                <TableCell>
                  <StatusBadge status={post.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPost(post)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePost(post)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <BlogFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        post={editingPost}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Layout>
  )
};

export default BlogList;

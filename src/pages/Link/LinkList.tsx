
import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from '@/lib/utils';
import LinkFormModal from './LinkFormModal';
import { getLinks, deleteLink } from '@/services/api'; // Assuming you have these API functions

interface Link {
  _id: string;
  title: string;
  url: string;
  order: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

const LinkList = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getLinks();
      // Ensure the response contains data before setting the state
      if (response && Array.isArray(response)) {
        setLinks(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setLinks(response.data);
      } else {
        // Handle unexpected response format
        setLinks([]);
        setError('Invalid response format from server');
        console.error('Unexpected API response format:', response);
      }
    } catch (err: any) {
      setLinks([]);
      setError(err.response?.data?.message || 'Failed to fetch links');
      console.error('Error fetching links:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLink = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (id: string) => {
    setLinkToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (linkToDelete) {
      try {
        await deleteLink(linkToDelete);
        setLinks(links.filter(link => link._id !== linkToDelete));
      } catch (err: any) {
        // Handle delete error (e.g., display a toast)
        console.error('Error deleting link:', err);
      } finally {
        setLinkToDelete(null);
        setIsConfirmDialogOpen(false);
      }
    }
  };

  const handleFormSuccess = async () => {
    setIsModalOpen(false);
    await fetchLinks();
  };

  if (isLoading) {
    return <Layout><p>Loading links...</p></Layout>;
  }

  if (error) {
    return <Layout><p>Error: {error}</p></Layout>;
  }

  return (
    <Layout>
      <PageHeader
        title="Link Management"
        subtitle="Create and manage your links"
        icon={LinkIcon}
        action={
          <Button onClick={handleAddLink} className="bg-admin-primary hover:bg-admin-secondary">
            <Plus size={16} className="mr-1" /> Add New Link
          </Button>
        }
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links && links.length > 0 ? (
            links.map((link) => (
              <TableRow key={link._id}>
                <TableCell>{link.title}</TableCell>
                <TableCell><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-admin-primary hover:underline">{link.url}</a></TableCell>
                <TableCell>{link.order}</TableCell>
                <TableCell>{link.category || '-'}</TableCell>
                <TableCell>{formatDate(link.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditLink(link)}
                      className="text-amber-600 border-amber-200 hover:bg-amber-50"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePrompt(link._id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">No links found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <LinkFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFormSuccess}
        initialData={editingLink || undefined}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Link"
        description="Are you sure you want to delete this link? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Layout>
  );
};

export default LinkList;

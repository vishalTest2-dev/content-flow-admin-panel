
import React, { useState } from 'react';
import { Link as LinkIcon, Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import LinkFormModal from './LinkFormModal';
import { formatDate } from '@/lib/utils';

// Mock link data
const initialLinks = [
  {
    id: 1,
    name: "Quiz App Welcome",
    url: "https://example.com/quiz-welcome",
    createdLink: "quizapp.com/welcome",
    status: "active",
    createdAt: "2024-04-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Easter Quiz Special",
    url: "https://example.com/easter-quiz",
    createdLink: "quizapp.com/easter",
    status: "active",
    createdAt: "2024-03-25T00:00:00Z"
  },
  {
    id: 3,
    name: "Science Quiz Promotion",
    url: "https://example.com/science-quiz",
    createdLink: "quizapp.com/science",
    status: "inactive",
    createdAt: "2024-03-15T00:00:00Z"
  }
];

const LinkList = () => {
  const [links, setLinks] = useState(initialLinks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<number | null>(null);

  const handleAddLink = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleEditLink = (link: any) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (id: number) => {
    setLinkToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (linkToDelete) {
      setLinks(links.filter(link => link.id !== linkToDelete));
    }
    setIsConfirmDialogOpen(false);
  };

  const handleFormSubmit = (linkData: any) => {
    if (editingLink) {
      // Update existing link
      setLinks(links.map(link => 
        link.id === editingLink.id ? { ...link, ...linkData } : link
      ));
    } else {
      // Add new link
      const newLink = {
        id: Math.max(...links.map(l => l.id), 0) + 1,
        createdAt: new Date().toISOString(),
        ...linkData
      };
      setLinks([...links, newLink]);
    }
    setIsModalOpen(false);
  };

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

      {/* Link Table */}
      <div className="admin-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="admin-table-header">
              <tr>
                <th className="admin-table-cell text-left font-semibold">Date</th>
                <th className="admin-table-cell text-left font-semibold">Created Link</th>
                <th className="admin-table-cell text-left font-semibold">Name</th>
                <th className="admin-table-cell text-left font-semibold">URL</th>
                <th className="admin-table-cell text-left font-semibold">Status</th>
                <th className="admin-table-cell text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id} className="admin-table-row">
                  <td className="admin-table-cell">{formatDate(link.createdAt)}</td>
                  <td className="admin-table-cell">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-admin-primary hover:underline"
                    >
                      {link.createdLink}
                    </a>
                  </td>
                  <td className="admin-table-cell">{link.name}</td>
                  <td className="admin-table-cell max-w-xs truncate">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-admin-primary hover:underline"
                    >
                      {link.url}
                    </a>
                  </td>
                  <td className="admin-table-cell">
                    <StatusBadge status={link.status} />
                  </td>
                  <td className="admin-table-cell text-right">
                    <div className="admin-table-actions justify-end">
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
                        onClick={() => handleDeletePrompt(link.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-table-cell text-center py-8 text-gray-500">
                    No links found. Click "Add New Link" to create your first link.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Link Form Modal */}
      <LinkFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingLink}
      />

      {/* Confirm Delete Dialog */}
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


import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import InfoCard from '@/components/common/InfoCard';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import QuizFormModal from './QuizFormModal';
import { getQuizzes, deleteQuiz } from '@/services/quiz.service';
import { Quiz } from '@/services/quiz.service';
// Mock quiz data
const initialQuizzes = [
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
    category: "Geography",
    status: "active"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    answer: "Mars",
    category: "Space",
    status: "active"
  },
  {
    id: 3,
    question: "What is the largest mammal?",
    answer: "Blue Whale",
    category: "Animals",
    status: "inactive"
  },
  {
    id: 4,
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
    category: "Literature",
    status: "active"
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    answer: "Au",
    category: "Chemistry",
    status: "inactive"
  }
];

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const totalQuizzes = quizzes.length;
  const activeQuizzes = quizzes.filter(quiz => quiz.status === 'published').length;
  const inactiveQuizzes = quizzes.filter(quiz => quiz.status === 'draft').length;

  const handleAddQuiz = () => {
    setEditingQuiz(null);
    setIsModalOpen(true);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (id: string) => {
    setQuizToDelete(id);    
    setIsConfirmDialogOpen(true);    
  };

  const handleDeleteConfirm = async () => {
    if (quizToDelete) {
      try {
        await deleteQuiz(quizToDelete);
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizToDelete));
      } catch (err: any) {
        // Consider displaying a toast or error message here.
        console.error("Failed to delete quiz:", err.message);
      }
    }
    setIsConfirmDialogOpen(false);
  };

  return (
    <Layout>
      <PageHeader
        title="Quiz Management"
        subtitle="Create and manage your quizzes"
        icon={ClipboardList}
        action={
          <Button onClick={handleAddQuiz} className="bg-admin-primary hover:bg-admin-secondary">
            <Plus size={16} className="mr-1" /> Create Quiz
          </Button>
        }
      />      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard
          title="Total Quizzes"
          value={totalQuizzes}
          icon={ClipboardList}
          color="#3b82f6" // Blue
        />
        <InfoCard
          title="Active Quizzes"
          value={activeQuizzes}
          icon={ClipboardList}
          color="#22c55e" // Green
        />
        <InfoCard
          title="Inactive Quizzes"
          value={inactiveQuizzes}
          icon={ClipboardList}
          color="#ef4444" // Red
        />
      </div>

      {loading ? (
        <p>Loading quizzes...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="rounded-md border">
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
              {quizzes.map((quiz) => (
                <TableRow key={quiz._id}>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.category?.name || 'Uncategorized'}</TableCell>
                  <TableCell>
                    <StatusBadge status={quiz.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuiz(quiz)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePrompt(quiz._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {quizzes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-4">
                    No quizzes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Quiz Form Modal */}
      <QuizFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingQuiz}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchQuizzes();
          setEditingQuiz(null);
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Quiz"
        description="Are you sure you want to delete this quiz? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Layout>
  );
};

export default QuizList;

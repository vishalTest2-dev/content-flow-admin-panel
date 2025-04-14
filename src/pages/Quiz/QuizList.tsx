
import React, { useState } from 'react';
import { ClipboardList, Plus, Edit, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import InfoCard from '@/components/common/InfoCard';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import QuizFormModal from './QuizFormModal';

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
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);

  // Stats calculation
  const totalQuizzes = quizzes.length;
  const activeQuizzes = quizzes.filter(quiz => quiz.status === 'active').length;
  const inactiveQuizzes = quizzes.filter(quiz => quiz.status === 'inactive').length;

  const handleAddQuiz = () => {
    setEditingQuiz(null);
    setIsModalOpen(true);
  };

  const handleEditQuiz = (quiz: any) => {
    setEditingQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (id: number) => {
    setQuizToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (quizToDelete) {
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizToDelete));
    }
    setIsConfirmDialogOpen(false);
  };

  const handleFormSubmit = (quizData: any) => {
    if (editingQuiz) {
      // Update existing quiz
      setQuizzes(quizzes.map(quiz => 
        quiz.id === editingQuiz.id ? { ...quiz, ...quizData } : quiz
      ));
    } else {
      // Add new quiz
      const newQuiz = {
        id: Math.max(...quizzes.map(q => q.id), 0) + 1,
        ...quizData
      };
      setQuizzes([...quizzes, newQuiz]);
    }
    setIsModalOpen(false);
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

      {/* Quiz Table */}
      <div className="admin-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="admin-table-header">
              <tr>
                <th className="admin-table-cell text-left font-semibold">Question</th>
                <th className="admin-table-cell text-left font-semibold">Answer</th>
                <th className="admin-table-cell text-left font-semibold">Category</th>
                <th className="admin-table-cell text-left font-semibold">Status</th>
                <th className="admin-table-cell text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="admin-table-row">
                  <td className="admin-table-cell">{quiz.question}</td>
                  <td className="admin-table-cell">{quiz.answer}</td>
                  <td className="admin-table-cell">{quiz.category}</td>
                  <td className="admin-table-cell">
                    <StatusBadge status={quiz.status} />
                  </td>
                  <td className="admin-table-cell text-right">
                    <div className="admin-table-actions justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditQuiz(quiz)}
                        className="text-amber-600 border-amber-200 hover:bg-amber-50"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeletePrompt(quiz.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-table-cell text-center py-8 text-gray-500">
                    No quizzes found. Click "Create Quiz" to add your first quiz.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz Form Modal */}
      <QuizFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingQuiz}
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

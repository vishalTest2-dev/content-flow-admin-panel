
import api from './api';

export interface QuizCategory {
  _id: string;
  name: string;
  icon: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface QuizCategoryInput {
  name: string;
  icon?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

// Add explicit export functions for create and update
export const createQuizCategory = async (category: QuizCategoryInput): Promise<QuizCategory> => {
  const response = await api.post('/quiz-categories', category);
  return response.data;
};

export const updateQuizCategory = async (id: string, category: Partial<QuizCategoryInput>): Promise<QuizCategory> => {
  const response = await api.put(`/quiz-categories/${id}`, category);
  return response.data;
};

// Add explicit export for delete function
export const deleteQuizCategory = async (id: string): Promise<void> => {
  await api.delete(`/quiz-categories/${id}`);
};

// Export getQuizCategories to be used in QuizCategoryList.tsx
export const getQuizCategories = async (): Promise<QuizCategory[]> => {
  const response = await api.get('/quiz-categories');
  return response.data;
};

export const getCategoryById = async (id: string): Promise<QuizCategory> => {
  const response = await api.get(`/quiz-categories/${id}`);
  return response.data;
};

const quizCategoryService = {
  getCategories: getQuizCategories,
  getCategoryById,
  createCategory: createQuizCategory,
  updateCategory: updateQuizCategory,
  deleteCategory: deleteQuizCategory,
};

export default quizCategoryService;

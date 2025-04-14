
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
  icon: string;
  description: string;
  status: 'active' | 'inactive';
}

const quizCategoryService = {
  getCategories: async (): Promise<QuizCategory[]> => {
    const response = await api.get('/quiz-categories');
    return response.data;
  },

  getCategoryById: async (id: string): Promise<QuizCategory> => {
    const response = await api.get(`/quiz-categories/${id}`);
    return response.data;
  },

  createCategory: async (category: QuizCategoryInput): Promise<QuizCategory> => {
    const response = await api.post('/quiz-categories', category);
    return response.data;
  },

  updateCategory: async (id: string, category: QuizCategoryInput): Promise<QuizCategory> => {
    const response = await api.put(`/quiz-categories/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/quiz-categories/${id}`);
  },
};

export default quizCategoryService;

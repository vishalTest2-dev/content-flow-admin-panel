
import api from './api';

export interface Quiz {
  _id: string;
  question: string;
  answer: string;
  category: string;
  status: 'active' | 'inactive';
}

export interface QuizInput {
  question: string;
  answer: string;
  category: string;
  status: 'active' | 'inactive';
}

const quizService = {
  getQuizzes: async (): Promise<Quiz[]> => {
    const response = await api.get('/quizzes');
    return response.data;
  },

  getQuizById: async (id: string): Promise<Quiz> => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  createQuiz: async (quiz: QuizInput): Promise<Quiz> => {
    const response = await api.post('/quizzes', quiz);
    return response.data;
  },

  updateQuiz: async (id: string, quiz: QuizInput): Promise<Quiz> => {
    const response = await api.put(`/quizzes/${id}`, quiz);
    return response.data;
  },

  deleteQuiz: async (id: string): Promise<void> => {
    await api.delete(`/quizzes/${id}`);
  },
};

export default quizService;

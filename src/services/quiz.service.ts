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

export interface QuizCategory {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
}

export const getQuizzes = async (): Promise<Quiz[]> => {
  const response = await api.get('/quizzes');
  return response.data;
};

export const getQuizById = async (id: string): Promise<Quiz> => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

export const createQuiz = async (quiz: QuizInput): Promise<Quiz> => {
  const response = await api.post('/quizzes', quiz);
  return response.data;
};

export const updateQuiz = async (id: string, quiz: QuizInput): Promise<Quiz> => {
  const response = await api.put(`/quizzes/${id}`, quiz);
  return response.data;
};

export const deleteQuiz = async (id: string): Promise<void> => {
  await api.delete(`/quizzes/${id}`);
};

export const getQuizCategories = async (): Promise<QuizCategory[]> => {
  const response = await api.get('/quiz-categories');
  return response.data;
};

const quizService = {
  getQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizCategories
};

export default quizService;

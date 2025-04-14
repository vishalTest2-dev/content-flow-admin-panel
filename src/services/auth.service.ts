
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  token: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  photo?: string;
  password?: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  register: async (userData: LoginCredentials & { name: string }): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    const response = await api.put('/auth/profile', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

export default authService;

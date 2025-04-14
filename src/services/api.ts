
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getLinks = async () => {
  const response = await api.get('/links');
  return response.data;
};

const getLink = async (id: string) => {
  const response = await api.get(`/links/${id}`);
  return response.data;
};

const createLink = async (data: any) => {
  const response = await api.post('/links', data);
  return response.data;
};

const updateLink = async (id: string, data: any) => {
  const response = await api.put(`/links/${id}`, data);
  return response.data;
};

const deleteLink = async (id: string) => {
  const response = await api.delete(`/links/${id}`);
  return response.data;
};

const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

const getSetting = async (key: string) => {
  const response = await api.get(`/settings/${key}`);
  return response.data;
};

const createSetting = async (data: any) => {
  const response = await api.post('/settings', data);
  return response.data;
};

const updateSetting = async (key: string, data: any) => {
  const response = await api.put(`/settings/${key}`, data);
  return response.data;
};

const deleteSetting = async (key: string) => {
  const response = await api.delete(`/settings/${key}`);
  return response.data;
};

export {
  api as default,
  getLinks,
  getLink,
  createLink,
  updateLink,
  deleteLink,
  getSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
};

import api from './api';

export interface Link {
  _id: string;
  title: string;
  url: string;
  order: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkCreateData {
  title: string;
  url: string;
  order?: number;
  category?: string;
}

export interface LinkUpdateData {
  title?: string;
  url?: string;
  order?: number;
  category?: string;
}

const linkService = {
  getAll: async (): Promise<Link[]> => {
    const response = await api.get('/links');
    return response.data;
  },

  getById: async (id: string): Promise<Link> => {
    const response = await api.get(`/links/${id}`);
    return response.data;
  },

  create: async (data: LinkCreateData): Promise<Link> => {
    const response = await api.post('/links', data);
    return response.data;
  },

  update: async (id: string, data: LinkUpdateData): Promise<Link> => {
    const response = await api.put(`/links/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/links/${id}`);
  },
};

export default linkService;
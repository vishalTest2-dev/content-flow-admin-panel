
import api from './api';

export interface Setting {
  key: string;
  value: string;
  description?: string;
}

const settingService = {
  getAll: async (): Promise<Setting[]> => {
    const response = await api.get('/settings');
    return response.data;
  },

  getByKey: async (key: string): Promise<Setting> => {
    const response = await api.get(`/settings/${key}`);
    return response.data;
  },

  create: async (setting: Setting): Promise<Setting> => {
    const response = await api.post('/settings', setting);
    return response.data;
  },

  update: async (key: string, setting: Partial<Setting>): Promise<Setting> => {
    const response = await api.put(`/settings/${key}`, setting);
    return response.data;
  },

  delete: async (key: string): Promise<void> => {
    await api.delete(`/settings/${key}`);
  },
};

export default settingService;

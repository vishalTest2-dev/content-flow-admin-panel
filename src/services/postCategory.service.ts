
import api from './api';

export interface PostCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  status: 'active' | 'inactive';
}

export interface PostCategoryInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  status?: 'active' | 'inactive';
}

// Export the function with the name expected in the imports
export const getPostCategories = async (): Promise<PostCategory[]> => {
  const response = await api.get('/post-categories');
  return response.data;
};

export const deletePostCategory = async (id: string): Promise<void> => {
  await api.delete(`/post-categories/${id}`);
};

export const createCategory = async (category: PostCategoryInput): Promise<PostCategory> => {
  const response = await api.post('/post-categories', category);
  return response.data;
};

export const updateCategory = async (id: string, category: Partial<PostCategoryInput>): Promise<PostCategory> => {
  const response = await api.put(`/post-categories/${id}`, category);
  return response.data;
};

const postCategoryService = {
  getCategories: getPostCategories,
  getCategoryById: async (id: string): Promise<PostCategory> => {
    const response = await api.get(`/post-categories/${id}`);
    return response.data;
  },
  createCategory,
  updateCategory,
  deleteCategory: deletePostCategory,
};

export default postCategoryService;

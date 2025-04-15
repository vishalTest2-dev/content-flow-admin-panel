
import api from './api';

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  thumbnail: string;
  category: string;
  status: 'active' | 'inactive';
}

export interface PostInput {
  title: string;
  slug: string;
  content: string;
  shortDescription: string;
  thumbnail: string;
  category: string;
  status: 'active' | 'inactive';
}

// Add explicit named exports for the functions
export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get('/posts');
  return response.data;
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (post: PostInput): Promise<Post> => {
  const response = await api.post('/posts', post);
  return response.data;
};

export const updatePost = async (id: string, post: PostInput): Promise<Post> => {
  const response = await api.put(`/posts/${id}`, post);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await api.delete(`/posts/${id}`);
};

// Create a default export that includes all functions
const postService = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

export default postService;

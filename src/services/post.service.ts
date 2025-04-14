
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

const postService = {
  getPosts: async (): Promise<Post[]> => {
    const response = await api.get('/posts');
    return response.data;
  },

  getPostById: async (id: string): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (post: PostInput): Promise<Post> => {
    const response = await api.post('/posts', post);
    return response.data;
  },

  updatePost: async (id: string, post: PostInput): Promise<Post> => {
    const response = await api.put(`/posts/${id}`, post);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

export default postService;

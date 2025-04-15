
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import RichTextEditor from '@/components/common/RichTextEditor';
import { useToast } from '@/hooks/use-toast';
import { createPost, updatePost, Post } from '@/services/post.service';
import { getPostCategories, PostCategory } from '@/services/postCategory.service';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  categoryId: z.string().min(1, { message: 'Category is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  status: z.enum(['draft', 'published'], { message: 'Status is required' }),
});

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: Post;
  onSuccess?: () => void;
}

const BlogFormModal: React.FC<BlogFormModalProps> = ({ isOpen, onClose, post, onSuccess }) => {
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: post ? {
      title: post.title,
      categoryId: post.category,
      content: post.content,
      status: post.status === 'active' ? 'published' : 'draft',
    } : {
      title: '',
      categoryId: '',
      content: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getPostCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch post categories.',
        });
      }
    };

    fetchCategories();
  }, [toast]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Convert form data to match the API requirements
      const postData = {
        title: data.title,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
        content: data.content,
        shortDescription: data.content.substring(0, 150),
        thumbnail: '/placeholder.svg',
        category: data.categoryId,
        status: data.status === 'published' ? 'active' : 'inactive',
      };

      if (post) {
        await updatePost(post._id, postData);
        toast({
          title: 'Success',
          description: 'Post updated successfully!',
        });
      } else {
        await createPost(postData);
        toast({
          title: 'Success',
          description: 'Post created successfully!',
        });
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Write your post content here..."
                      className="min-h-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" className="bg-admin-primary hover:bg-admin-secondary">
                {post ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogFormModal;

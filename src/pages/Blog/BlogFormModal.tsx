
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
import { Image, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import RichTextEditor from '@/components/common/RichTextEditor';
import { useToast } from '@/hooks/use-toast';
import { Post, PostInput, createPost, updatePost } from '@/services/post.service';
import { getPostCategories, PostCategory } from '@/services/postCategory.service';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  categoryId: z.string().min(1, { message: 'Category is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  shortDescription: z.string().max(250, { message: 'Short description must be less than 250 characters' }),
  thumbnail: z.string().default('/placeholder.svg'),
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
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(post?.thumbnail || null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: post ? {
      title: post.title,
      categoryId: post.category,
      content: post.content,
      shortDescription: post.shortDescription || '',
      thumbnail: post.thumbnail,
      status: post.status === 'active' ? 'published' : 'draft',
    } : {
      title: '',
      categoryId: '',
      content: '',
      shortDescription: '',
      thumbnail: '/placeholder.svg',
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview for display
      const preview = URL.createObjectURL(file);
      setThumbnailPreview(preview);

      // Read file as base64 for submission
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('thumbnail', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Convert form data to match the API requirements
      const postData: PostInput = {
        title: data.title,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
        content: data.content,
        shortDescription: data.shortDescription,
        thumbnail: data.thumbnail,
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of the post (max 250 characters)" 
                      {...field} 
                      className="resize-none h-20"
                      maxLength={250}
                    />
                  </FormControl>
                  <div className="text-xs text-right text-gray-500">
                    {field.value?.length || 0}/250
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Thumbnail</FormLabel>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 border rounded-md flex items-center justify-center bg-gray-50">
                      {thumbnailPreview || field.value ? (
                        <img 
                          src={thumbnailPreview || field.value} 
                          alt="Thumbnail" 
                          className="max-w-full max-h-full object-cover rounded-md"
                        />
                      ) : (
                        <Image className="text-gray-400" size={24} />
                      )}
                    </div>
                    <div>
                      <label 
                        htmlFor="post-thumbnail" 
                        className="cursor-pointer inline-flex items-center rounded-md px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      >
                        <Upload size={16} className="mr-2" />
                        Upload Thumbnail
                        <input
                          id="post-thumbnail"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Recommended: 800x400px JPG/PNG</p>
                    </div>
                  </div>
                  <input type="hidden" {...field} />
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

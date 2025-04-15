
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { PostCategory, PostCategoryInput, createCategory, updateCategory } from '@/services/postCategory.service';
import RichTextEditor from '@/components/common/RichTextEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BlogCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: PostCategory;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  description: z.string().optional(),
  icon: z.string().default('/placeholder.svg'),
  status: z.enum(['active', 'inactive']).default('active'),
});

const BlogCategoryFormModal: React.FC<BlogCategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const { toast } = useToast();
  const [iconPreview, setIconPreview] = useState<string | null>(initialData?.icon || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      icon: initialData.icon || '/placeholder.svg',
      status: initialData.status
    } : {
      name: '',
      description: '',
      icon: '/placeholder.svg',
      status: 'active'
    },
  });

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview for display
      const preview = URL.createObjectURL(file);
      setIconPreview(preview);

      // Read file as base64 for submission
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('icon', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Generate a slug from the name
      const slug = values.name.toLowerCase().replace(/\s+/g, '-');
      
      // Create input object with all required fields
      const categoryData: PostCategoryInput = {
        name: values.name,
        description: values.description,
        icon: values.icon,
        status: values.status,
        slug: slug // Include the generated slug
      };

      if (initialData) {
        await updateCategory(initialData._id, categoryData);
        toast({
          title: 'Category Updated',
          description: 'The post category has been updated.',
        });
      } else {
        await createCategory(categoryData);
        toast({
          title: 'Category Created',
          description: 'The post category has been created.',
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was an error. Please try again.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Post Category' : 'Create Post Category'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Post Category Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Icon</FormLabel>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 border rounded-md flex items-center justify-center bg-gray-50">
                      {iconPreview || field.value ? (
                        <img 
                          src={iconPreview || field.value} 
                          alt="Category Icon" 
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <Image className="text-gray-400" size={24} />
                      )}
                    </div>
                    <div>
                      <label 
                        htmlFor="blog-category-icon" 
                        className="cursor-pointer inline-flex items-center rounded-md px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                      >
                        <Upload size={16} className="mr-2" />
                        Upload Icon
                        <input
                          id="blog-category-icon"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleIconChange}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Recommended: 64x64px PNG</p>
                    </div>
                  </div>
                  <input type="hidden" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Post Category Description"
                      className="min-h-[150px]"
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
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
                {initialData ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogCategoryFormModal;

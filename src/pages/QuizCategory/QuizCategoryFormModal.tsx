
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { QuizCategory, QuizCategoryInput, createQuizCategory, updateQuizCategory } from '@/services/quizCategory.service';
import { Book, BookText, BookOpen, Trophy, HelpCircle, Star, Award, Flag, Brain } from 'lucide-react';

const iconOptions = [
  { label: 'Book', value: 'book', icon: Book },
  { label: 'BookText', value: 'book-text', icon: BookText },
  { label: 'BookOpen', value: 'book-open', icon: BookOpen },
  { label: 'Trophy', value: 'trophy', icon: Trophy },
  { label: 'Help', value: 'help-circle', icon: HelpCircle },
  { label: 'Star', value: 'star', icon: Star },
  { label: 'Award', value: 'award', icon: Award },
  { label: 'Flag', value: 'flag', icon: Flag },
  { label: 'Brain', value: 'brain', icon: Brain },
];

const quizCategoryFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  icon: z.string().min(1, { message: "Icon is required." }),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"], {
    message: "Status must be either active or inactive."
  })
});

type QuizCategoryFormValues = z.infer<typeof quizCategoryFormSchema>;

interface QuizCategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: QuizCategory;
  onSuccess?: () => void;
}

const QuizCategoryFormModal: React.FC<QuizCategoryFormModalProps> = ({ isOpen, onClose, category, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuizCategoryFormValues>({
    resolver: zodResolver(quizCategoryFormSchema),
    defaultValues: category
      ? {
          name: category.name,
          icon: category.icon,
          description: category.description || '',
          status: category.status,
        }
      : {
          name: '',
          icon: 'book',
          description: '',
          status: 'active',
        },
  });

  const onSubmit = async (data: QuizCategoryFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present
      const categoryData: QuizCategoryInput = {
        name: data.name,
        icon: data.icon,
        description: data.description,
        status: data.status
      };
      
      if (category) {
        await updateQuizCategory(category._id, categoryData);
        toast.success("Category updated successfully!");
      } else {
        await createQuizCategory(categoryData);
        toast.success("Category created successfully!");
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        form.reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Create New Category"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {iconOptions.map((icon) => {
                        const IconComponent = icon.icon;
                        return (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center">
                              <IconComponent className="h-4 w-4 mr-2" />
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category description" {...field} />
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
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-admin-primary hover:bg-admin-secondary">
                {category ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizCategoryFormModal;

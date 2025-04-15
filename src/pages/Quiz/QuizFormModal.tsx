
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { createQuiz, updateQuiz, getQuizCategories, Quiz, QuizCategory } from '@/services/quiz.service';

// Define form schema
const quizFormSchema = z.object({
  question: z.string().min(1, { message: "Question is required." }),
  answer: z.string().min(1, { message: "Answer is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  status: z.enum(["active", "inactive"], {
    message: "Status must be either active or inactive."
  })
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

interface QuizFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz?: Quiz;
  onSuccess?: () => void;
}

const QuizFormModal: React.FC<QuizFormModalProps> = ({ isOpen, onClose, quiz, onSuccess }) => {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: quiz
      ? {
          question: quiz.question,
          answer: quiz.answer,
          category: quiz.category,
          status: quiz.status,
        }
      : {
          question: "",
          answer: "",
          category: "",
          status: "active",
        },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getQuizCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching quiz categories:", error);
        toast.error("Failed to load quiz categories.");
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: QuizFormValues) => {
    setIsSubmitting(true);
    try {
      if (quiz) {
        await updateQuiz(quiz._id, data);
        toast.success("Quiz updated successfully!");
      } else {
        await createQuiz(data);
        toast.success("Quiz created successfully!");
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{quiz ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-admin-primary hover:bg-admin-secondary">
                {quiz ? "Update Quiz" : "Create Quiz"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizFormModal;

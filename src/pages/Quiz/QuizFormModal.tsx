
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { createQuiz, updateQuiz, getQuizCategories, Quiz, QuizCategory, QuizInput } from '@/services/quiz.service';

// Define form schema with options
const quizFormSchema = z.object({
  question: z.string().min(1, { message: "Question is required." }),
  option1: z.string().optional(),
  option2: z.string().optional(),
  option3: z.string().optional(),
  option4: z.string().optional(),
  correctAnswer: z.string().min(1, { message: "Correct answer is required." }),
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
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctAnswer: quiz.answer,
          category: quiz.category,
          status: quiz.status,
        }
      : {
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctAnswer: "",
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
      // Ensure required fields are present for the API
      const quizData: QuizInput = {
        question: data.question,
        answer: data.correctAnswer,
        category: data.category,
        status: data.status
      };
      
      if (quiz) {
        await updateQuiz(quiz._id, quizData);
        toast.success("Quiz updated successfully!");
      } else {
        await createQuiz(quizData);
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{quiz ? "Edit Quiz" : "Create New Quiz"}</DialogTitle>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="option1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Option 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter option 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="option2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Option 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter option 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="option3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Option 3</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter option 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="option4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Option 4</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter option 4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Answer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter correct answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Category</FormLabel>
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
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="mr-2">
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

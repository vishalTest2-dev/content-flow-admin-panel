
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { createQuiz, updateQuiz, getQuizCategories, type Quiz, type QuizCategory } from '@/services/quiz.service'; // Import API functions and types

const questionSchema = z.object({
  question: z.string().min(1, { message: "Question is required." }),
  answers: z.array(
    z.object({
      text: z.string().min(1, { message: "Answer text is required." }),
      isCorrect: z.boolean(),
    })
  ).min(2, { message: "At least two answers are required." }),
});

const quizFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  categoryId: z.string().min(1, { message: "Category is required." }),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, { message: "At least one question is required." }),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

interface QuizFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz?: Quiz;
}

const QuizFormModal: React.FC<QuizFormModalProps> = ({ isOpen, onClose, quiz }) => {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: quiz
      ? {
        title: quiz.title,
        categoryId: quiz.categoryId,
        description: quiz.description,
        questions: quiz.questions.map(q => ({
          question: q.question,
          answers: q.answers,
        })),
      }
      : {
        title: "",
        categoryId: "",
        description: "",
        questions: [{ question: "", answers: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] }],
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
      form.reset();
      onClose();
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Quiz title" {...field} />
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Quiz description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Basic question input - needs improvement for multiple questions and answers */}
            {form.values.questions.map((_, index) => (
              <div key={index} className="space-y-2">
                <FormField
                  control={form.control}
                  name={`questions.${index}.question` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder={`Question ${index + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Render answers for this question - currently limited to 2 */}
                {form.values.questions[index].answers.map((_, answerIndex) => (
                  <FormField
                    key={answerIndex}
                    control={form.control}
                    name={`questions.${index}.answers.${answerIndex}.text` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer {answerIndex + 1}</FormLabel>
                        <FormControl>
                          <Input placeholder={`Answer ${answerIndex + 1}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            ))}

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

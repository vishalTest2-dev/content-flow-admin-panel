
import React from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/components/common/RichTextEditor';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createQuizCategory, updateQuizCategory, QuizCategory, QuizCategoryInput } from '@/services/quizCategory.service';
import { useToast } from "@/components/ui/use-toast";

interface QuizCategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: QuizCategory | null;
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    icon: z.string().default("/placeholder.svg"),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
});

type FormValues = z.infer<typeof formSchema>;

const QuizCategoryFormModal: React.FC<QuizCategoryFormModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
    const { toast } = useToast();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            icon: initialData.icon,
            description: initialData.description,
            status: initialData.status,
        } : {
            name: "",
            icon: "/placeholder.svg",
            description: "",
            status: "active",
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            if (initialData) {
                // Ensure name is included explicitly (it's required by the API)
                const categoryData: QuizCategoryInput = {
                    name: data.name,
                    icon: data.icon,
                    description: data.description,
                    status: data.status
                };
                await updateQuizCategory(initialData._id, categoryData);
                toast({
                    title: "Success",
                    description: "Quiz category updated successfully."
                });
            } else {
                // For create, explicitly include all required fields
                const categoryData: QuizCategoryInput = {
                    name: data.name,
                    icon: data.icon,
                    description: data.description,
                    status: data.status
                };
                await createQuizCategory(categoryData);
                toast({
                    title: "Success",
                    description: "Quiz category created successfully."
                });
            }
            form.reset();
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "An error occurred.",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Edit Quiz Category' : 'Create Quiz Category'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <RichTextEditor
                                            content={field.value || ""}
                                            onChange={field.onChange}
                                            placeholder="Enter category description"
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
                                {initialData ? 'Update' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default QuizCategoryFormModal;

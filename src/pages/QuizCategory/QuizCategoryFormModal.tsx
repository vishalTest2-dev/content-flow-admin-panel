
import React, { useState } from 'react';
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
import { Image, Upload } from 'lucide-react';
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
    const [iconPreview, setIconPreview] = useState<string | null>(initialData?.icon || null);

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

    const onSubmit = async (data: FormValues) => {
        try {
            // Ensure all required fields are present for the API
            const categoryData: QuizCategoryInput = {
                name: data.name,
                icon: data.icon,
                description: data.description,
                status: data.status
            };

            if (initialData) {
                await updateQuizCategory(initialData._id, categoryData);
                toast({
                    title: "Success",
                    description: "Quiz category updated successfully."
                });
            } else {
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
                                                htmlFor="category-icon" 
                                                className="cursor-pointer inline-flex items-center rounded-md px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                            >
                                                <Upload size={16} className="mr-2" />
                                                Upload Icon
                                                <input
                                                    id="category-icon"
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

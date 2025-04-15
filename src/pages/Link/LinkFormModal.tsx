
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { createLink, updateLink } from '@/services/api';

const linkFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  url: z.string().url({ message: 'Valid URL is required' }),
  order: z.number().optional().default(0),
  category: z.string().optional(),
  page1Ads: z.string().optional(),
  page2Ads: z.string().optional(),
  page3Ads: z.string().optional(),
  autoAds: z.boolean().default(false),
  status: z.enum(['active', 'inactive']).default('active'),
  design: z.string().optional(),
});

type LinkFormValues = z.infer<typeof linkFormSchema>;

interface LinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    _id: string;
    title: string;
    url: string;
    order: number;
    category?: string;
  };
}

const LinkFormModal: React.FC<LinkFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const { toast } = useToast();
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          url: initialData.url,
          order: initialData.order,
          category: initialData.category,
          page1Ads: '',
          page2Ads: '',
          page3Ads: '',
          autoAds: false,
          status: 'active',
          design: 'design1',
        }
      : {
          title: '',
          url: '',
          order: 0,
          category: '',
          page1Ads: '',
          page2Ads: '',
          page3Ads: '',
          autoAds: false,
          status: 'active',
          design: 'design1',
        },
  });

  const isEditMode = !!initialData;

  const onSubmit = async (data: LinkFormValues) => {
    try {
      // For the API, we only send the fields the API expects
      const linkData = {
        title: data.title,
        url: data.url,
        order: data.order,
        category: data.category,
        status: data.status
      };

      if (isEditMode && initialData) {
        await updateLink(initialData._id, linkData);
        toast({
          title: 'Success',
          description: 'Link updated successfully.',
        });
      } else {
        await createLink(linkData);
        toast({
          title: 'Success',
          description: 'Link created successfully.',
        });
      }
      form.reset();
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Link' : 'Add New Link'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter link name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your App Link</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input className="rounded-r-none" value="quizapp.com/" disabled />
                          <Input 
                            className="rounded-l-none border-l-0" 
                            placeholder="your-path" 
                            {...field} 
                            onChange={(e) => {
                              // Update only the path part, not the domain
                              const value = e.target.value.trim();
                              field.onChange(value.startsWith('http') ? value : `https://quizapp.com/${value}`);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Created Link</FormLabel>
                      <FormControl>
                        <Input value={field.value} disabled className="bg-gray-50" />
                      </FormControl>
                      <FormDescription className="text-xs">Auto-generated from name</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/your-destination" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="page1Ads"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page 1 Ads</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter HTML code for Page 1 ads" 
                      {...field} 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="page2Ads"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page 2 Ads</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter HTML code for Page 2 ads" 
                      {...field} 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="page3Ads"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page 3 Ads</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter HTML code for Page 3 ads" 
                      {...field} 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Select Design</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <FormField
                    control={form.control}
                    name="design"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <div 
                            className={`border rounded-md p-3 cursor-pointer ${field.value === 'design1' ? 'border-primary bg-primary/5' : ''}`}
                            onClick={() => field.onChange('design1')}
                          >
                            <div className="h-20 bg-gray-100 mb-2 flex items-center justify-center text-sm text-gray-500">
                              Design 1
                            </div>
                            <div className="text-center text-sm font-medium">Option 1</div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="design"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <div 
                            className={`border rounded-md p-3 cursor-pointer ${field.value === 'design2' ? 'border-primary bg-primary/5' : ''}`}
                            onClick={() => field.onChange('design2')}
                          >
                            <div className="h-20 bg-gray-100 mb-2 flex items-center justify-center text-sm text-gray-500">
                              Design 2
                            </div>
                            <div className="text-center text-sm font-medium">Option 2</div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="design"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <div 
                            className={`border rounded-md p-3 cursor-pointer ${field.value === 'design3' ? 'border-primary bg-primary/5' : ''}`}
                            onClick={() => field.onChange('design3')}
                          >
                            <div className="h-20 bg-gray-100 mb-2 flex items-center justify-center text-sm text-gray-500">
                              Design 3
                            </div>
                            <div className="text-center text-sm font-medium">Option 3</div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="design"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <div 
                            className={`border rounded-md p-3 cursor-pointer ${field.value === 'design4' ? 'border-primary bg-primary/5' : ''}`}
                            onClick={() => field.onChange('design4')}
                          >
                            <div className="h-20 bg-gray-100 mb-2 flex items-center justify-center text-sm text-gray-500">
                              Design 4
                            </div>
                            <div className="text-center text-sm font-medium">Option 4</div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Question Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                            <SelectItem value="geography">Geography</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="autoAds"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto Ads</FormLabel>
                        <FormDescription>
                          Automatically display ads on pages
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
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
              <Button type="button" variant="outline" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" className="bg-admin-primary hover:bg-admin-secondary">
                {isEditMode ? 'Update Link' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LinkFormModal;

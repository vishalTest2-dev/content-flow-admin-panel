import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock categories
const categories = ["React", "CSS", "JavaScript", "TypeScript", "Node.js", "HTML"];
const ratingOptions = [2, 2.5, 3, 3.5, 4, 4.5, 5];

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: any;
}

const BlogFormModal: React.FC<BlogFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    image: '/placeholder.svg',
    category: '',
    rating: 5,
    status: 'active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure all required fields exist
        shortDescription: initialData.shortDescription || '',
        longDescription: initialData.longDescription || '',
        rating: initialData.rating || 5
      });
    } else {
      // Reset form when adding new blog
      setFormData({
        title: '',
        shortDescription: '',
        longDescription: '',
        image: '/placeholder.svg',
        category: '',
        rating: 5,
        status: 'active'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Blog Image</Label>
            <div className="flex items-center gap-4">
              <img 
                src={formData.image} 
                alt="Blog Preview" 
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <Input 
                  id="image" 
                  type="file" 
                  // In a real app, this would upload the file and update the image URL
                  // For now, we'll keep the placeholder
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 1200x630px, JPG or PNG
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Blog Title</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Enter blog title" 
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea 
              id="shortDescription" 
              name="shortDescription" 
              value={formData.shortDescription} 
              onChange={handleChange} 
              placeholder="Enter a brief description of the blog post"
              className="h-20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Long Description</Label>
            <Textarea 
              id="longDescription" 
              name="longDescription" 
              value={formData.longDescription} 
              onChange={handleChange} 
              placeholder="Enter the full content of the blog post"
              className="h-32"
              required
            />
            <p className="text-xs text-gray-500">
              Note: In a production app, this would use a rich text editor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select 
                value={formData.rating.toString()} 
                onValueChange={(value) => handleSelectChange('rating', parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map(rating => (
                    <SelectItem key={rating} value={rating.toString()}>{rating} Stars</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Live</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" className="bg-admin-primary hover:bg-admin-secondary">
              {initialData ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogFormModal;

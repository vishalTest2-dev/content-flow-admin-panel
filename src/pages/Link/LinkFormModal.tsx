
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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock quiz categories for select dropdown
const quizCategories = [
  "Geography", "Science", "History", "Literature", "Sports", "General Knowledge"
];

// Mock design options
const designOptions = [1, 2, 3, 4];

interface LinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: any;
}

const LinkFormModal: React.FC<LinkFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    createdLink: '',
    baseUrl: 'quizapp.com/',
    page1Ads: '',
    page2Ads: '',
    page3Ads: '',
    designOption: '1',
    quizCategory: '',
    autoAdsEnabled: false,
    autoAdsCode: '',
    status: 'active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Parse baseUrl and link from createdLink
        baseUrl: initialData.createdLink.split('/')[0],
        // Ensure all required fields exist with defaults
        page1Ads: initialData.page1Ads || '',
        page2Ads: initialData.page2Ads || '',
        page3Ads: initialData.page3Ads || '',
        designOption: initialData.designOption || '1',
        quizCategory: initialData.quizCategory || '',
        autoAdsEnabled: initialData.autoAdsEnabled || false,
        autoAdsCode: initialData.autoAdsCode || ''
      });
    } else {
      // Reset form when adding new link
      setFormData({
        name: '',
        url: '',
        createdLink: '',
        baseUrl: 'quizapp.com/',
        page1Ads: '',
        page2Ads: '',
        page3Ads: '',
        designOption: '1',
        quizCategory: '',
        autoAdsEnabled: false,
        autoAdsCode: '',
        status: 'active'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-generate the createdLink when name changes
    if (name === 'name' && !initialData) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]/g, '-');
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        createdLink: `${prev.baseUrl}${slug}`
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Update both baseUrl and regenerate createdLink
    setFormData(prev => {
      const baseUrl = value.endsWith('/') ? value : `${value}/`;
      const slug = prev.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return {
        ...prev,
        baseUrl,
        createdLink: `${baseUrl}${slug}`
      };
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, autoAdsEnabled: checked }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare the data to submit
    const submitData = {
      ...formData,
      // Only include the fields needed for the backend
      createdLink: formData.createdLink,
      status: formData.status,
      // Add other fields from formData
    };
    onSubmit(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Link' : 'Add New Link'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Enter link name" 
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Your App Link</Label>
              <Input 
                id="baseUrl" 
                value={formData.baseUrl} 
                onChange={handleBaseUrlChange} 
                placeholder="e.g., quizapp.com/"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createdLink">Created Link</Label>
              <Input 
                id="createdLink" 
                value={formData.createdLink} 
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Auto-generated from name</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input 
              id="url" 
              name="url" 
              value={formData.url} 
              onChange={handleChange} 
              placeholder="https://example.com/your-destination" 
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page1Ads">Page 1 Ads</Label>
            <Textarea 
              id="page1Ads" 
              name="page1Ads" 
              value={formData.page1Ads} 
              onChange={handleChange} 
              placeholder="Enter HTML code for Page 1 ads"
              className="h-20 font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page2Ads">Page 2 Ads</Label>
            <Textarea 
              id="page2Ads" 
              name="page2Ads" 
              value={formData.page2Ads} 
              onChange={handleChange} 
              placeholder="Enter HTML code for Page 2 ads"
              className="h-20 font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page3Ads">Page 3 Ads</Label>
            <Textarea 
              id="page3Ads" 
              name="page3Ads" 
              value={formData.page3Ads} 
              onChange={handleChange} 
              placeholder="Enter HTML code for Page 3 ads"
              className="h-20 font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Design</Label>
              <div className="grid grid-cols-2 gap-2">
                {designOptions.map(option => (
                  <div 
                    key={option} 
                    className={`
                      border rounded-md p-2 cursor-pointer hover:bg-gray-50 text-center
                      ${formData.designOption === option.toString() ? 'border-admin-primary bg-indigo-50' : 'border-gray-200'}
                    `}
                    onClick={() => handleSelectChange('designOption', option.toString())}
                  >
                    <div className="bg-gray-200 h-16 mb-2 rounded flex items-center justify-center text-gray-500">
                      Design {option}
                    </div>
                    <span className={formData.designOption === option.toString() ? 'text-admin-primary font-medium' : ''}>
                      Option {option}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quizCategory">Select Question Category</Label>
              <Select 
                value={formData.quizCategory} 
                onValueChange={(value) => handleSelectChange('quizCategory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {quizCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoAds" className="cursor-pointer">Auto Ads</Label>
                  <Switch 
                    id="autoAds" 
                    checked={formData.autoAdsEnabled}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
                {formData.autoAdsEnabled && (
                  <div className="mt-2">
                    <Textarea 
                      id="autoAdsCode" 
                      name="autoAdsCode" 
                      value={formData.autoAdsCode} 
                      onChange={handleChange} 
                      placeholder="Enter auto ads HTML code"
                      className="h-20 font-mono text-sm"
                    />
                  </div>
                )}
              </div>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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

export default LinkFormModal;

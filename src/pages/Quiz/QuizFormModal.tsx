
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Mock categories
const categories = [
  { id: 1, name: 'Geography' },
  { id: 2, name: 'Space' },
  { id: 3, name: 'Animals' },
  { id: 4, name: 'Literature' },
  { id: 5, name: 'Chemistry' },
];

interface QuizFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const QuizFormModal: React.FC<QuizFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
    category: '',
    status: 'active'
  });

  useEffect(() => {
    if (initialData) {
      // Convert from database format to form format
      setFormData({
        question: initialData.question || '',
        option1: 'Option 1', // These would come from your actual data structure
        option2: 'Option 2',
        option3: 'Option 3',
        option4: 'Option 4',
        answer: initialData.answer || '',
        category: initialData.category || '',
        status: initialData.status || 'active'
      });
    } else {
      // Reset form when adding new
      setFormData({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: '',
        category: '',
        status: 'active'
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter your question"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="option1">Option 1</Label>
              <Input
                id="option1"
                name="option1"
                value={formData.option1}
                onChange={handleChange}
                placeholder="Option 1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="option2">Option 2</Label>
              <Input
                id="option2"
                name="option2"
                value={formData.option2}
                onChange={handleChange}
                placeholder="Option 2"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="option3">Option 3</Label>
              <Input
                id="option3"
                name="option3"
                value={formData.option3}
                onChange={handleChange}
                placeholder="Option 3"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="option4">Option 4</Label>
              <Input
                id="option4"
                name="option4"
                value={formData.option4}
                onChange={handleChange}
                placeholder="Option 4"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Correct Answer</Label>
            <RadioGroup
              value={formData.answer}
              onValueChange={(value) => handleSelectChange('answer', value)}
              className="flex flex-col space-y-2"
            >
              {formData.option1 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={formData.option1} id="option1-radio" />
                  <Label htmlFor="option1-radio">{formData.option1}</Label>
                </div>
              )}
              {formData.option2 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={formData.option2} id="option2-radio" />
                  <Label htmlFor="option2-radio">{formData.option2}</Label>
                </div>
              )}
              {formData.option3 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={formData.option3} id="option3-radio" />
                  <Label htmlFor="option3-radio">{formData.option3}</Label>
                </div>
              )}
              {formData.option4 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={formData.option4} id="option4-radio" />
                  <Label htmlFor="option4-radio">{formData.option4}</Label>
                </div>
              )}
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Quiz Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-admin-primary hover:bg-admin-secondary"
            >
              {initialData ? 'Update Quiz' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuizFormModal;

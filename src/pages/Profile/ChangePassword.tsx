
import React, { useState } from 'react';
import { KeyRound, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ChangePassword = () => {
  const { updateProfile, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      await updateProfile({
        password: formData.newPassword
      });
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Failed to update password:', error);
    }
  };

  return (
    <Layout>
      <PageHeader 
        title="Change Password" 
        subtitle="Update your account password" 
        icon={KeyRound}
      />

      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  name="currentPassword" 
                  value={formData.currentPassword} 
                  onChange={handleChange} 
                  placeholder="Enter your current password" 
                  type="password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  name="newPassword" 
                  value={formData.newPassword} 
                  onChange={handleChange} 
                  placeholder="Enter your new password" 
                  type="password"
                  required
                />
                <p className="text-xs text-gray-500">
                  Password should be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Confirm your new password" 
                  type="password"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-admin-primary hover:bg-admin-secondary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ChangePassword;

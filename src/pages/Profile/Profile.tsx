
import React, { useState, useCallback } from 'react';
import { User, Camera, Save, Upload } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    photo: user?.photo || '/placeholder.svg'
  });
  
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(user?.photo || '/placeholder.svg');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setPreviewPhoto(previewUrl);
      
      // Read the file as base64 for submission
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: profile.name,
        email: profile.email,
        photo: profile.photo
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Update profile error:", error);
    }
  };

  return (
    <Layout>
      <PageHeader 
        title="Profile" 
        subtitle="Manage your account information" 
        icon={User}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={previewPhoto || profile.photo} alt="Profile" className="object-cover" />
                  <AvatarFallback className="text-xl">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="profile-photo"
                  className="absolute bottom-0 right-0 bg-admin-primary text-white p-2 rounded-full shadow-lg hover:bg-admin-secondary transition-colors cursor-pointer"
                  aria-label="Change profile photo"
                >
                  <Camera size={16} />
                  <input 
                    type="file" 
                    id="profile-photo" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-gray-500">{profile.email}</p>
              <p className="text-sm text-gray-500 mt-4">Click on the camera icon to change your profile photo</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={profile.name} 
                    onChange={handleChange} 
                    placeholder="Enter your full name" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    value={profile.email} 
                    onChange={handleChange} 
                    placeholder="Enter your email address" 
                    type="email"
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
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

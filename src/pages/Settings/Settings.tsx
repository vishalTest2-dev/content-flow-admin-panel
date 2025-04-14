
import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteTitle: 'Quiz App',
    description: 'A comprehensive quiz application for testing knowledge.',
    logo: '/placeholder.svg',
    favicon: '/placeholder.svg',
    googleAnalyticsCode: '',
    customCodes: '',
    siteLink: 'https://quizapp.example.com'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a backend
    toast.success('Settings updated successfully');
  };

  return (
    <Layout>
      <PageHeader 
        title="Settings" 
        subtitle="Configure your application settings" 
        icon={SettingsIcon}
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input 
                  id="siteTitle" 
                  name="siteTitle" 
                  value={settings.siteTitle} 
                  onChange={handleChange} 
                  placeholder="Enter site title" 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteLink">Site Link</Label>
                <Input 
                  id="siteLink" 
                  name="siteLink" 
                  value={settings.siteLink} 
                  onChange={handleChange} 
                  placeholder="Enter site URL" 
                  type="url"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={settings.description} 
                onChange={handleChange} 
                placeholder="Enter site description"
                className="h-24"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  <img 
                    src={settings.logo} 
                    alt="Logo Preview" 
                    className="w-16 h-16 object-contain"
                  />
                  <div className="flex-1">
                    <Input 
                      id="logo" 
                      type="file" 
                      // In a real app, this would upload the file and update the logo URL
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-4">
                  <img 
                    src={settings.favicon} 
                    alt="Favicon Preview" 
                    className="w-8 h-8 object-contain"
                  />
                  <div className="flex-1">
                    <Input 
                      id="favicon" 
                      type="file" 
                      // In a real app, this would upload the file and update the favicon URL
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 64x64px, PNG format
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsCode">Google Analytics Code</Label>
              <Textarea 
                id="googleAnalyticsCode" 
                name="googleAnalyticsCode" 
                value={settings.googleAnalyticsCode} 
                onChange={handleChange} 
                placeholder="Paste your Google Analytics tracking code here"
                className="h-24 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customCodes">Custom Codes</Label>
              <Textarea 
                id="customCodes" 
                name="customCodes" 
                value={settings.customCodes} 
                onChange={handleChange} 
                placeholder="Paste any custom HTML, CSS, or JavaScript code here"
                className="h-32 font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                This code will be added to the &lt;head&gt; section of your site.
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-admin-primary hover:bg-admin-secondary">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Settings;


import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Upload, Image } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button'; 
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Setting } from '@/services/setting.service';
import { getSettings, updateSetting } from '@/services/api';

const settingsSchema = z.object({
  siteTitle: z.string().min(1, { message: "Site title is required" }),
  siteLink: z.string().url({ message: "Valid URL is required" }),
  description: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  googleAnalytics: z.string().optional(),
  customCodes: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteTitle: "",
      siteLink: "",
      description: "",
      logo: "",
      favicon: "",
      googleAnalytics: "",
      customCodes: "",
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getSettings();
        setSettings(data);
        
        // Initialize form with fetched settings
        const settingsObj: Record<string, string> = {};
        data.forEach(setting => {
          settingsObj[setting.key] = setting.value || '';
          
          // Set image previews if available
          if (setting.key === 'logo' && setting.value) {
            setLogoPreview(setting.value);
          }
          if (setting.key === 'favicon' && setting.value) {
            setFaviconPreview(setting.value);
          }
        });
        
        form.reset({
          siteTitle: settingsObj.siteTitle || "",
          siteLink: settingsObj.siteLink || "",
          description: settingsObj.description || "",
          logo: settingsObj.logo || "",
          favicon: settingsObj.favicon || "",
          googleAnalytics: settingsObj.googleAnalytics || "",
          customCodes: settingsObj.customCodes || "",
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch settings");
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview for display
      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);

      // Read file as base64 for submission
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview for display
      const preview = URL.createObjectURL(file);
      setFaviconPreview(preview);

      // Read file as base64 for submission
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('favicon', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSaving(true);
    try {
      // Update each setting individually
      const updates = Object.entries(data).map(async ([key, value]) => {
        await updateSetting(key, { value });
      });
      
      await Promise.all(updates);
      toast.success("Settings updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Layout><p>Loading settings...</p></Layout>;
  }

  if (error) {
    return <Layout><p className="text-red-500">{error}</p></Layout>;
  }

  return (
    <Layout>
      <PageHeader 
        title="Settings" 
        subtitle="Configure your application settings" 
        icon={SettingsIcon}
      />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="siteTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your site title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourdomain.com" {...field} />
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
                      <Textarea 
                        placeholder="A brief description of your site" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo</FormLabel>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 border rounded-md flex items-center justify-center bg-gray-50">
                          {logoPreview ? (
                            <img 
                              src={logoPreview} 
                              alt="Logo Preview" 
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <Image className="text-gray-400" size={24} />
                          )}
                        </div>
                        <div>
                          <label 
                            htmlFor="logo-upload" 
                            className="cursor-pointer inline-flex items-center rounded-md px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                          >
                            <Upload size={16} className="mr-2" />
                            Choose File
                            <input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoChange}
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-1">No file chosen</p>
                        </div>
                      </div>
                      <input type="hidden" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="favicon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favicon</FormLabel>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 border rounded-md flex items-center justify-center bg-gray-50">
                          {faviconPreview ? (
                            <img 
                              src={faviconPreview} 
                              alt="Favicon Preview" 
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <Image className="text-gray-400" size={16} />
                          )}
                        </div>
                        <div>
                          <label 
                            htmlFor="favicon-upload" 
                            className="cursor-pointer inline-flex items-center rounded-md px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                          >
                            <Upload size={16} className="mr-2" />
                            Choose File
                            <input
                              id="favicon-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFaviconChange}
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-1">Recommended: 64x64px, PNG format</p>
                        </div>
                      </div>
                      <input type="hidden" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="googleAnalytics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Analytics Code</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Paste your Google Analytics tracking code here" 
                        className="min-h-[120px] font-mono text-sm" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customCodes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Codes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Paste any custom HTML, CSS, or JavaScript code here" 
                        className="min-h-[120px] font-mono text-sm" 
                        {...field} 
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">
                      This code will be added to the &lt;head&gt; section of your site.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-admin-primary hover:bg-admin-secondary"
                  disabled={isSaving}
                >
                  {isSaving ? (
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
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Settings;

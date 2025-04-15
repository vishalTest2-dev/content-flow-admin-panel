
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Setting } from '@/services/setting.service'; // Import from correct location
import { getSettings, updateSetting } from '@/services/api'; // Import the API functions

interface SettingFormValues extends Omit<Setting, 'key' | 'description'> {
  value: string;
}

const settingSchema = z.object({
  key: z.string(),
  value: z.string().optional(),
  description: z.string().optional(),
});

const SettingFormModal: React.FC<{ setting: Setting }> = ({ setting }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      key: setting.key,
      value: setting.value || "",
      description: setting.description || "",
    },
  });

  const onSubmit = async (data: SettingFormValues) => {
    try {
      await updateSetting(setting.key, data);
      toast.success("Setting updated successfully");
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update setting");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Setting</DialogTitle>
          <DialogDescription>
            Update the value for the "{setting.key}" setting.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{setting.key}</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {/* Display description as read-only */}
             {setting.description && (
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={setting.description}
                  readOnly
                  className="h-20 bg-gray-100 text-gray-500"
                />
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-admin-primary hover:bg-admin-secondary">
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getSettings();
        setSettings(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <Layout>
      <PageHeader 
        title="Settings" 
        subtitle="Configure your application settings" 
        icon={SettingsIcon}
      />
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading settings...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.map((setting) => (
                    <TableRow key={setting.key}>
                      <TableCell className="font-medium">{setting.key}</TableCell>
                      <TableCell>{setting.value}</TableCell>
                      <TableCell className="text-right">
                        <SettingFormModal setting={setting} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Settings;

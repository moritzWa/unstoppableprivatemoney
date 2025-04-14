import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as z from 'zod';
import { trpc } from '../utils/trpc';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactLink: z.string().url('Must be a valid URL'),
  logo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 5MB')
    .optional(),
});

export function CreateOrganisationForm() {
  const { id } = useParams(); // Get org ID from URL if editing
  const isEditing = !!id;
  const navigate = useNavigate();

  // Query for existing org data if editing
  const { data: existingOrg } = trpc.organisation.getById.useQuery(
    { id: id! },
    { enabled: isEditing }
  );

  const utils = trpc.useContext();

  const createOrganisation = trpc.organisation.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Organisation created successfully',
      });
      navigate('/organisations');
    },
  });

  const updateOrganisation = trpc.organisation.update.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Organisation updated successfully',
      });
      utils.organisation.getAll.invalidate();
      navigate('/organisations');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactLink: '',
    },
  });

  // Set form values when editing and data is loaded
  React.useEffect(() => {
    if (isEditing && existingOrg) {
      form.reset({
        name: existingOrg.name,
        contactLink: existingOrg.contactLink,
      });
    }
  }, [existingOrg, isEditing, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let logoData;
      if (values.logo) {
        // Convert file to base64 string
        const fileReader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          fileReader.onload = () => {
            if (typeof fileReader.result === 'string') {
              // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
              const base64 = fileReader.result.split(',')[1];
              resolve(base64);
            } else {
              reject(new Error('Failed to read file as base64'));
            }
          };
          fileReader.onerror = () => reject(fileReader.error);
        });

        fileReader.readAsDataURL(values.logo);
        logoData = await base64Promise;
      }

      const payload = {
        name: values.name,
        contactLink: values.contactLink,
        ...(logoData && values.logo
          ? {
              logo: {
                data: logoData,
                contentType: values.logo.type || 'image/jpeg', // Ensure contentType is never undefined
              },
            }
          : isEditing
            ? {}
            : {
                logo: {
                  // For creation, provide default logo if none selected
                  data: '',
                  contentType: 'image/jpeg',
                },
              }),
      };

      if (isEditing) {
        await updateOrganisation.mutate({ id, ...payload });
      } else {
        await createOrganisation.mutate(payload);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process request. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Organisation' : 'Create Organisation'}
        </h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Organisation name" {...field} />
              </FormControl>
              <FormDescription>This is your organisation's display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Link</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                A URL where people can contact your organisation (e.g. website, Twitter, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > MAX_FILE_SIZE) {
                        toast({
                          title: 'Error',
                          description: 'File size must be less than 5MB',
                          variant: 'destructive',
                        });
                        return;
                      }
                      onChange(file);
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormDescription>Upload your organisation's logo (max 5MB)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createOrganisation.isLoading || updateOrganisation.isLoading}
        >
          {isEditing ? 'Update' : 'Create'} Organisation
        </Button>
      </form>
    </Form>
  );
}

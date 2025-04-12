import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const createOrganisation = trpc.organisation.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Organisation created successfully',
      });
      navigate('/');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create organisation',
        variant: 'destructive',
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      contactLink: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.logo) {
      toast({
        title: 'Error',
        description: 'Please select a logo image',
        variant: 'destructive',
      });
      return;
    }

    try {
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
      const base64Data = await base64Promise;

      await createOrganisation.mutate({
        name: values.name,
        contactLink: values.contactLink,
        logo: {
          data: base64Data,
          contentType: values.logo.type,
        },
      });
    } catch (error) {
      console.error('Error creating organisation:', error);
      toast({
        title: 'Error',
        description: 'Failed to process image. Please try again with a smaller file.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <Button type="submit" disabled={createOrganisation.isLoading}>
          {createOrganisation.isLoading ? 'Creating...' : 'Create Organisation'}
        </Button>
      </form>
    </Form>
  );
}

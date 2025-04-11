import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface OrganisationResponse {
  _id: string;
  name: string;
  logo: {
    contentType: string;
  };
  contactLink: string;
  createdAt: string;
  updatedAt: string;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  organisation: z.string().min(1, 'Organisation is required'),
  submitLink: z.string().url('Must be a valid URL'),
  contactLink: z.string().url('Must be a valid URL'),
  skills: z.string().min(1, 'Skills are required'),
  prizes: z.string().min(1, 'Prizes are required'),
  prizeCurrency: z.string().min(1, 'Prize currency is required'),
  details: z.string().min(1, 'Details are required'),
});

export function CreateBountyForm() {
  const navigate = useNavigate();

  const { data: organisations } = trpc.organisation.getAll.useQuery<OrganisationResponse[]>();
  console.log('Raw organisations data:', organisations);

  const createBounty = trpc.bounty.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Bounty created successfully',
      });
      navigate('/home');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create bounty',
        variant: 'destructive',
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      organisation: '',
      submitLink: '',
      contactLink: '',
      skills: '',
      prizes: '',
      prizeCurrency: '',
      details: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createBounty.mutate(values);
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
                <Input placeholder="Bounty name" {...field} />
              </FormControl>
              <FormDescription>The name of your bounty</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organisation"
          render={({ field }) => {
            console.log('Current field value:', field.value);
            return (
              <FormItem>
                <FormLabel>Organisation</FormLabel>
                <Select
                  onValueChange={(value) => {
                    console.log('Select changed to:', value);
                    field.onChange(value);
                  }}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an organisation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organisations?.map((org) => (
                      <SelectItem key={org._id} value={org._id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div>DEBUG: Current value: {field.value}</div>
                <FormDescription className="flex items-center gap-1">
                  Can't find your organisation?{' '}
                  <Link to="/create-organisation" className="text-primary hover:underline">
                    Create a new one
                  </Link>
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="submitLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submit Link</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>Where should participants submit their work?</FormDescription>
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
              <FormDescription>Where can participants contact you?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Skills</FormLabel>
              <FormControl>
                <Input placeholder="React, TypeScript, Node.js" {...field} />
              </FormControl>
              <FormDescription>Comma-separated list of required skills</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="prizes"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Prizes</FormLabel>
                <FormControl>
                  <Input placeholder="1000, 500, 250" {...field} />
                </FormControl>
                <FormDescription>Comma-separated list of prize amounts</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prizeCurrency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the bounty requirements and expectations..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Detailed description of the bounty</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createBounty.isLoading}>
          {createBounty.isLoading ? 'Creating...' : 'Create Bounty'}
        </Button>
      </form>
    </Form>
  );
}

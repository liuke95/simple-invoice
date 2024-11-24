import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axiosInstance from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { LoginBody } from '@/types/RequestBody';
import { LoginResponse } from '@/types/RequestResponse';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export function LoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const data: LoginBody = {
        client_id: 'v3V87ZIqjdUMnQlf4yv7eW3k1aAa',
        client_secret: 'DXhnQ6TcE_wisvn6mWqAUqJrtpQa',
        grant_type: 'password',
        scope: 'openid',
        username: values.username,
        password: values.password,
      };
      setLoading(true);
      const response = await axiosInstance.post<LoginResponse>(
        '/oauth2/token',
        data,
        {
          baseURL: 'https://is-101digital-sandbox.101digital.io/',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      navigate('/invoices'); // Redirect to invoices
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid username or password.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel className='flex items-center'>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='username' {...field} />
                  </FormControl>
                  <FormMessage className='flex items-center' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='grid gap-2'>
                  <FormLabel className='flex items-center'>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='password' {...field} />
                  </FormControl>
                  <FormMessage className='flex items-center' />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <div className='flex items-center gap-4'>
                  <LoaderCircle className='animate-spin' />
                  Loading...
                </div>
              ) : (
                <div>Submit</div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

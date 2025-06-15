'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
// import { signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LoginSchema, LoginSchemaInput } from '@/schemas/login';
import { Login } from '@/actions/login';

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginSchemaInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = (values: LoginSchemaInput) => {
    startTransition(async () => {
      //   try {
      //     await Login(data);
      //     toast.success("Signed In Successfully!");
      //   } catch (error) {
      //     toast.error("Login failed");
      //   }
      await Login(values).then((data) => {
        if (data?.error) {
          toast.error(data?.error);
        } else {
          toast.success('Signed In Successfully!');
        }
      });
    });
  };

  // Gabungkan kedua state loading
  const isLoading = isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-2'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Enter your Username...'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Enter your password...'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} className='ml-auto w-full' type='submit'>
          {isLoading ? 'Processing...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
}

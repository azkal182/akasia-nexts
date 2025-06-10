import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(3, 'Username must be at least 3 characters long'),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters long')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match'
  });

'use server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * Fetches all users from the database.
 * @returns {Promise<Prisma.UserGetPayload<{
 *   select: {
 *     id: true;
 *     username: true;
 *     name: true;
 *     ROLE: true;
 *     active: true;
 *   };
 * }>[] | null>} An array of user objects or null if no users are found.
 */

export type UsersResponse = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    name: true;
    ROLE: true;
    active: true;
  };
}>;
export const getUsers = async (): Promise<UsersResponse[]> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        ROLE: true,
        active: true
      },
      orderBy: { createdAt: 'asc' }
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
};

export const activateUser = async (userId: string) => {
  try {
    const data = await prisma.user.update({
      where: { id: userId },
      data: { active: true }
    });

    revalidatePath('/dashboard/users');
    return data;
  } catch (error) {
    console.error('Error activating user:', error);
    throw new Error('Failed to activate user');
  }
};
export const deleteUserById = async (userId: string) => {
  try {
    const data = await prisma.user.delete({
      where: { id: userId }
    });

    revalidatePath('/dashboard/users');
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};

import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password, name } = await request.json();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'username sudah digunakan' },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 10);
    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        password: passwordHash,
        active: false,
        ROLE: 'DRIVER'
      }
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name,
          role: newUser.ROLE
        }
      },
      {
        status: 201
      }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

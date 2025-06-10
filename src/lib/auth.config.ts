import { LoginSchema } from '@/schemas/login';
import { compare } from 'bcryptjs';
import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import prisma from '@/lib/prisma';

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      credentials: {
        username: {
          type: 'text'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        console.log('credentials', credentials);

        const validateFields = LoginSchema.safeParse(credentials);
        if (validateFields.success) {
          const { username, password } = validateFields.data;
          console.log('testing credentials');

          console.log(username, password);

          const user = await prisma.user.findUnique({
            where: {
              username
            }
          });

          console.log(
            'User found:',
            user ? JSON.stringify(user) : 'No user found'
          );

          if (!user) return null;

          const passwordMatch = await compare(password, user.password);
          if (passwordMatch)
            console.log({
              username: user.username,
              name: user.name,
              id: user.id,
              role: user.ROLE
            });
          return {
            username: user.username,
            name: user.name,
            id: user.id,
            role: user.ROLE
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login' // signin page
  },
  callbacks: {
    async jwt({ token, user }) {
      // `user` hanya tersedia saat login, jadi kita tambahkan ID ke token di sini

      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.name = user.name;
      }
      //   console.log('JWT Callback:', { token, user });
      return token;
    },
    async session({ session, token }) {
      // Menyertakan ID dari token ke session
      if (session.user && token?.id) {
        session.user.id = String(token.id);
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;

import { LoginSchema } from '@/schemas/login';
import { compare } from 'bcryptjs';
import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import prisma from "@/lib/prisma";
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
                // const user = {
                //     id: '1',
                //     name: 'John',
                //     email: credentials?.email as string
                // };
                // if (user) {
                //     // Any object returned will be saved in `user` property of the JWT
                //     return user;
                // } else {
                //     // If you return null then an error will be displayed advising the user to check their details.
                //     return null;

                //     // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                // }
                const validateFields = LoginSchema.safeParse(credentials);
                if (validateFields.success) {
                    const { username, password } = validateFields.data;
                    console.log(username, password);


                    const user = await prisma.user.findUnique({
                        where: {
                            username
                        }
                    })
                    if (!user) return null

                    const passwordMatch = await compare(password, user.password)

                    if (passwordMatch) return user
                    return null
                }
                // throw new Error('User not found.');
                return null;
            }
        })
    ],
    pages: {
        signIn: '/login' //sigin page
    }
} satisfies NextAuthConfig;

export default authConfig;

'use server';

import prisma from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { LoginSchema, LoginSchemaInput } from "@/schemas/login";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "../../routes";

export const Login = async (data: LoginSchemaInput) => {
    const validated = LoginSchema.safeParse(data)

    if (!validated.success) {
        return { error: "invalid fields" }
    }

    const { username, password } = validated.data
    const existingUser = await prisma.user.findUnique({
        where: {
            username
        }
    })
    if (!existingUser) {
        return { error: "username does not exist!" };
    }
    try {
        await signIn("credentials", {
            username,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });

    } catch (error) {

    }
}

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/profile/login",
        newUser: "/profile/signup",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                phone: { label: "Phone", type: "number", placeholder: "017XXXXXXXX" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { phone, password } = credentials;

                if (!phone || !password) {
                    throw new Error("Phone and password are required.");
                }

                // Find student by phone
                const existingStudent = await prisma.student.findUnique({
                    where: { phone },
                });

                if (!existingStudent) {
                    throw new Error("Student not found.");
                }

                // Verify password
                const passwordMatch = await compare(password, existingStudent.password);
                if (!passwordMatch) {
                    throw new Error("Invalid credentials.");
                }

                // Return user data for session & JWT
                return {
                    id: existingStudent.id.toString(),
                    phone: existingStudent.phone,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.phone = user.phone;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.phone = token.phone;
            }
            return session;
        },
    },
});

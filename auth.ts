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

                // Return user data with all necessary fields for session & JWT
                return {
                    id: existingStudent.id.toString(),
                    phone: existingStudent.phone,
                    roll: existingStudent.roll,
                    name: existingStudent.name,
                    fathersName: existingStudent.fathersName,
                    fathersOccupation: existingStudent.fathersOccupation,
                    mothersName: existingStudent.mothersName,
                    mothersOccupation: existingStudent.mothersOccupation,
                    address: existingStudent.address,
                    nickname: existingStudent.nickname,
                    dobValue: existingStudent.dob,
                    gender: existingStudent.gender,
                    currentInstitute: existingStudent.currentInstitute,
                    currentClass: existingStudent.currentClass,
                    hscBatch: existingStudent.hscBatch,
                    batchTime: existingStudent.batchTime,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.phone = user.phone;
                token.roll = user.roll;
                token.name = user.name;
                token.fathersName = user.fathersName;
                token.fathersOccupation = user.fathersOccupation;
                token.mothersName = user.mothersName;
                token.mothersOccupation = user.mothersOccupation;
                token.address = user.address;
                token.nickname = user.nickname;
                token.dobValue = user.dobValue;
                token.gender = user.gender;
                token.currentInstitute = user.currentInstitute;
                token.currentClass = user.currentClass;
                token.hscBatch = user.hscBatch;
                token.batchTime = user.batchTime;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.phone = token.phone;
                session.user.roll = token.roll;
                session.user.name = token.name;
                session.user.fathersName = token.fathersName;
                session.user.fathersOccupation = token.fathersOccupation;
                session.user.mothersName = token.mothersName;
                session.user.mothersOccupation = token.mothersOccupation;
                session.user.address = token.address;
                session.user.nickname = token.nickname;
                session.user.dobValue = token.dobValue;
                session.user.gender = token.gender;
                session.user.currentInstitute = token.currentInstitute;
                session.user.currentClass = token.currentClass;
                session.user.hscBatch = token.hscBatch;
                session.user.batchTime = token.batchTime;
            }
            return session;
        },
    },
});

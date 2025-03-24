"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function studentSignUp(formData: FormData) {
    try {
        const phone = formData.get("phone")?.toString();
        const password = formData.get("password")?.toString();

        if (!phone || !password) {
            return { error: "Phone and password are required" };
        }

        const existingStudent = await prisma.student.findUnique({
            where: { phone }
        });

        if (existingStudent) {
            return { error: "Phone already exists!" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = await prisma.student.create({
            data: { phone, password: hashedPassword }
        });

        return { student: newStudent, message: "Student created successfully." };
    } catch (error) {
        console.error("Signup error:", error);
        return { error: "Internal server error" };
    }
}


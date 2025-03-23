import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(req: Request) {
    try {
        const { phone, password } = await req.json();

        // Find student by phone number
        const student = await prisma.student.findUnique({
            where: { phone: phone }
        });

        if (!student) {
            return NextResponse.json({ error: "Invalid phone or password" }, { status: 401 });
        }

        // Compare passwords
        const passwordMatch = student.password ? await bcrypt.compare(password, student.password) : false;
        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid phone or password" }, { status: 401 });
        }

        // Successful login response
        return NextResponse.json({ message: "Login successful", student }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

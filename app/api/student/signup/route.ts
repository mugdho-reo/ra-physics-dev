import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    const { phone, password } = await req.json();
    console.log(phone);
    console.log(password);
    const existingPhone = await prisma.student.findUnique(
        {
            where: {
                phone: phone
            }
        }
    );
    if (existingPhone) {
        NextResponse.json({ user: null, message: "Phone already exists!" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = await prisma.student.create({
        data: { phone, password: hashedPassword }
    });
    return NextResponse.json({ student: newStudent, message: "Student created successfully." }, { status: 201 });
}
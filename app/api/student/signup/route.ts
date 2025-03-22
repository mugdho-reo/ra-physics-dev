import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    const { phone, password } = await req.json();
    console.log(phone);
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await prisma.student.create({
        data: { phone, password: hashedPassword }
    });
    return NextResponse.json(student);
}
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { roll } = await req.json();
        const id = parseInt(roll.slice(-4));
        const student = await prisma.student.findUnique({
            where: { id },
            include: { courses: true }
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }
        console.log(student);
        return NextResponse.json(student);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

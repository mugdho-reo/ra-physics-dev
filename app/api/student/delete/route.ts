import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { roll } = await req.json();
        const id = parseInt(String(roll).slice(-4));
        const response = await prisma.student.delete({
            where: { id }
        });
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

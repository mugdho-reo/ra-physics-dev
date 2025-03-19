import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        const deletedCourse = await prisma.course.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json(deletedCourse, { status: 200 });
    } catch (error) {
        console.error("Error deleting course:", error);
        return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
    }
}

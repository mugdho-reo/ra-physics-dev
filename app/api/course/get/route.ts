import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const courses = await prisma.course.findMany();

        if (courses.length === 0) {
            return NextResponse.json({ error: "No courses found" }, { status: 404 });
        }

        return NextResponse.json(courses, { status: 200 });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

"use server";
import prisma from "@/lib/prisma";

export async function createCourse(formData: FormData) {
    const forClass = formData.get("class") as string;
    const title = formData.get("title") as string;
    const forBatchTime = formData.get("batchTime") as string;
    const courseFee = parseInt(formData.get("courseFee") as string, 10);
    const isActive = formData.get("isActive") === "true";

    try {
        const response = await prisma.course.create({
            data: {
                forClass,
                title,
                forBatchTime,
                courseFee,
                isActive,
            },
        });
        console.log(response);
    } catch (e) {
        console.error(e);
    }
}

export async function deleteCourse(id: number) {
    try {
        const deletedCourse = await prisma.course.delete({
            where: { id: Number(id) },
        });
        return ({ deletedCourse, deleted: true });
    } catch (error) {
        console.error("Error deleting course:", error);
        return { error: "Failed to delete course" };
    }
}

export async function getAllCourse() {
    try {
        const courses = await prisma.course.findMany();
        if (courses.length === 0) {
            return { error: "No courses found" };
        }
        return courses;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return { error: "Internal server error" };
    }
}
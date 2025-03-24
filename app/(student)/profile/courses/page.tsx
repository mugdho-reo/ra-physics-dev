import { getAllCourse } from "@/actions/course";
import { buyCourseById } from "@/actions/student";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@prisma/client";
import Form from "next/form";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function StudentCourseDashBoard() {
    const session = await auth(); // Get session data
    if (!session?.user) {
        redirect("/profile/login");
    }

    const courses: Course[] = await getAllCourse(); // Fetch courses on the server
    async function buyCourse(courseId: number) {
        "use server"; // Ensures this runs as a Next.js Server Action
        const studentId = parseInt(session.user.id);
        try {
            const { added } = await buyCourseById(courseId, studentId);
            if (added) {
                console.log("Added successfully")
            } else {
                console.error("Failed to buy course");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                Available Courses
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <Card
                        key={course.id}
                        className="bg-white shadow-xl border border-gray-300 rounded-2xl overflow-hidden transition-transform transform hover:scale-105"
                    >
                        <CardHeader className="bg-gradient-to-r from-red-400 to-red-600 text-white p-5">
                            <CardTitle className="text-lg font-bold">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col justify-between space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-gray-700">
                                <span className="font-medium">Class:</span>
                                <span>{course.forClass}</span>
                                <span className="font-medium">Course ID:</span>
                                <span>{course.id}</span>
                                <span className="font-medium">Course Fee:</span>
                                <span>৳ {course.courseFee}</span>
                                <span className="font-medium">Batch Time:</span>
                                <span>{course.forBatchTime}</span>
                                <span className="font-medium">Status:</span>
                                <span
                                    className={
                                        course.isActive ? "text-green-600 font-bold" : "text-red-600 font-bold"
                                    }
                                >
                                    {course.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <Form action={async () => {
                                "use server"
                                buyCourse(course.id);
                            }}>
                                <Button type="submit">Buy</Button>
                            </Form>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

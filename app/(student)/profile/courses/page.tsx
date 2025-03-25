"use client";

import { getAllCourse, getBoughtCourses } from "@/actions/course";
import { buyCourseById } from "@/actions/student";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function StudentCourseDashBoard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [studentBoughtCourses, setStudentBoughtCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/profile/login");
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchData() {
            if (!session?.user?.id) return;

            try {
                setLoading(true);
                const [courses, boughtCourses] = await Promise.all([
                    getAllCourse(),
                    getBoughtCourses(parseInt(session.user.id))
                ]);

                setAllCourses(courses);
                setStudentBoughtCourses(boughtCourses);
            } catch (error) {
                toast.error("Failed to load courses");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [session]);

    async function handleBuyCourse(courseId: number) {
        if (!session?.user?.id) return;

        try {
            const { added } = await buyCourseById(courseId, parseInt(session.user.id));
            if (added) {
                toast.success("Course purchased successfully!");
                // Refresh the bought courses list
                const updatedBoughtCourses = await getBoughtCourses(parseInt(session.user.id));
                setStudentBoughtCourses(updatedBoughtCourses);
            } else {
                toast.error("Failed to purchase course");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            {/* Bought Courses Section */}
            <section className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Your Learning Journey
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Courses you're currently enrolled in
                    </p>
                </div>

                {studentBoughtCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {studentBoughtCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                variant="owned"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="mx-auto max-w-md">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No courses yet</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by purchasing a course below</p>
                        </div>
                    </div>
                )}
            </section>

            {/* Available Courses Section */}
            <section className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Expand Your Knowledge
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Browse our available courses
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCourses.map((course) => {
                        const isOwned = studentBoughtCourses.some(c => c.id === course.id);
                        return (
                            <CourseCard
                                key={course.id}
                                course={course}
                                onBuy={!isOwned ? () => handleBuyCourse(course.id) : undefined}
                                variant={isOwned ? "owned" : "available"}
                            />
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

type CourseCardProps = {
    course: Course;
    onBuy?: () => void;
    variant: "available" | "owned";
};

function CourseCard({ course, onBuy, variant }: CourseCardProps) {
    const statusColors = {
        Active: "bg-green-100 text-green-800",
        Inactive: "bg-red-100 text-red-800"
    };

    return (
        <Card className="h-full flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className={`p-0 relative`}>
                <div className={`h-2 ${variant === "owned" ? "bg-blue-600" : "bg-gray-300"}`}></div>
                <div className="p-6 pb-0">
                    <CardTitle className="text-xl font-semibold text-gray-900">
                        {course.title}
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="p-6 flex-grow flex flex-col">
                <div className="space-y-3 flex-grow">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Class</span>
                        <span className="text-sm font-medium">{course.forClass}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Batch Time</span>
                        <span className="text-sm font-medium">{course.forBatchTime}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Fee</span>
                        <span className="text-sm font-semibold">৳{course.courseFee}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Status</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[course.isActive ? "Active" : "Inactive"]}`}>
                            {course.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>

                {onBuy && variant === "available" && (
                    <Button
                        onClick={onBuy}
                        className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
                    >
                        Enroll Now
                    </Button>
                )}

                {variant === "owned" && (
                    <Button
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 mt-6"
                        disabled
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Enrolled
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
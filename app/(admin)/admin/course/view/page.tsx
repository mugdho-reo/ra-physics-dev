"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCourse, getAllCourse } from "@/actions/course";

export default function ViewCourses() {
    interface Course {
        id: number;
        title: string;
        forClass: string;
        courseFee: number;
        forBatchTime: string;
        isActive: boolean;
    }

    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const data = await getAllCourse();

                if (data.error) {
                    throw new Error(data.error);
                }

                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        }
        fetchCourses();
    }, []);


    async function removeCourse(id: number) {
        try {
            const { deleted } = await deleteCourse(id);
            if (deleted) {
                setCourses(courses.filter((course) => course.id !== id));
            } else {
                console.error("Failed to delete course");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Available Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <Card key={course.id} className="bg-white shadow-xl border border-gray-300 rounded-2xl overflow-hidden transition-transform transform hover:scale-105">
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
                                <span className={course.isActive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                    {course.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <Button
                                onClick={() => removeCourse(course.id)}
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                            >
                                Delete
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

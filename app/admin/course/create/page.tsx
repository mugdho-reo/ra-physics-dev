import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Form from "next/form";

export default function CreateCourse() {
    async function createCourse(formData: FormData) {
        "use server";
        const forClass = formData.get("class");
        const title = formData.get("title");

        try {
            const response = await prisma.course.create({
                data: {
                    forClass,
                    title,
                },
            });
            console.log(response);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Create Course</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form action={createCourse} className="space-y-4">
                        <Label >Class</Label>
                        <Input id="class" type="text" name="class" placeholder="Enter class" />

                        <Label >Title</Label>
                        <Input id="title" type="text" name="title" placeholder="Enter title" />
                        <Button type="submit">Create</Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Form from "next/form";
import { createCourse } from "@/actions/course";

export default function CreateCourse() {

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Create Course</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form action={createCourse} className="space-y-4">
                        <Label>Class</Label>
                        <Select name="class">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NINE">Nine</SelectItem>
                                <SelectItem value="TEN">Ten</SelectItem>
                                <SelectItem value="HSC_1ST">HSC 1st Year</SelectItem>
                                <SelectItem value="HSC_2ND">HSC 2nd Year</SelectItem>
                                <SelectItem value="ADM_ENG">Admission Eng</SelectItem>
                                <SelectItem value="ADM_MED">Admission Med</SelectItem>
                                <SelectItem value="ADM_UNI">Admission Uni</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label>Title</Label>
                        <Input id="title" type="text" name="title" placeholder="Enter course title" />

                        <Label>Batch Time</Label>
                        <Select name="batchTime">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Batch Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SAT">Sat, Mon, Wed</SelectItem>
                                <SelectItem value="SUN">Sun, Tue, Thu</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label>Course Fee</Label>
                        <Input id="courseFee" type="number" name="courseFee" placeholder="Enter course fee" />

                        <Label>Is Active</Label>
                        <Select name="isActive">
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button type="submit">Create</Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

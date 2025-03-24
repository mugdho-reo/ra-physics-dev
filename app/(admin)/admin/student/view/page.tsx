"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import Form from "next/form";
import { getStudentByRoll, updateStudent, deleteStudent } from "@/actions/student";

export default function ViewStudent() {
    const [studentData, setStudentData] = useState(null); // local state for student data
    const [deleteResponse, setDeleteResponse] = useState(null);

    // Fetch student by roll
    const fetchStudent = async (formData: FormData) => {
        const response = await getStudentByRoll(formData);
        if (response.error) {
            setStudentData(null); // Clear student data if error
        } else {
            setStudentData(response); // Set fetched student data
        }
    };

    // Update student data
    const updateStudentData = async (formData: FormData) => {
        const response = await updateStudent(formData);
        if (response.error) {
            alert(response.error); // Display an error message
        } else {
            setStudentData(response); // Update the student data after successful update
        }
    };

    // Delete student
    const removeStudent = async (formData: FormData) => {
        const response = await deleteStudent(formData);
        setDeleteResponse(response);
        setStudentData(null); // Clear student data after delete
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-lg">Search Student</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form action={fetchStudent} className="flex flex-col space-y-4">
                        <label className="text-sm text-muted-foreground">Roll</label>
                        <Input type="number" name="roll" required />
                        <Button type="submit" className="w-full">Get Student</Button>
                    </Form>
                </CardContent>
            </Card>

            {studentData?.error && <p className="text-red-500 mt-4">{studentData.error}</p>}
            {studentData?.name && (
                <Card className="w-full max-w-md mt-6">
                    <CardHeader>
                        <CardTitle className="text-center text-lg">Student Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form action={updateStudentData} className="space-y-2 text-sm">
                            <input type="hidden" name="roll" value={studentData.roll} />
                            <label>Name</label>
                            <Input type="text" name="name" defaultValue={studentData.name} />

                            <label>Nickname</label>
                            <Input type="text" name="nickname" defaultValue={studentData.nickname} />

                            <label>Phone</label>
                            <Input type="text" name="phone" defaultValue={studentData.phone} />

                            <label>Address</label>
                            <Input type="text" name="address" defaultValue={studentData.address} />

                            <label>Date of Birth</label>
                            <Input
                                type="date"
                                name="dob"
                                defaultValue={studentData.dob ? studentData.dob.toISOString().split('T')[0] : ""}
                            />

                            <label>Gender</label>
                            <Select name="gender" defaultValue={studentData.gender}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                </SelectContent>
                            </Select>

                            <label>Father's Name</label>
                            <Input type="text" name="fathersName" defaultValue={studentData.fathersName} />

                            <label>Father's Occupation</label>
                            <Input type="text" name="fathersOccupation" defaultValue={studentData.fathersOccupation} />

                            <label>Mother's Name</label>
                            <Input type="text" name="mothersName" defaultValue={studentData.mothersName} />

                            <label>Mother's Occupation</label>
                            <Input type="text" name="mothersOccupation" defaultValue={studentData.mothersOccupation} />

                            <label>HSC Batch</label>
                            <Input type="number" name="hscBatch" defaultValue={studentData.hscBatch} />

                            <label>Batch Time</label>
                            <Select name="batchTime" defaultValue={studentData.batchTime}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select batch time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SAT">Sat, Mon, Wed</SelectItem>
                                    <SelectItem value="SUN">Sun, Tue, Thu</SelectItem>
                                </SelectContent>
                            </Select>

                            <label>Current Class</label>
                            <Select name="currentClass" defaultValue={studentData.currentClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NINE">Nine</SelectItem>
                                    <SelectItem value="TEN">Ten</SelectItem>
                                    <SelectItem value="HSC_1ST">HSC 1st Year</SelectItem>
                                    <SelectItem value="HSC_2ND">HSC 2nd Year</SelectItem>
                                    <SelectItem value="ADM_ENG">Engineering Admission</SelectItem>
                                    <SelectItem value="ADM_MED">Medical Admission</SelectItem>
                                    <SelectItem value="ADM_UNI">University Admission</SelectItem>
                                </SelectContent>
                            </Select>

                            <label>Current Institute</label>
                            <Input type="text" name="currentInstitute" defaultValue={studentData.currentInstitute} />

                            <div className="flex justify-between mt-4">
                                <Button type="submit" className="w-1/2 mr-2">Update</Button>
                            </div>
                        </Form>

                        {/* Delete Student */}
                        <Form action={removeStudent} className="w-full mt-2">
                            <input type="hidden" name="roll" value={studentData.roll} />
                            <Button type="submit" variant="destructive" className="w-full">Delete</Button>
                        </Form>
                    </CardContent>
                </Card>
            )}

            {/* Show delete response */}
            {deleteResponse?.message && (
                <p className="text-green-500 mt-4">{deleteResponse.message}</p>
            )}
        </div>
    );
}

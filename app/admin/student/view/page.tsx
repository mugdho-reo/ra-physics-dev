"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import Form from "next/form";
import { redirect } from "next/dist/server/api-utils";

export default function ViewStudent() {
    const [response, setResponse] = useState({
        name: "",
        nickname: "",
        roll: "",
        phone: "",
        address: "",
        dob: "",
        gender: "",
        fathersName: "",
        fathersOccupation: "",
        mothersName: "",
        mothersOccupation: "",
        hscBatch: "",
        batchTime: "",
        currentClass: "",
        currentInstitute: "",
        error: ""
    });

    const [editableData, setEditableData] = useState(response);

    async function searchStudent(formData: FormData) {
        const roll = formData.get("roll");
        try {
            const res = await fetch("/api/student/get", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roll }),
            });
            const data = await res.json();
            setResponse(data);
            setEditableData(data);
        } catch (error) {
            console.error("Error fetching student:", error);
            setResponse({ error: "Failed to fetch student" });
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setEditableData((prev) => ({ ...prev, [name]: value }));
    }
    async function handleUpdate() {
        const studentData = editableData;
        try {
            const res = await fetch("/api/student/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(studentData),
            });
            const data = await res.json();
            setResponse(data);
            setEditableData(data);
        } catch (error) {
            console.error("Error updating student:", error);
            setResponse({ error: "Failed to update student" });
        }
    }

    async function handleDelete() {
        const roll = editableData.roll;
        try {
            const res = await fetch("/api/student/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roll }),
            });

        } catch (error) {
            console.error("Error deleting student:", error);
            setResponse({ error: "Failed to delete student" });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-lg">Search Student</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form action={searchStudent} className="flex flex-col space-y-4">
                        <label className="text-sm text-muted-foreground">Roll</label>
                        <Input type="number" name="roll" required />
                        <Button type="submit" className="w-full">Get Student</Button>
                    </Form>
                </CardContent>
            </Card>
            {response.error && <p className="text-red-500 mt-4">{response.error}</p>}
            {response.name && (
                <Card className="w-full max-w-md mt-6">
                    <CardHeader>
                        <CardTitle className="text-center text-lg">Student Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <label>Name</label>
                        <Input type="text" name="name" value={editableData.name} onChange={handleChange} />

                        <label>Nickname</label>
                        <Input type="text" name="nickname" value={editableData.nickname} onChange={handleChange} />

                        <label>Phone</label>
                        <Input type="text" name="phone" value={editableData.phone} onChange={handleChange} />

                        <label>Address</label>
                        <Input type="text" name="address" value={editableData.address} onChange={handleChange} />

                        <label>Date of Birth</label>
                        <Input type="date" name="dob" value={editableData.dob ? editableData.dob.split('T')[0] : ""} onChange={handleChange} />

                        <label>Gender</label>
                        <Select name="gender" value={editableData.gender} onValueChange={(value) => setEditableData(prev => ({ ...prev, gender: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectContent>
                        </Select>

                        <label>Father's Name</label>
                        <Input type="text" name="fathersName" value={editableData.fathersName} onChange={handleChange} />

                        <label>Father's Occupation</label>
                        <Input type="text" name="fathersOccupation" value={editableData.fathersOccupation} onChange={handleChange} />

                        <label>Mother's Name</label>
                        <Input type="text" name="mothersName" value={editableData.mothersName} onChange={handleChange} />

                        <label>Mother's Occupation</label>
                        <Input type="text" name="mothersOccupation" value={editableData.mothersOccupation} onChange={handleChange} />

                        <label>HSC Batch</label>
                        <Input type="number" name="hscBatch" value={editableData.hscBatch} onChange={handleChange} />

                        <label>Batch Time</label>
                        <Select name="batchTime" value={editableData.batchTime} onValueChange={(value) => setEditableData(prev => ({ ...prev, batchTime: value }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select batch time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SAT">Sat, Mon, Wed</SelectItem>
                                <SelectItem value="SUN">Sun, Tue, Thu</SelectItem>
                            </SelectContent>
                        </Select>

                        <label>Current Class</label>
                        <Select name="currentClass" value={editableData.currentClass} onValueChange={(value) => setEditableData(prev => ({ ...prev, currentClass: value }))}>
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
                        <Input type="text" name="currentInstitute" value={editableData.currentInstitute} onChange={handleChange} />

                        <div className="flex justify-between mt-4">
                            <Button onClick={handleUpdate} className="w-1/2 mr-2" >Update</Button>
                            <Button onClick={handleDelete} className="w-1/2" variant={"destructive"}>Delete</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

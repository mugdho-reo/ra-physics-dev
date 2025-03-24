"use client";

import { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { completeStudent, deleteStudent, getStudentById } from "@/actions/student";

export default function CompleteStudentProfile() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editableData, setEditableData] = useState({
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
    });

    // Fetch student data on mount
    useEffect(() => {
        async function fetchStudent() {
            if (!session?.user?.id) return;

            try {
                const id = session.user.id;
                const res = await getStudentById(parseInt(id));
                if (!res) {
                    throw new Error("Failed to fetch student details.");
                }
                setEditableData(res);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStudent();
    }, [session]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setEditableData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleUpdate() {
        setLoading(true);
        setError(null);
        try {
            const updatedData = await completeStudent(editableData);

            if (updatedData.error) {
                throw new Error(updatedData.error);
            }

            setEditableData(updatedData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("roll", editableData.roll);

            const res = await deleteStudent(formData);

            if (res.error) {
                throw new Error(res.error);
            }

            setEditableData({
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
            });

            setError("Student profile deleted.");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }


    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted">
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <Card className="w-full max-w-md mt-6">
                <CardHeader>
                    <CardTitle className="text-center text-lg">Complete Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <label>Name</label>
                    <Input type="text" name="name" value={editableData.name || ""} onChange={handleChange} />

                    <label>Nickname</label>
                    <Input type="text" name="nickname" value={editableData.nickname || ""} onChange={handleChange} />

                    <label>Phone</label>
                    <Input type="text" name="phone" value={editableData.phone || ""} onChange={handleChange} />

                    <label>Address</label>
                    <Input type="text" name="address" value={editableData.address || ""} onChange={handleChange} />

                    <label>Date of Birth</label>
                    <Input
                        type="date"
                        name="dob"
                        value={editableData.dob ? new Date(editableData.dob).toISOString().split("T")[0] : ""}
                        onChange={handleChange}
                    />


                    <label>Gender</label>
                    <Select name="gender" value={editableData.gender || "MALE"} defaultValue={"MALE"} onValueChange={(value) => setEditableData(prev => ({ ...prev, gender: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                    </Select>

                    <label>Father's Name</label>
                    <Input type="text" name="fathersName" value={editableData.fathersName || ""} onChange={handleChange} />

                    <label>Father's Occupation</label>
                    <Input type="text" name="fathersOccupation" value={editableData.fathersOccupation || ""} onChange={handleChange} />

                    <label>Mother's Name</label>
                    <Input type="text" name="mothersName" value={editableData.mothersName || ""} onChange={handleChange} />

                    <label>Mother's Occupation</label>
                    <Input type="text" name="mothersOccupation" value={editableData.mothersOccupation || ""} onChange={handleChange} />

                    <label>HSC Batch</label>
                    <Input type="number" name="hscBatch" value={editableData.hscBatch || ""} onChange={handleChange} />

                    <label>Batch Time</label>
                    <Select name="batchTime" value={editableData.batchTime || "SAT"} defaultValue={"SAT"} onValueChange={(value) => setEditableData(prev => ({ ...prev, batchTime: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select batch time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SAT">Sat, Mon, Wed</SelectItem>
                            <SelectItem value="SUN">Sun, Tue, Thu</SelectItem>
                        </SelectContent>
                    </Select>

                    <label>Current Class</label>
                    <Select name="currentClass" value={editableData.currentClass || "NINE"} defaultValue={"NINE"} onValueChange={(value) => setEditableData(prev => ({ ...prev, currentClass: value }))}>
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
                    <Input type="text" name="currentInstitute" value={editableData.currentInstitute || ""} onChange={handleChange} />

                    <div className="flex justify-between mt-4">
                        <Button onClick={handleUpdate} className="w-1/2 mr-2" disabled={loading}>Update</Button>
                        <Button onClick={handleDelete} className="w-1/2" variant="destructive" disabled={loading}>Delete</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

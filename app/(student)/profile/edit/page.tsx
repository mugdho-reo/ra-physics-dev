"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { completeStudent, getStudentById } from "@/actions/student";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditStudentProfile() {
    const { data: session, status } = useSession();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
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

    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/profile/login");
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchStudent() {
            if (!session?.user?.id) return;

            try {
                setLoading(true);
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
        setError(null);
        try {
            const updatedData = await completeStudent(editableData);

            if (updatedData.error) {
                throw new Error(updatedData.error);
            }

            setEditableData(updatedData);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="border-0 shadow-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Student Profile</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={editableData.name || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nickname</label>
                                <Input
                                    type="text"
                                    name="nickname"
                                    value={editableData.nickname || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <Input
                                    type="text"
                                    name="phone"
                                    value={editableData.phone || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                                <Input
                                    type="date"
                                    name="dob"
                                    value={editableData.dob ? new Date(editableData.dob).toISOString().split("T")[0] : ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Gender</label>
                                <Select
                                    name="gender"
                                    value={editableData.gender || "MALE"}
                                    onValueChange={(value) => setEditableData((prev) => ({ ...prev, gender: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Academic Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Current Institute</label>
                                <Input
                                    type="text"
                                    name="currentInstitute"
                                    value={editableData.currentInstitute || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Current Class</label>
                                <Select
                                    name="currentClass"
                                    value={editableData.currentClass || "NINE"}
                                    onValueChange={(value) => setEditableData((prev) => ({ ...prev, currentClass: value }))}
                                >
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
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">HSC Batch</label>
                                <Input
                                    type="number"
                                    name="hscBatch"
                                    value={editableData.hscBatch || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Batch Time</label>
                                <Select
                                    name="batchTime"
                                    value={editableData.batchTime || "SAT"}
                                    onValueChange={(value) => setEditableData((prev) => ({ ...prev, batchTime: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select batch time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SAT">Sat, Mon, Wed</SelectItem>
                                        <SelectItem value="SUN">Sun, Tue, Thu</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Family Information */}
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Family Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Father's Name</label>
                                    <Input
                                        type="text"
                                        name="fathersName"
                                        value={editableData.fathersName || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Father's Occupation</label>
                                    <Input
                                        type="text"
                                        name="fathersOccupation"
                                        value={editableData.fathersOccupation || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mother's Name</label>
                                    <Input
                                        type="text"
                                        name="mothersName"
                                        value={editableData.mothersName || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mother's Occupation</label>
                                    <Input
                                        type="text"
                                        name="mothersOccupation"
                                        value={editableData.mothersOccupation || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2">Address</h3>
                        <div className="mt-3">
                            <Input
                                type="text"
                                name="address"
                                value={editableData.address || ""}
                                onChange={handleChange}
                                placeholder="Enter your full address"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <Button onClick={handleUpdate} className="w-full md:w-auto">
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
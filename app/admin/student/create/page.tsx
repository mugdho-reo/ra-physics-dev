import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Form from "next/form";

function generateRollNumber(hscBatch: number, studentClass: string, studentId: number) {
    const classMapping = {
        "NINE": "09",
        "TEN": "10",
        "HSC_1ST": "11",
        "HSC_2ND": "12",
        "ADM_ENG": "13",
        "ADM_MED": "14",
        "ADM_UNI": "15",
    };
    const classCode = classMapping[studentClass] || "00";
    const rollNumber = `${hscBatch}${classCode}${String(studentId).padStart(4, "0")}`;
    return rollNumber;
}

export default function CreateStudent() {
    async function createStudent(formData: FormData) {
        "use server";
        const dobValue = formData.get("dob") as string | null;
        const dob = dobValue ? new Date(dobValue) : null;

        const data = {
            name: formData.get("name"),
            fathersName: formData.get("fathersName"),
            fathersOccupation: formData.get("fathersOccupation"),
            mothersName: formData.get("mothersName"),
            mothersOccupation: formData.get("mothersOccupation"),
            address: formData.get("address"),
            phone: formData.get("phone"),
            nickname: formData.get("nickname"),
            dob: dobValue ? new Date(dobValue) : new Date(),
            gender: formData.get("gender"),
            currentInstitute: formData.get("currentInstitute"),
            currentClass: formData.get("currentClass"),
            hscBatch: parseInt(formData.get("hscBatch")),
            batchTime: formData.get("batchTime"),
        };

        try {
            const student = await prisma.student.create({
                data
            }
            );
            const rollNumber = generateRollNumber(data.hscBatch, data.currentClass, student.id);
            await prisma.student.update({
                where: { id: student.id },
                data: { roll: parseInt(rollNumber, 10) },
            });
            console.log("Student created with roll number:", rollNumber);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Create Student</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form action={createStudent} className="space-y-4">
                        <Label>Name</Label>
                        <Input id="name" type="text" name="name" placeholder="Enter name" required />

                        <Label>Father's Name</Label>
                        <Input id="fathersName" type="text" name="fathersName" placeholder="Enter father's name" required />
                        <Label>Father's Occupation</Label>
                        <Input id="fathersOccupation" type="text" name="fathersOccupation" placeholder="Enter father's occupation" required />

                        <Label>Mother's Name</Label>
                        <Input id="mothersName" type="text" name="mothersName" placeholder="Enter mother's name" required />
                        <Label>Mother's Occupation</Label>
                        <Input id="mothersOccupation" type="text" name="mothersOccupation" placeholder="Enter mother's occupation" required />

                        <Label>Address</Label>
                        <Input id="address" type="text" name="address" placeholder="Enter address" required />

                        <Label>Phone</Label>
                        <Input id="phone" type="text" name="phone" placeholder="Enter phone number" required />

                        <Label>Nickname</Label>
                        <Input id="nickname" type="text" name="nickname" placeholder="Enter nickname" />

                        <Label>Date of Birth</Label>
                        <Input id="dob" type="date" name="dob" required />

                        <Label>Gender</Label>
                        <Select name="gender" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label>Current Institute</Label>
                        <Input id="currentInstitute" type="text" name="currentInstitute" placeholder="Enter current institute" required />

                        <Label>Current Class</Label>
                        <Select name="currentClass" required>
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

                        <Label>Batch Time</Label>
                        <Select name="batchTime" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SAT">Sat, Mon, Wed</SelectItem>
                                <SelectItem value="SUN">Sun, Tue, Thu</SelectItem>
                            </SelectContent>
                        </Select>

                        <Label>HSC Batch</Label>
                        <Input id="hscBatch" type="text" name="hscBatch" placeholder="Enter HSC batch year (e.g., 22)" required />

                        <Button type="submit" className="w-full">Create Student</Button>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

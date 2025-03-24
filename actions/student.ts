"use server"
import prisma from "@/lib/prisma";

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

//done
export async function createStudent(formData: FormData) {
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

//done
export async function getStudentByRoll(formData: FormData) {
    const roll = formData.get("roll") as string;
    if (!roll) return { error: "Roll number is required" };

    try {
        const id = parseInt(roll.slice(-4));
        const student = await prisma.student.findUnique({
            where: { id },
            include: { courses: true },
        });

        if (!student) return { error: "Student not found" };
        return student;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export async function getStudentById(id: number) {
    if (!id) return { error: "Roll number is required" };

    try {
        const student = await prisma.student.findUnique({
            where: { id },
            include: { courses: true },
        });

        if (!student) return { error: "Student not found" };
        return student;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

//done
export async function updateStudent(formData: FormData) {
    try {
        let studentData: any = Object.fromEntries(formData);

        // Extract values from the formData
        let {
            roll,
            name,
            fathersName,
            fathersOccupation,
            mothersName,
            mothersOccupation,
            address,
            phone,
            nickname,
            dob, // Use dob directly instead of dobValue
            gender,
            currentInstitute,
            currentClass,
            hscBatch,
            batchTime
        } = studentData;

        // Parse DOB and ensure it's a valid date
        const parsedDob = dob ? new Date(dob) : new Date(); // Ensure valid Date format

        // Convert the roll number to an id (assuming roll number is part of the id)
        const id = parseInt(String(roll).slice(-4));
        hscBatch = parseInt(hscBatch);

        // Update the student data in the database
        const updatedStudent = await prisma.student.update({
            where: { id },
            data: {
                name,
                fathersName,
                fathersOccupation,
                mothersName,
                mothersOccupation,
                address,
                phone,
                nickname,
                dob: parsedDob, // Use the parsed dob
                gender,
                currentInstitute,
                currentClass,
                hscBatch,
                batchTime
            }
        });

        return updatedStudent;
    } catch (error) {
        return { error: "Failed to update student" };
    }
}

//done
export async function deleteStudent(formData: FormData) {
    try {
        const rollValue = formData.get("roll");
        if (!rollValue) {
            return { error: "Roll number is required" };
        }
        const id = parseInt(rollValue.toString().slice(-4));
        console.log(id);
        await prisma.student.delete({ where: { id } });
        return { message: "Student deleted successfully" };
    } catch (error) {
        return { error: "Failed to delete student" };
    }
}

export async function completeStudent(studentData: any) {
    try {
        let {
            roll,
            id,
            name,
            fathersName,
            fathersOccupation,
            mothersName,
            mothersOccupation,
            address,
            phone,
            nickname,
            dob,
            gender,
            currentInstitute,
            currentClass,
            hscBatch,
            batchTime
        } = studentData;

        if (!id) {
            throw new Error("Student ID is required");
        }

        // Ensure dob is a valid Date object
        dob = dob ? new Date(dob) : null;
        hscBatch = parseInt(hscBatch);
        roll = parseInt(generateRollNumber(hscBatch, currentClass, id));
        const updatedStudent = await prisma.student.update({
            where: { id },
            data: {
                roll,
                name,
                fathersName,
                fathersOccupation,
                mothersName,
                mothersOccupation,
                address,
                phone,
                nickname,
                dob,
                gender,
                currentInstitute,
                currentClass,
                hscBatch,
                batchTime
            }
        });

        return updatedStudent;
    } catch (error) {
        console.error("Failed to update student:", error);
        return { error: "Failed to update student" };
    }
}
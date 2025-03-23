import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
    try {
        // Parse the incoming JSON data
        const studentData = await req.json();

        // Extract values from the request body
        let {
            roll,
            id, // Ensure id is passed directly, or fallback to roll-based extraction
            name,
            fathersName,
            fathersOccupation,
            mothersName,
            mothersOccupation,
            address,
            phone,
            nickname,
            dobValue,
            gender,
            currentInstitute,
            currentClass,
            hscBatch,
            batchTime
        } = studentData;

        // Parse DOB and ensure it's a valid date
        const dob = dobValue ? new Date(dobValue) : new Date();
        hscBatch = parseInt(hscBatch);
        roll = parseInt(generateRollNumber(hscBatch, currentClass, id));
        // Update the student data in the database
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

        return NextResponse.json(updatedStudent);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

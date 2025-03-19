import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Parse the incoming JSON data
        const studentData = await req.json();

        // Extract values from the request body
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
            dobValue,
            gender,
            currentInstitute,
            currentClass,
            hscBatch,
            batchTime
        } = studentData;

        // Parse DOB and ensure it's a valid date
        const dob = dobValue ? new Date(dobValue) : new Date();

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

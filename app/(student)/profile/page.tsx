import { auth } from "@/auth"; // Import auth from your NextAuth configuration
import { redirect } from "next/navigation";

const StudentProfile = async () => {
    const session = await auth(); // Get session data

    // If user is not authenticated, redirect to login page
    if (!session?.user) {
        redirect("/profile/login");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4 text-center">Student Profile</h1>
                <p className="text-gray-700"><strong>Phone:</strong> {session.user.phone}</p>
                <p className="text-gray-700"><strong>ID:</strong> {session.user.id}</p>
            </div>
        </div>
    );
};

export default StudentProfile;

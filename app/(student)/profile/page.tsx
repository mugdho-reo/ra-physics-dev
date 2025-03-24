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
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Student Profile</h1>

                {/* Student Information */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Name:</span>
                        <span className="text-gray-800">{session.user.name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Phone:</span>
                        <span className="text-gray-800">{session.user.phone}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">ID:</span>
                        <span className="text-gray-800">{session.user.id}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Roll Number:</span>
                        <span className="text-gray-800">{session.user.roll}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Date of Birth:</span>
                        <span className="text-gray-800">{new Date(session.user.dobValue).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Gender:</span>
                        <span className="text-gray-800">{session.user.gender}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Institute:</span>
                        <span className="text-gray-800">{session.user.currentInstitute}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Current Class:</span>
                        <span className="text-gray-800">{session.user.currentClass}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">HSC Batch:</span>
                        <span className="text-gray-800">{session.user.hscBatch}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Batch Time:</span>
                        <span className="text-gray-800">{session.user.batchTime}</span>
                    </div>
                </div>

                {/* Button to logout or redirect to edit */}
                <div className="mt-8 flex justify-center gap-4">
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Edit Profile
                    </button>
                    <button
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;

import { auth } from "@/auth";
import SignOutButton from "@/components/SignOutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const StudentProfile = async () => {
    const session = await auth();

    if (!session?.user) {
        redirect("/profile/login");
    }

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name.split(' ').map(part => part[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-3xl font-bold text-gray-900">{session.user.name}</h1>
                    <div className="mt-2 flex gap-2">
                        <Badge variant="secondary" className="text-sm">
                            {session.user.currentClass}
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                            {session.user.batchTime}
                        </Badge>
                    </div>
                </div>

                {/* Profile Information */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-blue-600 px-6 py-4">
                        <CardTitle className="text-white text-xl">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="mt-1 text-gray-900">{session.user.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                                    <p className="mt-1 text-gray-900">
                                        {new Date(session.user.dobValue).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Gender</p>
                                    <p className="mt-1 text-gray-900">{session.user.gender}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Student ID</p>
                                    <p className="mt-1 text-gray-900">{session.user.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Roll Number</p>
                                    <p className="mt-1 text-gray-900">{session.user.roll}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">HSC Batch</p>
                                    <p className="mt-1 text-gray-900">{session.user.hscBatch}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Academic Information */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-blue-600 px-6 py-4">
                        <CardTitle className="text-white text-xl">Academic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Current Institute</p>
                                <p className="mt-1 text-gray-900">{session.user.currentInstitute}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Current Class</p>
                                <p className="mt-1 text-gray-900">{session.user.currentClass}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Batch Schedule</p>
                                <p className="mt-1 text-gray-900">{session.user.batchTime}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-center gap-4 pt-6">
                    <Link href={"/profile/edit"}>
                        <Button size="lg" className="px-8">
                            Edit Profile
                        </Button>
                    </Link>
                    <SignOutButton />
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
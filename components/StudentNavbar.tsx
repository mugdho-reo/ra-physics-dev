"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import SignOutButton from "./SignOutButton";

const StudentNavBar = () => {
    const { data: session } = useSession();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sticky top-0 z-50 p-4 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm flex items-center justify-between"
        >
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">RA</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                    Physics
                </span>
            </Link>

            {/* Navigation Links */}
            {session?.user && (
                <div className="hidden md:flex items-center space-x-1 bg-gray-100/50 rounded-full p-1">
                    <NavLink href="/profile" icon="👤" label="Profile" />
                    <NavLink href="/profile/courses" icon="📚" label="Courses" />
                    <NavLink href="/profile/edit" icon="✏️" label="Edit" />
                </div>
            )}

            {/* User/Auth Section */}
            <div className="flex items-center space-x-4">
                {session?.user ? (
                    <>
                        <div className="hidden md:flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">
                                {session.user.name?.split(" ")[0] || "User"}
                            </span>
                        </div>
                        <SignOutButton className="hidden md:block" />
                    </>
                ) : (
                    <Link href="/profile/login">
                        <Button
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
                            size="sm"
                        >
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </motion.nav>
    );
};

// Reusable NavLink component
const NavLink = ({ href, icon, label }: { href: string; icon: string; label: string }) => {
    return (
        <Link href={href}>
            <Button
                variant="ghost"
                className="rounded-full px-4 py-2 text-gray-600 hover:text-black hover:bg-white transition-all"
            >
                <span className="mr-2">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
            </Button>
        </Link>
    );
};

export default StudentNavBar;
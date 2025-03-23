// async function handleSubmit(formData: FormData) {
//     setError(null);
//     setLoading(true);
//     const data = {
//         phone: formData.get("phone"),
//         password: formData.get("password"),
//     };

//     try {
//         const res = await fetch("/api/student/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(data),
//         });

//         if (!res.ok) {
//             const errorMessage = await res.text();
//             throw new Error(errorMessage || "Login failed");
//         }

//         // Success response
//         alert("Login successful! 🎉");
//         router.push("/"); // Redirect to dashboard
//     } catch (error) {
//         console.error("Login error:", error);
//         setError("Invalid phone or password. Please try again.");
//     } finally {
//         setLoading(false);
//     }
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Icon for loading state
import { motion } from "framer-motion"; // Smooth animations
import { signIn } from "next-auth/react";

const StudentLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const phone = formData.get("phone") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                redirect: false,
                phone,
                password,
            });

            if (result?.error) {
                setError("Invalid phone or password. Please try again.");
            } else {
                router.push("/profile/complete"); // Redirect to home or dashboard
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-6">
                    <CardHeader>
                        <CardTitle className="text-center text-white text-2xl font-bold">
                            Student Login
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-white">Phone</Label>
                                <Input type="number" id="phone" name="phone" required className="bg-white/20 text-white placeholder-gray-300 border-none" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">Password</Label>
                                <Input type="password" id="password" name="password" required className="bg-white/20 text-white placeholder-gray-300 border-none" />
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-all"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default StudentLogin;

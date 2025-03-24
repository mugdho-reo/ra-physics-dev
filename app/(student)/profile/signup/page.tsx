"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { studentSignUp } from "@/actions/credentials"; // Import server action

const StudentSignUp = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            const response = await studentSignUp(formData); // Call server action

            if (response.error) {
                throw new Error(response.error);
            }

            alert("Signup successful! 🎉");
            router.push("/profile/login");
        } catch (error) {
            console.error("Signup error:", error);
            setError(error.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

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
                            Student Signup
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
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default StudentSignUp;

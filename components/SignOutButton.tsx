"use client"
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'

const SignOutButton = () => {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            <Button
                onClick={() => signOut({ callbackUrl: '/profile/login' })}
                variant="outline"
                className="group flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400 transition-colors duration-200"
            >
                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span className="font-medium">Sign Out</span>
            </Button>
        </motion.div>
    )
}

export default SignOutButton
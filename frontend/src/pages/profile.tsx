import { RootState } from "@/store/store"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LucideArrowLeft, LucideEdit, LogOut, RotateCcw } from "lucide-react"
import React from "react"
import { useSelector } from "react-redux"

const Profile: React.FC = () => {
    const currentUser = useSelector((state: RootState) => state.auth.user)
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="max-w-sm md:w-full w-80 dark:border-2 dark:border-gray-700 rounded-lg p-6 shadow-md">
                <div className="back mb-4">
                    <Button onClick={() => navigate("/")}>
                        <LucideArrowLeft size={18} />
                        Home
                    </Button>
                </div>
                <div className="flex flex-col items-center  justify-center">
                    <div className="relative group">
                        <img
                            className="w-24 h-24 rounded-full shadow-lg"
                            src={currentUser?.avatar}
                            alt="Profile"
                        />
                        <Link
                            to="/r/avatar"
                            className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow text-black "
                        >
                            <LucideEdit size={16} />
                        </Link>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-gray-500">
                            Username:
                        </h2>
                        <span>{currentUser?.username}</span>
                        <Link
                            to={`/r/credentails/reset?username=${currentUser?.username}`}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <LucideEdit size={16} />
                        </Link>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <p className=" text-gray-500 font-bold text-2xl">
                            Email:
                        </p>
                        <span>{currentUser?.email}</span>
                        <Link
                            to={`/r/credentails/reset?email=${currentUser?.email}`}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <LucideEdit size={16} />
                        </Link>
                    </div>
                    <Button
                        onClick={() => navigate("/reset/passwd")}
                        className="mt-4 dark:text-black flex gap-2 text-white hover"
                    >
                        Reset Password
                        <RotateCcw size={15} />
                    </Button>
                    <Link
                        to="/auth/logout"
                        className="mt-4 text-red-500 hover flex gap-2"
                    >
                        log out
                        <LogOut size={20} />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Profile

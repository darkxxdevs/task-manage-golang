import React from "react"
import { useParams } from "react-router-dom"
import { LoginForm, SignupForm } from "@/components"

const Auth: React.FC = () => {
    const { type } = useParams<{ type: string }>()

    return (
        <div className="w-full h-full mx-[1%] flex items-center flex-col gap-2 justify-center">
            {type === "login" ? (
                <div className="w-full flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold">Welcome</span>
                    Back!
                </div>
            ) : (
                <div className="w-full flex items-center gap-2 justify-center font-semibold">
                    <span className="text-5xl font-bold">Sign</span>
                    Up!
                </div>
            )}
            {type === "login" ? <LoginForm /> : <SignupForm />}
        </div>
    )
}

export default Auth

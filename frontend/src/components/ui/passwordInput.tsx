import React from "react"
import { EyeOff, Eye } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        const [isVisible, setIsVisible] = React.useState<boolean>(false)

        const togglePasswordVisibility = () => {
            setIsVisible(!isVisible)
        }

        return (
            <div
                className={`flex gap-1 border-1 px-2 rounded-[10px] border-black ${className} border`}
            >
                <input
                    type={isVisible ? "text" : "password"}
                    className={cn(
                        "flex h-10 w-full rounded-md  border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    ref={ref}
                    {...props}
                />
                <div
                    className="eye flex items-center justify-center"
                    onClick={() => togglePasswordVisibility()}
                >
                    {isVisible ? <EyeOff /> : <Eye />}
                </div>
            </div>
        )
    }
)
PasswordInput.displayName = "PasswordInput"

export default PasswordInput

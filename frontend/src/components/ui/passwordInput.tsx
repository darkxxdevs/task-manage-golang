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
                        "outline-none border-0 p-2 w-full placeholder:text-sm placeholder:text-gray-200"
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

import React from "react"
import ServerCrashSvg from "../../assets/server_crash.svg"
import { Button } from "@/components/ui/button"
import { ApiResponse } from "@/types/ApiResponse"
import { AxiosError } from "axios"

interface FallbackProps {
    error: AxiosError<ApiResponse>
}

const Fallback: React.FC<FallbackProps> = ({ error }) => {
    const refereshPage = () => {
        window.location.reload()
    }

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h1 className="text-6xl flex items-center justify-center  gap-2 font-bold">
                Aw snap!
                <span>
                    <img className="h-16" src={ServerCrashSvg} alt="" />
                </span>
            </h1>
            <h2 className="text-black">{error.response?.data.message}</h2>
            <p>{error?.status}</p>
            <p>Please try again later</p>

            <Button
                onClick={() => refereshPage()}
                className="bg-black text-white font-bold rounded-[10px] hover:bg-[#1e1e2e] w-full mt-4"
            >
                refresh
            </Button>
        </div>
    )
}

export default Fallback

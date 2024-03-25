import React from "react"
import ServerCrashSvg from "../../assets/server_crash.svg"

const Fallback: React.FC<{ error: Error }> = ({ error }) => {
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
            <h2 className="text-black">We are having issues!</h2>
            <p>{error?.message}</p>
            <p>Please Try again later sometime</p>

            <button
                onClick={() => refereshPage()}
                className="bg-black p-3 mt-3 rounded-md text-white font-bold"
            >
                refresh
            </button>
        </div>
    )
}

export default Fallback

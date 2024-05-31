import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader"
import React, { CSSProperties } from "react"
import { useTheme } from "@/components/ui/theme/theme-provider"

interface LoaderProps {
    loading: boolean
    styles?: CSSProperties
}

const Spinner: React.FC<LoaderProps> = ({ loading, styles }) => {
    const theme = useTheme()
    return (
        <div className="container py-8 px-8">
            <ClimbingBoxLoader
                color={theme.theme === "dark" ? "#000000" : "#dddddd"}
                loading={loading}
                cssOverride={styles}
            />
        </div>
    )
}

export default Spinner

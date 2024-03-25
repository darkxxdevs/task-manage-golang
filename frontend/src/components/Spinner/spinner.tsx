import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader"
import React, { CSSProperties } from "react"

interface LoaderProps {
    color: string
    loading: boolean
    styles?: CSSProperties
}

const Spinner: React.FC<LoaderProps> = ({ color, loading, styles }) => {
    return (
        <div className="container py-8 px-8">
            <ClimbingBoxLoader
                color={color}
                loading={loading}
                cssOverride={styles}
            />
        </div>
    )
}

export default Spinner

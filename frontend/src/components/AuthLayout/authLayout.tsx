import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { useNavigate } from "react-router-dom"

interface AuthLayoutProps {
    authentication: boolean
    children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    authentication = true,
    children,
}) => {
    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate()
    const authStatus = useSelector(
        (state: RootState) => state.auth.isAuthenticated
    )

    useEffect(() => {
        if (authentication && authStatus !== authentication) {
            navigate("/auth/login")
        } else if (!authentication && authStatus !== authentication) {
            navigate("/")
        }
        setLoading(false)
    }, [authStatus, authentication, navigate])

    return loading ? <h1>Loading...</h1> : <>{children}</>
}

export default AuthLayout

import axios from "axios"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../store/store"
import { useNavigate } from "react-router-dom"
import { envVars } from "@/lib/validation"
import { logout } from "../store/authSlice"

const Logout: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    useEffect(() => {
        ;(async () => {
            try {
                const response = await axios.post(
                    `${envVars.VITE_SERVER_URL}/api/v1/auth/logout`
                )

                if (response.data) {
                    dispatch(logout())
                    navigate("/auth/login", {
                        replace: true,
                    })
                }
            } catch (error) {
                console.error("Error while logging out user!", error)
            }
        })()
    }, [])

    return null
}

export default Logout

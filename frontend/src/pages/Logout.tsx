import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../store/store"
import { useNavigate } from "react-router-dom"
import { logout } from "../store/authSlice"
import { apiClient } from "@/config/axios.config"

const Logout: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    useEffect(() => {
        ;(async () => {
            try {
                const response = await apiClient.post("/auth/logout")

                if (response.status === 200) {
                    dispatch(logout())
                    window.location.reload()
                    navigate("/auth/login")
                }
            } catch (error) {
                console.error(`error while logging out ${error}`)
            }
        })()
    }, [])

    return null
}

export default Logout

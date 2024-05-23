import { envVars } from "@/lib/validation"
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"

const apiClient = axios.create({
    withCredentials: true,
})

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig<any>) => {
        let accessToken = localStorage.getItem("access_token")
        const refreshToken = localStorage.getItem("refresh_token")

        if (!accessToken || !refreshToken) {
            return config
        }

        const { ExpiresAt } = JSON.parse(atob(accessToken.split(".")[1]))

        if (Date.now() >= ExpiresAt * 1000 - 5000) {
            try {
                const response = await axios.post(
                    `${envVars.VITE_SERVER_URL}/api/v1/auth/refresh-token`,
                    {
                        refresh_token: refreshToken,
                    }
                )

                if (response.data) {
                    accessToken = getCookie("access_token")
                    if (accessToken) {
                        localStorage.setItem("access_token", accessToken)
                    }
                }
            } catch (error) {
                console.error(`Axios config error: ${error}`)

                throw error
            }
        }

        config.headers = config.headers || {}

        config.headers.Authorization = `Bearer ${accessToken}`

        return config as InternalAxiosRequestConfig
    },

    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null

    return null
}

export default apiClient

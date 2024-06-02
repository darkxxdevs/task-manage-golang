import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios"
import { serverUrl } from "@/constants/apiServer"

const apiClient = axios.create({
    baseURL: serverUrl,
    withCredentials: true,
})

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig
        if (
            error.response &&
            error.response.status === 401 &&
            originalRequest._retry !== true
        ) {
            originalRequest._retry = true
            try {
                const response = await apiClient.post("/auth/refresh-token")
                if (response.status !== 200) {
                    localStorage.removeItem("vite-ui-theme")
                    localStorage.removeItem("user")
                    window.location.href = "/auth/login"
                }
                return apiClient(originalRequest)
            } catch (refreshError) {
                console.error("Error while refreshing token:", refreshError)
                localStorage.removeItem("vite-ui-theme")
                localStorage.removeItem("user")
                window.location.href = "/auth/login"
            }
        }
        return Promise.reject(error)
    }
)

export { apiClient }

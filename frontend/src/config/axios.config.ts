import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios"
import { getCookie } from "@/utils/cookies/cookie"
import { serverUrl } from "@/constants/apiServer"

const apiClient = axios.create({
    baseURL: serverUrl,
    withCredentials: true,
})

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem("accessToken")

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        if (!accessToken) {
            console.warn("accessToken not found")
        }

        return config as InternalAxiosRequestConfig
    },

    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = getCookie("refresh_token")

            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${serverUrl}/auth/refresh-token`,
                        {},
                        {
                            withCredentials: true,
                        }
                    )
                    const newAccessToken = response.data.accessToken

                    localStorage.setItem("accessToken", newAccessToken)

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

                    return axios(originalRequest)
                } catch (error) {
                    console.error(`Error while renewing accessToken ${error}`)

                    localStorage.removeItem("accessToken")
                }
            }
        }
        return Promise.reject(error)
    }
)

export { apiClient }

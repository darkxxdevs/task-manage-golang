import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { checkTokenExpiry } from "@/utils/cookies/cookie"
import { serverUrl } from "@/constants/apiServer"

const apiClient = axios.create({
    baseURL: serverUrl,
    withCredentials: true,
})

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig<any>) => {
        try {
            const isTokenExpired = checkTokenExpiry("access_token")

            if (isTokenExpired) {
                const response = await axios.post(
                    `${serverUrl}auth/refresh-token`,
                    {},
                    {
                        withCredentials: true,
                    }
                )

                const newAccessToken = response.data.accessToken
                if (newAccessToken) {
                    console.log("got new accessToken")
                }
                localStorage.setItem(
                    "access_token",
                    JSON.stringify(newAccessToken)
                )
            }

            const token = localStorage.getItem("access_token")

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        } catch (error) {
            console.error(`Error refreshing access_token : ${error}`)
        }

        return config as InternalAxiosRequestConfig
    },

    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

export { apiClient }

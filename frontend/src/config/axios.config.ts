import axios, { AxiosError } from "axios";
import store from "../store/store";
import { updateAccessToken } from "../store/authSlice";

axios.defaults.baseURL = `${import.meta.env.VITE_API_SERVER_URL}/api/v1`

const getAccessToeken = () => {
	const accessToken = store.getState().auth.user?.access_token
	return accessToken
}

axios.interceptors.request.use((config) => {
	const accessToken = getAccessToeken()
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}
	return config
})


axios.interceptors.response.use(response => response, async (error: AxiosError) => {
	if (error.response?.status === 401) {
		try {
			const response = await axios.post("/auth/refresh-token", {}, { withCredentials: true })

			if (response.status === 200) {
				const newAccessToken = response.data.access_token

				store.dispatch(updateAccessToken(newAccessToken))


				if (error.config) {
					error.config.headers.Authorization = `Bearer ${newAccessToken}`
				}
				return axios({
					method: error.config?.method,
					url: error.config?.url,
					data: error.config?.data
				})
			}

		} catch (RefreshError: unknown) {
			console.error("Failed to refresh token:", RefreshError);
		}
	}
	return Promise.reject(error)
})

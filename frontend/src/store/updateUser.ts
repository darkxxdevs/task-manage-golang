import { apiClient } from "@/config/axios.config"

const updateUser = async () => {
    const response = await apiClient.get("/auth/c/user")

    if (response.status === 200) {
        return response.data.current_user
    }

    throw new Error("User not found")
}

export default updateUser

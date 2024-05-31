import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface User {
    username: string
    avatar: string
    email: string
    access_token?: string
}

interface AuthState {
    isAuthenticated: boolean
    user: User | null
}

const getInitialState = (): AuthState => {
    const initialUser = localStorage.getItem("user")
    const initialAccessToken = localStorage.getItem("accessToken")

    if (initialUser && initialAccessToken) {
        return {
            isAuthenticated: true,
            user: JSON.parse(initialUser),
        }
    }

    return {
        isAuthenticated: false,
        user: null,
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState: getInitialState(),
    reducers: {
        login(state, action: PayloadAction<User>) {
            state.isAuthenticated = true
            state.user = action.payload
            localStorage.setItem(
                "accessToken",
                JSON.stringify(action.payload.access_token)
            )
            localStorage.setItem(
                "user",
                JSON.stringify({
                    username: action.payload.username,
                    email: action.payload.email,
                    avatar: action.payload.avatar,
                })
            )
        },
        logout(state) {
            state.isAuthenticated = false
            state.user = null
            localStorage.removeItem("vite-ui-theme")
        },
    },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
	username: string
	avatar: string
	email?: string
	access_token?: string
}

interface AuthState {
	isAuthenticated: boolean
	user: User | null
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null
}


const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login(state, action: PayloadAction<User>) {
			state.isAuthenticated = true
			state.user = action.payload
			localStorage.setItem("authStatus", JSON.stringify(state))
		},
		logout(state) {
			state.isAuthenticated = false
			state.user = null
			localStorage.removeItem("authStatus")
		},
		updateAccessToken(state, action: PayloadAction<string>) {
			if (state.user) {
				state.user.access_token = action.payload
				localStorage.setItem("authStatus", JSON.stringify(state))
			}
		}
	}
})


const storedAuthStatus = localStorage.getItem('authStatus')
if (storedAuthStatus) {
	const parsedAuthStatus: AuthState = JSON.parse(storedAuthStatus)
	initialState.isAuthenticated = parsedAuthStatus.isAuthenticated
	initialState.user = parsedAuthStatus.user
}



export const { login, logout, updateAccessToken } = authSlice.actions

export default authSlice.reducer

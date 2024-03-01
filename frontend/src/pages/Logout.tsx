import axios, { AxiosError } from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'

const Logout: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()


	useEffect(() => {
		(
			async () => {
				try {
					const response = await axios.post(`${import.meta.env.VITE_API_SERVER_URL}/api/v1/auth/logout`)

					if (response.data) {
						dispatch(logout())
						navigate("/auth/login", {
							replace: true
						})
					}
				} catch (error) {
					if (axios.isAxiosError(error)) {
						console.error(`[AxiosError] : ${error.response?.data.message}`)
					} else {
						const unknownError = error as AxiosError
						console.error(`[Error] : ${unknownError.message}`)
					}
				}
			}
		)()

	}, [])


	return null

}

export default Logout

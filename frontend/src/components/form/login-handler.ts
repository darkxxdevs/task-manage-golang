import axios, { AxiosError } from "axios"


interface LoginProps {
	url: string
	data: {
		email: string,
		password: string
	}
}


const createLogin = async (data: LoginProps) => {

	try {
		const response = await axios.post(data.url, {
			email: data.data.email,
			password: data.data.password
		},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		)

		console.log(response.data.account)

		return response.data.account

	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`[Error]: ${error.response?.data.message}`)
		} else {
			const unknownError = error as AxiosError
			console.error(`[Error] ${unknownError.message}`)
		}
	}

}

export default createLogin

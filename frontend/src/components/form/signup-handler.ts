import axios, { AxiosError } from "axios"


interface SignupProps {
	url: string
	data: {
		username: string
		email: string
		password: string
		avatar: FileList
	}
}

const createSignup = async (data: SignupProps) => {
	try {
		const response = await axios.post(data.url, {
			username: data.data.username,
			email: data.data.email,
			password: data.data.password,
			avatar: data.data.avatar[0]
		},
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

		console.log(`[Response]: ${response.data}`)

	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`[Error]: ${error.response?.data.message}`)
		} else {
			const unknownError = error as AxiosError
			console.error(`[Error]: ${unknownError.message}`)
		}

	}

}

export default createSignup

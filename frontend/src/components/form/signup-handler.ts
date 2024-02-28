import axios from "axios"


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

	} catch (error: any) {

		console.error(`[Error]: ${error.response.data.message}`)
	}

}

export default createSignup

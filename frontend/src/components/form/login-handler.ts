import axios from "axios"

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

		console.log(response.data)


	} catch (error: any) {
		console.error(`[Error]: ${error.response.data.message}`)
	}

}

export default createLogin

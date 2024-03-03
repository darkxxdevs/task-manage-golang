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
				},
				withCredentials: true
			}
		)

		localStorage.setItem("access_token", response.data.access_token)

		return response.data.account

	} catch (error) {
		return error
	}

}

export default createLogin

import axios from "axios"

interface LoginProps {
  url: string
  data: {
    email: string
    password: string
  }
}

const createLogin = async (data: LoginProps) => {
  try {
    const response = await axios.post(
      data.url,
      {
        email: data.data.email,
        password: data.data.password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      }
    )

    if (response.status === 404) {
      throw new Error("Account Not found!")
    }

    return response.data.account
  } catch (error) {
    throw error
  }
}

export default createLogin

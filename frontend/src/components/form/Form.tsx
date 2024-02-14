import React from 'react'
import axios from "axios"
import { useForm, SubmitHandler } from 'react-hook-form'

interface FormProps {
	type: string | undefined
}

type SingupInputs = {
	username: string
	password: string
	email: string
	avatar?: FileList
}

type LoginInputs = {
	email: string
	password: string
}

const Form: React.FC<FormProps> = ({ type }) => {
	const { register, handleSubmit, formState } = useForm<LoginInputs | SingupInputs>()

	const { isSubmitting } = formState


	const url = `${import.meta.env.VITE_API_SERVER_URL}/api/v1/auth/${type === "signup" ? "signup" : "login"}`

	const submitDetails: SubmitHandler<SingupInputs | LoginInputs> = async (data) => {
		try {
			let formData: SingupInputs | LoginInputs

			formData.email = data.email
			formData.password = data.password


			if (type === "signup" && 'avatar' in data) {

			}

			if (type === "signup" && 'username' in data) {
				formData.append("username", data.username)
			}


			console.log(formData)


			const response = await axios.post(url, data, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			})

			console.log("Response::", response.data)

		} catch (error: any) {
			console.error(`Error while authentication : ${error}`)
		}
	}


	return (
		<form onSubmit={handleSubmit(submitDetails)} className='flex flex-col min-w-[30%] '>
			{
				isSubmitting ? "loading..." : (
					<>
						<div className="title w-full flex items-center justify-center ">
							{
								type === "signup" ? (
									<h2 className='font-bold text-2xl'>SignUp</h2>
								) : (
									<h2 className='font-bold text-2xl'>LogIn</h2>
								)
							}
						</div>
						{
							type === "signup" && (
								<>
									<label htmlFor="username">Username</label>
									<input type="text" className='bg-grey p-3 border-black border-2 rounded-2xl' {...register("username")} placeholder='enter a username' />
								</>
							)
						}
						<label htmlFor="email">Email</label>
						<input type="email" {...register("email")} className='bg-grey p-3 border-black border-2 rounded-2xl' placeholder='enter your email' />

						<label htmlFor="email">Password</label>
						<input type="password" {...register("password")} className='bg-grey p-3 border-black border-2 rounded-2xl' placeholder='enter your password' />
						{
							type === "signup" && (
								<>
									<label htmlFor="avatar">Avatar</label>
									<input type="file" {...register("avatar")} className=' text-grey cursor-pointer custom-upload-button rounded-2xl  ' placeholder='select a file' />
								</>
							)
						}

						<button type='submit' className='mt-5 p-3  rounded-2xl font-bold bg-black text-white'>{
							type === "signup" ? "Register" : "Login"

						}</button>
					</>

				)
			}
		</form>
	)
}

export default Form

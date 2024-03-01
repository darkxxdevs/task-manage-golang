import React from 'react'
import { useForm } from 'react-hook-form'
import createLogin from './login-handler'
import createSignup from './signup-handler'
import { LoginInputs, SingupInputs, FormInputs, FormProps, FormErrors } from './form-types'
import { Link } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { AppDispatch } from '../../store/store'
import { login } from '../../store/authSlice'


const Form: React.FC<FormProps> = ({ type }) => {
	const { register, handleSubmit, formState } = useForm<FormInputs>()

	const dispatch = useDispatch<AppDispatch>()


	const { isSubmitting, errors } = formState as {
		isSubmitting: boolean
		errors: FormErrors
	}

	const url = `${import.meta.env.VITE_API_SERVER_URL}/api/v1/auth/${type === "signup" ? "signup" : "login"}`

	const submitDetails = async (data: LoginInputs | SingupInputs) => {
		if (type == 'login') {
			const payload = await createLogin({ url, data: data as LoginInputs })
			dispatch(login(payload))
		} else {
			await createSignup({ url, data: data as SingupInputs })
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
									<input type="text" className='bg-grey p-3 border-black border-2 rounded-2xl' {...register("username", { required: true })} placeholder='enter a username' />
									{errors.username && <span>*This field is required</span>}
								</>
							)
						}
						<label htmlFor="email">Email</label>
						<input type="email" {...register("email", { required: true })} className='bg-grey p-3 border-black border-2 rounded-2xl' placeholder='enter your email' />
						{errors.email && <span>*This field is required</span>}

						<label htmlFor="email">Password</label>
						<input type="password" {...register("password", { required: true })} className='bg-grey p-3 border-black border-2 rounded-2xl' placeholder='enter your password' />
						{errors.password && <span>*This field is required</span>}

						{
							type === "signup" && (
								<>
									<label htmlFor="avatar">Avatar</label>
									<input type="file" {...register("avatar", { required: true })} className=' text-grey cursor-pointer custom-upload-button rounded-2xl  ' placeholder='select a file' />
									{errors.avatar && <span>*This field is required</span>}
								</>
							)
						}

						{type !== 'login' ? <span className='text-sm'>Don't have an account ? <Link to={"/auth/login"} className='text-blue-500'>Login </Link>instead</span> : <span className='text-sm'>Already have an account <Link to={"/auth/signup"} className='text-blue-500'>SignUp </Link>instead</span>}

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

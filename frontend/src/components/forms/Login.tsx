import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Fallback from "../Fallback/FallBack.tsx"
import { useForm } from "react-hook-form"
import { loginDataSchema } from "@/lib/validation"
import { z } from "zod"
import { Button } from "../ui/button"
import { Link, useNavigate } from "react-router-dom"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { PasswordInput, Spinner } from ".."
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store.ts"
import { login } from "@/store/authSlice.ts"
import { initalize } from "@/store/failureSlice.ts"
import { serverUrl } from "@/constants/apiServer.ts"

const LoginForm: React.FC = () => {
    const navigator = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const failure = useSelector((state: RootState) => state.failure)

    const form = useForm<z.infer<typeof loginDataSchema>>({
        resolver: zodResolver(loginDataSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof loginDataSchema>) => {
        try {
            setIsSubmitting(true)
            const response = await axios.post(
                `${serverUrl}/auth/login`,
                {
                    ...values,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            )

            if (response.status === 200) {
                const data = response.data.account

                dispatch(
                    login({
                        ...data,
                        access_token: response.data.accessToken,
                    })
                )
                navigator("/", { replace: true })
            }
        } catch (err) {
            console.error(`Error while signing up ${err}`)
            dispatch(
                initalize({
                    status: true,
                    error: err as Error,
                })
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (failure.status) {
        return <Fallback error={failure.error as Error} />
    }

    if (isSubmitting) {
        return (
            <div className="align-middle">
                <Spinner loading />
            </div>
        )
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 border-black  p-4 rounded-[10px] w-96"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Email</FormLabel>
                            <FormControl>
                                <Input
                                    className="rounded-[10px] p-3 placeholder:text-gray-200"
                                    placeholder="some@gmai.ci"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-500 text-[12px] text-justify">
                                * Email linked to your account
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">
                                Password
                            </FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="someStrong@password"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-500 text-[12px]">
                                * strong and complicated passwords
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                <div className="link flex mt-2 text-sm">
                    Don't have an account ?
                    <Link to={"/auth/signup"} className="text-blue-500">
                        register
                    </Link>
                </div>

                <div className="submit-btn w-full flex items-center justify-center">
                    <Button
                        type="submit"
                        className="bg-black text-white font-bold rounded-[10px] hover:bg-[#1e1e2e] w-full"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default LoginForm

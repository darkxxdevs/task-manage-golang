import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { SingnUpDataSchema, envVars } from "@/lib/validation"
import Fallback from "../Fallback/FallBack.tsx"
import { z } from "zod"
import { Button } from "../ui/button"
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
import { PasswordInput } from ".."
import Spinner from "../Spinner/spinner.tsx"
import axios from "axios"
import { serverUrl } from "@/constants/apiServer.ts"

const SignupForm: React.FC = () => {
    const navigator = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [failure, setFailure] = useState<{
        state: boolean
        error: Error | null
    }>({
        state: false,
        error: null,
    })

    const form = useForm<z.infer<typeof SingnUpDataSchema>>({
        resolver: zodResolver(SingnUpDataSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            avatar: undefined,
        },
    })

    const onSubmit = async (values: z.infer<typeof SingnUpDataSchema>) => {
        try {
            setIsSubmitting(true)
            const response = await axios.post(
                `${serverUrl}/auth/signup`,
                {
                    username: values.name,
                    email: values.email,
                    password: values.password,
                    avatar: values.avatar,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )

            if (response.status === 200) {
                navigator("/auth/login", { replace: true })
            }
        } catch (error) {
            console.error(`Error sending request ${error}`)
            setFailure({
                state: true,
                error: error as Error,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (failure.state) {
        return <Fallback error={failure.error as Error} />
    }

    return isSubmitting ? (
        <div className="align-middle">
            <Spinner loading color={"#000000"} />
        </div>
    ) : (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 border-black w-96"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="rounded-[10px] p-3 placeholder:text-gray-200"
                                    placeholder="someUser_offical"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-500 text-[12px]">
                                * Username should only contain letters, numbers
                                and underscores
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="something@email.co"
                                    {...field}
                                    className="rounded-[10px] p-3 placeholder:text-gray-200"
                                />
                            </FormControl>
                            <FormDescription className="text-gray-500 text-[12px]">
                                Email Linked with your account
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
                                    placeholder="somePass@120#2"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-gray-500 text-[12px] text-justify">
                                * Password should be at least 8 characters long
                                and contain at least one uppercase letter, one
                                lowercase letter, one number and one special
                                character
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold">Avatar</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    onChange={(e) =>
                                        field.onChange(e.target.files?.[0])
                                    }
                                    ref={field.ref}
                                    className="file:bg-black  bg-transparent file:text-white file:p-1 file:mr-2 file:font-bold file:rounded-[10px] text-slate-400 border-0"
                                />
                            </FormControl>
                            <FormDescription className="text-gray-500 text-[12px]">
                                * Max image size: 2MB, Supported formats: JPG,
                                JPEG, PNG, WEBP
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                <div className="link flex mt-1 text-sm">
                    Already have an account ?
                    <Link to={"/auth/login"} className="text-blue-500">
                        Login
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

export default SignupForm

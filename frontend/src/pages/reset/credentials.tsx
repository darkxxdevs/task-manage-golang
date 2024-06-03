import React, { useState, useEffect } from "react"
import { z } from "zod"
import updateUser from "@/store/updateUser"
import { LucideArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import {
    Form,
    FormField,
    FormLabel,
    FormItem,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form"
import { resetCredentialSchema } from "@/lib/validation/credentails.reset"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/components/ui/use-toast"
import Spinner from "@/components/Spinner/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/config/axios.config"
import { useDispatch } from "react-redux"
import { login } from "@/store/authSlice"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

const ResetCredentials: React.FC = () => {
    const { toast } = useToast()
    const params = new URLSearchParams(location.search)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const username = params.get("username")
    const email = params.get("email")

    const form = useForm<z.infer<typeof resetCredentialSchema>>({
        resolver: zodResolver(resetCredentialSchema),
        defaultValues: {
            email: email || "",
            username: username || "",
        },
    })

    const handleSubmit = async (
        data: z.infer<typeof resetCredentialSchema>
    ) => {
        try {
            console.log(data)
            setIsSubmitting(true)

            const payload = {
                newEmail: data.email || "",
                newUsername: data.username || "",
            }

            const response = await apiClient.patch("/u/details", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            console.log(response)
            if (response.status === 200) {
                const newUser = await updateUser()
                dispatch(login(newUser))
                toast({
                    title: "Success",
                    description: "Your account has been updated",
                })
                navigate("/u/profile")
            } else {
                throw new Error("Failed to update account")
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Something went wrong",
                description:
                    axiosError.response?.data?.message || "Please try again",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        const userFromLocalStorage = localStorage.getItem("user")
        if (userFromLocalStorage) {
            const user = JSON.parse(userFromLocalStorage)
            dispatch(login(user))
        }
    }, [dispatch])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="absolute top-20 md:left-20  left-8">
                <Button onClick={() => navigate("/u/profile")}>
                    <LucideArrowLeft size={18} />
                    Back
                </Button>
            </div>

            {isSubmitting ? (
                <div className="align-middle flex flex-col">
                    <Spinner loading />
                </div>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 border-black p-4 rounded-[10px] w-96"
                    >
                        {username && (
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="rounded-[10px] p-3 placeholder:text-gray-200 border-black border dark:border-gray-400"
                                                placeholder="someUser_offical"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-gray-500 text-[12px]">
                                            * Username should only contain
                                            letters, numbers and underscores
                                        </FormDescription>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                        )}

                        {email && (
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="something@email.co"
                                                {...field}
                                                className="rounded-[10px] p-3 placeholder:text-gray-200 border-black border dark:border-gray-400"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-gray-500 text-[12px]">
                                            Email Linked with your account
                                        </FormDescription>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                        )}
                        <div className="submit-btn w-full flex items-center justify-center">
                            <Button
                                type="submit"
                                className="bg-black dark:bg-white dark:text-black text-white font-bold rounded-[10px] hover:bg-[#1e1e2e] w-full disabled:bg-gray-300"
                                disabled={isSubmitting}
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default ResetCredentials

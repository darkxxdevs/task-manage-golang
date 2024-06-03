import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Lock, LucideArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import Spinner from "@/components/Spinner/spinner.tsx"
import { passwordResetDataSchema } from "@/lib/validation/password.reset.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { apiClient } from "@/config/axios.config"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse.ts"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const ResetPasswd: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { toast } = useToast()
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof passwordResetDataSchema>>({
        resolver: zodResolver(passwordResetDataSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof passwordResetDataSchema>) => {
        try {
            setIsSubmitting(true)
            const response = await apiClient.patch("/r/password", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Password updated successfully",
                    variant: "default",
                })

                navigate("/u/profile", { replace: true })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

            const message =
                axiosError.response?.data?.message ||
                "Error while updating the password"

            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center ">
            <div className="absolute top-20 md:left-20  left-8">
                <Button onClick={() => navigate("/u/profile")}>
                    <LucideArrowLeft size={18} />
                    Back
                </Button>
            </div>
            <Lock size={100} className="dark:text-gray-500" />
            {isSubmitting ? (
                <div className="align-middle flex flex-col ">
                    <Spinner loading />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 border-black  p-4 rounded-[10px] w-96"
                        >
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">
                                            New Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="rounded-[10px] p-3 placeholder:text-gray-200 border border-black dark:border-gray-700"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-gray-500 text-[12px] text-justify">
                                            Enter a new password
                                        </FormDescription>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="rounded-[10px] p-3 placeholder:text-gray-200 border border-black dark:border-gray-700"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-gray-500 text-[12px] text-justify">
                                            Confirm the new password
                                        </FormDescription>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />

                            <div className="submit-btn w-full flex items-center justify-center">
                                <Button
                                    type="submit"
                                    className="bg-black dark:bg-white  dark:text-black text-white font-bold rounded-[10px] hover:bg-[#1e1e2e] w-full"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Form>
                </>
            )}
        </div>
    )
}

export default ResetPasswd

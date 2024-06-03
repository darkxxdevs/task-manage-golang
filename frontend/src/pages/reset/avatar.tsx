import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { login } from "@/store/authSlice"
import { LucideArrowLeft } from "lucide-react"
import updateUser from "@/store/updateUser"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/config/axios.config"
import { z } from "zod"
import { resetAvatarValidationSchema } from "@/lib/validation/reset.avatar"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormField,
    FormLabel,
    FormItem,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import Spinner from "@/components/Spinner/spinner"
import { Button } from "@/components/ui/button"

const ResetAvatar: React.FC = () => {
    const { toast } = useToast()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const form = useForm<z.infer<typeof resetAvatarValidationSchema>>({
        resolver: zodResolver(resetAvatarValidationSchema),
        defaultValues: {
            newAvatar: undefined,
        },
    })

    const onSubmit = async (
        data: z.infer<typeof resetAvatarValidationSchema>
    ) => {
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            if (data.newAvatar) {
                formData.append("avatar", data.newAvatar)
            }

            const response = await apiClient.patch("/r/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (response.status === 200) {
                toast({
                    title: "Avatar reset successfully",
                })
                const newUser = await updateUser()

                if (newUser) {
                    dispatch(login(newUser))
                }

                navigate("/u/profile")
            } else {
                throw new Error("Failed to reset avatar")
            }
        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Please try again",
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
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 border-black p-4 rounded-[10px] w-96"
                    >
                        <FormField
                            control={form.control}
                            name="newAvatar"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="font-bold">
                                        New Avatar
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                form.setValue("newAvatar", file)
                                            }}
                                            className="file:dark:text-white"
                                            value={undefined}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-500 text-[12px] text-justify">
                                        Upload a new avatar
                                    </FormDescription>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <div className="submit-btn w-full flex items-center justify-center">
                            <Button
                                type="submit"
                                className="bg-black dark:bg-white dark:text-black text-white font-bold rounded-[10px] hover:bg-[#1e1e2e] w-full"
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

export default ResetAvatar

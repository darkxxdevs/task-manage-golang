import { z } from "zod"
import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import taskvalidationSchema from "@/lib/validation/taskvalidation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch } from "react-redux"
import { addTask } from "@/store/taskSlice"
import { AppDispatch } from "@/store/store"
import { apiClient } from "@/config/axios.config"

const TaskFrom: React.FC = () => {
    const { toast } = useToast()
    const dispatch = useDispatch<AppDispatch>()
    const form = useForm<z.infer<typeof taskvalidationSchema>>({
        resolver: zodResolver(taskvalidationSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof taskvalidationSchema>) => {
        try {
            const response = await apiClient.post(
                "/tasks",
                {
                    ...values,
                },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )

            if (response.status === 200) {
                const createdTask = response.data.created_task
                dispatch(addTask(createdTask))
            }
        } catch (error) {
            console.error("error while creating a new task", error)
            const axiosError = error as AxiosError<ApiResponse>

            let message =
                axiosError.response?.data.error || "Something went wrong"

            toast({
                variant: "destructive",
                title: "Error while creating task",
                description: message,
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>title</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                * give a suitable title to your next task
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>description</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                * give a suitable description for your task
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-full" type="submit">
                    Submit
                </Button>
            </form>
        </Form>
    )
}

export default TaskFrom

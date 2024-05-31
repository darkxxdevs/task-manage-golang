import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, Pencil, Check } from "lucide-react"
import { Spinner } from "@/components"
import { apiClient } from "@/config/axios.config"
import { useToast } from "@/components/ui/use-toast"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { updateTask } from "@/store/taskSlice"
import { TaskProps } from "@/store/taskSlice"

interface ContainerTaskProps {
    tasks: TaskProps[]
}

const TaskContainer: React.FC<ContainerTaskProps> = ({
    tasks,
}: ContainerTaskProps) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>()

    const toggleCompletionStatus = async (id: string) => {
        try {
            setLoading(true)
            const response = await apiClient.post("/tasks", {
                params: {
                    taskId: id,
                },
            })

            if (response.status === 200) {
                dispatch(updateTask(response.data.updated_task))
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let message =
                axiosError.response?.data.message || "Something went wrong"

            toast({
                variant: "destructive",
                title: "Error updating task!",
                description: message,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {loading ? (
                <Spinner loading />
            ) : tasks.length === 0 ? (
                <div className="dark:text-gray-500 text-black w-full flex items-center justify-center">
                    No tasks created so far....
                </div>
            ) : (
                <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full p-5 border-2 border-white">
                    {tasks.map((value, index) => (
                        <div className="card rounded-lg" key={index}>
                            <div className="title">{value.title}</div>
                            <p>{value.description}</p>
                            {value.isEdited && <Badge>edited</Badge>}
                            {value.isCompleted && (
                                <Badge>
                                    Completed <BadgeCheck />
                                </Badge>
                            )}
                            <div className="controls">
                                <button
                                    onClick={() =>
                                        toggleCompletionStatus(value.id)
                                    }
                                    className="dark:bg-white dark:text-black border bg-black text-white"
                                >
                                    <Pencil />
                                </button>
                                <button className="dark:bg-white dark:text-black border bg-black text-white">
                                    <Check />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default TaskContainer

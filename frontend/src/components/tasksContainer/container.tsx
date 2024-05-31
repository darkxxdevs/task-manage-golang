import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, Pencil, Check } from "lucide-react"
import { Spinner } from "@/components"
import { apiClient } from "@/config/axios.config"
import { useToast } from "@/components/ui/use-toast"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
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
    const taskState = useSelector(
        (state: RootState) => state.tasks.existingTask
    )

    const toggleCompletionStatus = async (id: string) => {
        try {
            setLoading(true)
            const response = await apiClient.post("/tasks", {
                params: {
                    taskId: id,
                },
            })

            if (response.status == 200) {
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
        <div className="container grid grid-cols-1 md:grid-cols-2 lg: lg:grid-cols-3">
            {tasks.map((value, index) => (
                <div className="card rounded-lg" key={index}>
                    {loading ? (
                        <Spinner loading />
                    ) : !taskState ? (
                        <p>No tasks created So far</p>
                    ) : (
                        <>
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
                                        toggleCompletionStatus(value._id)
                                    }
                                    className="dark:bg-white dark:text-black border bg-black text-white"
                                >
                                    <Pencil />
                                </button>
                                <button className="dark:bg-white dark:text-black border bg-black text-white">
                                    <Check />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}

export default TaskContainer

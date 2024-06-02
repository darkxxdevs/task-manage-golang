import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { BadgeCheck, Pencil, Check } from "lucide-react"
import { Spinner } from "@/components"
import { apiClient } from "@/config/axios.config"
import { useToast } from "@/components/ui/use-toast"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { updateTask } from "@/store/taskSlice"
import { TaskProps } from "@/store/taskSlice"

interface ContainerTaskProps {
    tasks: TaskProps[]
    onEditTrigger: (id: string) => void
}

const TaskContainer: React.FC<ContainerTaskProps> = ({
    tasks,
    onEditTrigger,
}: ContainerTaskProps) => {
    const { toast } = useToast()
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>()

    const toggleCompletionStatus = async (id: string) => {
        try {
            setLoading(true)

            console.log(id)
            const response = await apiClient.patch(
                `/tasks/t/status?taskId=${id}`
            )

            if (response.status === 200) {
                dispatch(updateTask(response.data.updated_task))
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            console.log(axiosError.response?.data)
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
                <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-1">
                    {tasks.map((value, index) => (
                        <Card className="p-4" key={index}>
                            <CardHeader>
                                <CardTitle className="text-sm  font-bold dark:text-white text-black mb-2 flex items-center gap-2 justify-between">
                                    <span>{value.Title}</span>
                                    <div className="badges flex flex-row items-center gap-1">
                                        {value.IsEdited && (
                                            <Badge
                                                className=" text-sm "
                                                variant="default"
                                            >
                                                <span className="text-[12px]">
                                                    Edited
                                                </span>
                                            </Badge>
                                        )}
                                        {value.IsCompleted && (
                                            <Badge className=" flex items-center text-sm ">
                                                <BadgeCheck className="ml-1 h-3 w-3" />
                                                <span className="text-[12px]">
                                                    completed
                                                </span>
                                            </Badge>
                                        )}
                                    </div>
                                </CardTitle>
                                <CardDescription className="dark:text-gray-500 text-gray-800 mb-4">
                                    {value.Descrpition}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-end space-x-2">
                                <div className="controls flex justify-end space-x-2">
                                    {!value.IsCompleted && (
                                        <button
                                            onClick={() =>
                                                toggleCompletionStatus(value.ID)
                                            }
                                            className="p-2 rounded  dark:text-black dark:bg-white transition bg-black text-white"
                                        >
                                            <Check className="w-10 h-4 dark:bg-white dark:text-black " />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onEditTrigger(value.ID)}
                                        className="p-2 rounded bg-green-500 text-white dark:bg-green-700 hover:bg-green-600 dark:hover:bg-green-800 transition"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </>
    )
}

export default TaskContainer

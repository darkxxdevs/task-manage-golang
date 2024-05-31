import React, { lazy, useEffect, useState } from "react"
import { Navbar } from "../components"
import { useDispatch, useSelector } from "react-redux"
import { X } from "lucide-react"
import { AppDispatch, RootState } from "../store/store"
import { apiClient } from "@/config/axios.config"
import { ApiResponse } from "@/types/ApiResponse"
import { AxiosError } from "axios"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { setInitialTask } from "@/store/taskSlice"

const TaskForm = lazy(() => import("@/components/taskForm/taskForm"))
const TaskContainer = lazy(
    () => import("@/components/tasksContainer/container")
)

const Home: React.FC = () => {
    const [taskFormToggled, setTaskFormtoggled] = useState<boolean>(false)
    const { toast } = useToast()
    const dispatch = useDispatch<AppDispatch>()
    const currentTasks = useSelector(
        (state: RootState) => state.tasks.fetchedTasks
    )
    const user = useSelector((state: RootState) => state.auth.user)

    useEffect(() => {
        ;(async () => {
            try {
                const response = await apiClient.get("/tasks")
                if (response.status === 200) {
                    dispatch(setInitialTask(response.data.tasks))
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                let message = axiosError.response?.data.error
                toast({
                    variant: "destructive",
                    title: "Aww Snap :(",
                    description: message,
                })
            }
        })()
    }, [])

    return (
        <div className="mx-[10%] my-[1%]">
            <Navbar {...user} />
            <div className="creator w-full  flex p-3 items-center justify-between">
                <Button
                    variant={"default"}
                    onClick={() => setTaskFormtoggled(true)}
                >
                    Create new task
                </Button>

                <Button
                    variant={"default"}
                    onClick={() => setTaskFormtoggled(false)}
                >
                    <X />
                </Button>
            </div>
            <div className="show-space w-full p-3">
                {taskFormToggled ? (
                    <TaskForm />
                ) : (
                    <TaskContainer tasks={currentTasks} />
                )}
            </div>
        </div>
    )
}

export default Home

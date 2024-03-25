import React from "react"
import { useForm } from "react-hook-form"

interface TaskFormProps {
    title: string
    description: string
}

const TaskFrom: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TaskFormProps>()

    return <h1>Some jsx</h1>
}

export default TaskFrom

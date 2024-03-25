import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TaskProps {
    id: string
    title: string
    description: string
    isCompleted: boolean
    isEdited: boolean
    userIF: string
}

interface TaskStateProps {
    existingTask: boolean
    fetchedTasks: TaskProps[] | []
}

const initialState: TaskStateProps = {
    existingTask: false,
    fetchedTasks: [],
}

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        setInitialTask(state, action: PayloadAction<TaskProps[]>) {
            state.existingTask = true
            state.fetchedTasks = action.payload
        },
        updateTask(state, action: PayloadAction<TaskProps>) {
            const updatedTask = action.payload
            const indexToUpdate = state.fetchedTasks.findIndex(
                (task) => updatedTask.id === task.id
            )
            if (indexToUpdate !== -1) {
                state.fetchedTasks[indexToUpdate] = updatedTask
            }
        },
        deleteTask(state, action: PayloadAction<TaskProps>) {
            const taskToDelete = action.payload
            state.fetchedTasks = state.fetchedTasks.filter(
                (task) => task.id !== taskToDelete.id
            )
        },
    },
})

export const { setInitialTask, updateTask, deleteTask } = taskSlice.actions

export default taskSlice.reducer

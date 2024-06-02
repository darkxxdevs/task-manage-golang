import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface TaskProps {
    ID: string
    Title: string
    Descrpition: string
    IsCompleted: boolean
    IsEdited: boolean
    UserID: string
}

interface TaskStateProps {
    existingTask: boolean
    fetchedTasks: TaskProps[]
}

const defaultInitialState: TaskStateProps = {
    existingTask: false,
    fetchedTasks: [],
}

const taskSlice = createSlice({
    name: "task",
    initialState: defaultInitialState,
    reducers: {
        setInitialTask(state, action: PayloadAction<TaskProps[]>) {
            state.existingTask = true
            state.fetchedTasks = action.payload
        },

        updateTask(state, action: PayloadAction<TaskProps>) {
            const updatedTask = action.payload
            const indexToUpdate = state.fetchedTasks.findIndex(
                (task) => updatedTask.ID === task.ID
            )
            if (indexToUpdate !== -1) {
                state.fetchedTasks[indexToUpdate] = updatedTask
            }
        },
        deleteTask(state, action: PayloadAction<TaskProps>) {
            const taskToDelete = action.payload
            state.fetchedTasks = state.fetchedTasks.filter(
                (task) => task.ID !== taskToDelete.ID
            )
        },
        addTask(state, action: PayloadAction<TaskProps>) {
            const newTask: TaskProps = action.payload
            state.fetchedTasks.push(newTask)
        },
    },
})

export const { setInitialTask, addTask, updateTask, deleteTask } =
    taskSlice.actions

export default taskSlice.reducer

import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import failureReducer from "@/store/failureSlice"
import taskReducer from "@/store/taskSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        failure: failureReducer,
        tasks: taskReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

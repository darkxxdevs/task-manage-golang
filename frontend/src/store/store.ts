import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import failureReducer from "@/store/failureSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        failure: failureReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

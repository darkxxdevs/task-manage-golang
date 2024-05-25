import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface FailureProps {
    status: boolean
    error: Error | null
}

const initialState: FailureProps = {
    status: false,
    error: null,
}

const failureSlice = createSlice({
    name: "failure",
    initialState,
    reducers: {
        initalize(state, action: PayloadAction<FailureProps>) {
            state.status = action.payload.status
            state.error = action.payload.error
        },
    },
})

export const { initalize } = failureSlice.actions

export default failureSlice.reducer

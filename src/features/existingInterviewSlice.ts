import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ExistingInterviewState {
    existingInterviews: Record<string, string>;  // email -> interviewId
}

const initialState: ExistingInterviewState = {
    existingInterviews: {}
};

const existingInterviewSlice = createSlice({
    name: "existingInterview",
    initialState,
    reducers: {
        createInterview: (state, action: PayloadAction<{ email: string, interviewId: string }>) => {
            if(!state.existingInterviews) state.existingInterviews = {};
            state.existingInterviews[action.payload.email] = action.payload.interviewId;
            console.log("Entry created", action.payload.email, action.payload.interviewId);
        },
    },
});

export const { createInterview } =
    existingInterviewSlice.actions;
export default existingInterviewSlice.reducer;

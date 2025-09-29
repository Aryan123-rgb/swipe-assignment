import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Answer {
    question: string;
    answer: string;
    timeLeft: number;
    score?: number;
}

export interface Interview {
    id: string;
    answers: Answer[];
    finalScore?: number;
    aiSummary?: string;
    status: "in-progress" | "completed" | "not-started";
    name: string;
    email: string;
    phone: string;
}

export interface InterviewState {
    interviews: Record<string, Interview>;  // id -> Interview
}

const initialState: InterviewState = {
    interviews: {}
};

const interviewSlice = createSlice({
    name: "interview",
    initialState,
    reducers: {
        startInterview: (state, action: PayloadAction<{ id: string, question: string, name: string, email: string, phone: string }>) => {
            const newInterview = {
                id: action.payload.id,
                answers: [{ question: action.payload.question, answer: "", timeLeft: 20 }],
                status: "in-progress" as "in-progress" | "completed" | "not-started",
                name: action.payload.name,
                email: action.payload.email,
                phone: action.payload.phone
            }
            if (!state.interviews) state.interviews = {};
            state.interviews[action.payload.id] = newInterview;
        },
        addQuestion: (state, action: PayloadAction<{ id: string, question: string, difficulty: string }>) => {
            const { id, question, difficulty } = action.payload;
            let timeLeft = 20;
            if (difficulty == "medium") timeLeft = 40;
            else if (difficulty == "hard") timeLeft = 60;

            state.interviews[id].answers.push({ question, answer: "", timeLeft });
        },
        addAnswer: (state, action: PayloadAction<{ id: string, answer: string }>) => {
            const { id, answer } = action.payload;
            const interview = state.interviews[id];
            if (!interview || interview.answers.length == 0) return;
            const lastIndex = interview.answers.length - 1;
            state.interviews[id].answers[lastIndex].answer = answer;
        },
        updateTimer: (state, action: PayloadAction<{ id: string, timeLeft: number }>) => {
            const interview = state.interviews[action.payload.id];
            // console.log("payload", action.payload);
            // console.log(interview);
            if (!interview) return;
            const lastIndex = interview.answers.length - 1;
            state.interviews[action.payload.id].answers[lastIndex].timeLeft = action.payload.timeLeft;
        },
        completeInterview: (
            state,
            action: PayloadAction<{ id: string, finalScore: number, aiSummary: string }>
        ) => {
            const interview = state.interviews[action.payload.id];
            if (!interview) return;
            state.interviews[action.payload.id].finalScore = action.payload.finalScore;
            state.interviews[action.payload.id].aiSummary = action.payload.aiSummary;
            state.interviews[action.payload.id].status = "completed";
        }
    },
});

export const { startInterview, addAnswer, addQuestion, completeInterview, updateTimer, } =
    interviewSlice.actions;
export default interviewSlice.reducer;

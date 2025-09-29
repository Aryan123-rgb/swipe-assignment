import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { HumanMessage } from "@langchain/core/messages";
import { Interview } from "@/features/intervieweeSlice";

const ResumeDataSchema = z.object({
    name: z.string().describe("Full name of the candidate").optional(),
    email: z.string().describe("Email address of the candidate").optional(),
    phone: z.string().describe("Phone number of the candidate (with country code if available, e.g., +91XXXXXXXXXX)").optional(),
});

const interviewSummarySchema = z.object({
    summary: z.string().describe("The interview summary for the candidate"),
    score: z.number().describe("The score of the candidate out of 100")
})

type ResumeData = z.infer<typeof ResumeDataSchema>;

const apikey = import.meta.env.VITE_GOOGLE_API_KEY;

const model = new ChatGoogleGenerativeAI({
    apiKey: apikey,
    model: "gemini-2.5-flash",
});

const structuredModel = model.withStructuredOutput(ResumeDataSchema);
const summaryModel = model.withStructuredOutput(interviewSummarySchema);

export const extractCredentialsFromText = async (text: string): Promise<ResumeData> => {
    const response = await structuredModel.invoke([
        new HumanMessage({
            content: `Extract the candidate's full name, email, and phone number from the text below. 
Return the result strictly as JSON with keys: name, email, phone. 
If a field is missing, use an empty string.

Text:
${text}`,
        }),
    ]);

    return {
        name: response?.name?.length > 1 ? response.name : null,
        email: response?.email?.length > 1 ? response.email : null,
        phone: response?.phone?.length > 1 ? response.phone : null,
    };
};

export const generateInterviewQuestion = async (difficulty: "easy" | "medium" | "hard"): Promise<string> => {
    const prompt = `Generate a ${difficulty} interview question for a Full Stack Developer role (React + Node.js). 
    The question must be answerable within about ${difficulty === "easy" ? "20" : difficulty === "medium" ? "60" : "120"} seconds. 
    Return only the question, no extra text.`;

    const response = await model.invoke([
        new HumanMessage({
            content: prompt,
        }),
    ]);
    return response.content.toString();
}

export const generateInterviewSummary = async (interview: Interview) => {
    const prompt = `You are evaluating an interview.
The candidate's answers are given as an array of objects with {question, answer, timeTaken, difficulty}.
There are 2 easy, 2 medium, and 2 hard questions.

1. Evaluate the quality of answers and time taken.
2. Give a finalScore out of 100 (weight: easy=20%, medium=30%, hard=50%).
3. Provide a concise aiSummary (2–3 sentences) describing strengths and weaknesses.

Return strictly in JSON with keys: score, summary.

Interview Data:
${JSON.stringify(interview.answers, null, 2)}`

    const response = await summaryModel.invoke([
        new HumanMessage({
            content: prompt,
        })
    ])
    return {
        finalScore: response.score,
        aiSummary: response.summary
    };
}

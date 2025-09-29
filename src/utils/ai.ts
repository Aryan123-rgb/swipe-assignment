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
    model: "gemini-2.5-flash-lite",
});

const structuredModel = model.withStructuredOutput(ResumeDataSchema);
const summaryModel = model.withStructuredOutput(interviewSummarySchema);

export const extractCredentialsFromText = async (text: string): Promise<ResumeData> => {
    const response = await structuredModel.invoke([
        new HumanMessage({
            content: `Extract the candidate's name, email, and phone number from the following text. 
      If any information is missing, leave it blank.
      
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

export const generateInterviewQuestion = async (difficulty: "easy" | "medium" | "hard") : Promise<string> => {
    const prompt = `Generate a ${difficulty} interview question for a Full Stack Developer role. including react and node questions. Provide the question only without any additional context or formatting.`;
    const response = await model.invoke([
        new HumanMessage({
            content: prompt,
        }),
    ]);
    return response.content.toString();
}

export const generateInterviewSummary = async (interview: Interview) => {
    const prompt = `Create a summary for the interview for the candidate ${interview}`;
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

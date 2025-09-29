import { useState } from "react";
import ControlBar from "@/components/ControlBar";
import InterviewPanel from "@/components/InterviewPanel";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  generateInterviewQuestion,
  generateInterviewSummary,
} from "@/utils/ai";
import {
  addAnswer,
  addQuestion,
  completeInterview,
} from "@/features/intervieweeSlice";
import { useNavigate, useParams } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const interview = useSelector(
    (state: RootState) => state.interview.interviews[id]
  );
  const dispatch = useDispatch<AppDispatch>();

  const currentQuestionIndex = interview?.answers.length - 1;
  const timeLeft = interview?.answers[currentQuestionIndex].timeLeft;
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [answer, setAnswer] = useState("");
  const { toast } = useToast();

  const question = interview?.answers[currentQuestionIndex].question;

  const moveToNextQuestion = async () => {
    const questionsCount = interview?.answers.length;
    let difficulty = "hard";
    if (questionsCount < 2) {
      difficulty = "easy";
    } else if (questionsCount < 4) {
      difficulty = "medium";
    }

    const question = await generateInterviewQuestion(
      difficulty as "easy" | "medium" | "hard"
    );
    if (questionsCount >= 6) {
      console.log("Generating summary");
      const summary = await generateInterviewSummary(interview);
      console.log("Summary", summary);
      dispatch(completeInterview({ ...summary, id }));
      navigate("/dashboard");
      return;
    } else
      dispatch(addQuestion({ id, question: question as string, difficulty }));
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Interview Resumed" : "Interview Paused",
      description: isPaused
        ? "Timer has been resumed."
        : "Timer has been paused.",
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsPaused(true);
    toast({
      title: "Answer Submitted",
      description: "Your answer has been submitted successfully.",
    });
    dispatch(addAnswer({ id, answer }));
    await moveToNextQuestion();
    setIsLoading(false);
    setIsPaused(false);
  };
  console.log("interviewState", interview);
  console.log("time remaining", timeLeft);
  return (
    <div className="h-screen bg-background flex flex-col animate-fade-in overflow-hidden">
      <ControlBar
        currentQuestion={currentQuestionIndex + 1}
        timeRemaining={timeLeft}
        onPause={handlePause}
        onSubmit={handleSubmit}
        isPaused={isPaused}
        isLoading={isLoading}
      />

      <InterviewPanel
        question={question}
        answer={answer}
        onAnswerChange={setAnswer}
      />
    </div>
  );
};

export default Chat;

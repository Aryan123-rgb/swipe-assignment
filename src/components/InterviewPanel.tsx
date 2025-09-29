import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, Edit3 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { addAnswer } from "@/features/intervieweeSlice";
import { useParams } from "react-router-dom";

interface InterviewPanelProps {
  question: string;
  answer: string;
  onAnswerChange: (answer: string) => void;
  isPaused: boolean;
}

const InterviewPanel = ({
  question,
  answer,
  onAnswerChange,
  isPaused,
}: InterviewPanelProps) => {
  const [activePanel, setActivePanel] = useState<"question" | "answer">(
    "question"
  );
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (answer.trim() != "") {
        dispatch(addAnswer({ id, answer }));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [answer]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Mobile Panel Toggle */}
      <div className="md:hidden bg-background border-b border-panel-border">
        <div className="flex">
          <button
            onClick={() => setActivePanel("question")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-fast flex items-center justify-center gap-2 ${
              activePanel === "question"
                ? "text-primary border-b-2 border-primary bg-secondary/50"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
            }`}
          >
            <FileText className="w-4 h-4" />
            Question
          </button>
          <button
            onClick={() => setActivePanel("answer")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-fast flex items-center justify-center gap-2 ${
              activePanel === "answer"
                ? "text-primary border-b-2 border-primary bg-secondary/50"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Answer
          </button>
        </div>
      </div>

      {/* Desktop Split View */}
      <div className="hidden md:flex flex-1">
        {/* Question Panel */}
        <div className="w-1/2 border-r border-panel-border">
          <Card className="h-full rounded-none border-0 bg-panel shadow-none">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Interview Question
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {question}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Answer Panel */}
        <div className="w-1/2">
          <Card className="h-full rounded-none border-0 bg-panel shadow-none">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Your Solution
                </h2>
              </div>
              <div className="flex-1">
                <Textarea
                  value={answer}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Type your solution here..."
                  className="h-full min-h-full resize-none border-panel-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary transition-fast overflow-y-auto"
                  disabled={isPaused}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Single Panel View */}
      <div className="md:hidden flex-1">
        {activePanel === "question" ? (
          <Card className="h-full rounded-none border-0 bg-panel shadow-none">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Interview Question
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {question}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full rounded-none border-0 bg-panel shadow-none">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Your Solution
                </h2>
              </div>
              <div className="flex-1">
                <Textarea
                  value={answer}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Type your solution here..."
                  className="h-full min-h-full resize-none border-panel-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary transition-fast overflow-y-auto"
                  disabled={isPaused}
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InterviewPanel;

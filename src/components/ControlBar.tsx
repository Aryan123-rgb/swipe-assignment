import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pause, Play, Send, SkipForward, Clock, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateTimer } from "@/features/intervieweeSlice";
import { useParams } from "react-router-dom";

interface ControlBarProps {
  currentQuestion: number;
  timeRemaining: number; // in seconds
  onPause: () => void;
  onSubmit: () => void;
  isPaused: boolean;
  isLoading: boolean;
}

const ControlBar = ({
  currentQuestion,
  timeRemaining,
  onPause,
  onSubmit,
  isPaused,
  isLoading,
}: ControlBarProps) => {
  const [displayTime, setDisplayTime] = useState(timeRemaining);
  const dispatch = useDispatch<AppDispatch>();
  const totalQuestions = 6;
  const { id } = useParams<{ id: string }>();
  const interviewId = id;
  
  useEffect(() => {
    if (isPaused || displayTime <= 0) return;

    const id = setInterval(() => {
      setDisplayTime((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          dispatch(updateTimer({ id: interviewId, timeLeft: 0 }));
          onSubmit(); // auto-submit when time runs out
          return 0;
        }
        const next = prev - 1;
        dispatch(updateTimer({ id: interviewId, timeLeft: next }));
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isPaused, currentQuestion, dispatch, onSubmit]);

  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [currentQuestion, timeRemaining]);

  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const isTimeUrgent = displayTime <= 10; // 10 seconds or less

  return (
    <div className="bg-control-bar border-b border-panel-border control-bar-shadow">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center  px-6 py-4">
        {/* Left: Progress */}
        <div className="w-80 space-y-2">
          <div className="text-sm font-medium text-foreground">
            Question {currentQuestion} of {totalQuestions}
          </div>
          <Progress value={progressPercentage} className="h-2 bg-progress-bg" />
        </div>

        {/* Center: Action Buttons */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onPause}
              className="transition-fast hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                </>
              ) : isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              )}
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onSubmit}
              className="gradient-primary transition-fast hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Timer */}
        <div className="w-80 flex justify-end">
          <Badge
            variant={isTimeUrgent ? "destructive" : "secondary"}
            className="px-3 py-2 text-base font-mono transition-fast"
          >
            <Clock className="w-4 h-4 mr-2" />
            {formatTime(displayTime)}
          </Badge>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden px-4 py-4 space-y-4">
        {/* Row 1: Progress */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-center text-foreground">
            Question {currentQuestion} of {totalQuestions}
          </div>
          <Progress value={progressPercentage} className="h-2 bg-progress-bg" />
        </div>

        {/* Row 2: Buttons */}
        <div className="flex justify-center items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="transition-fast hover:scale-105"
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onSubmit}
            className="gradient-primary transition-fast hover:scale-105"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </div>

        {/* Row 3: Timer */}
        <div className="flex justify-center">
          <Badge
            variant={isTimeUrgent ? "destructive" : "secondary"}
            className="px-4 py-2 text-lg font-mono transition-fast"
          >
            <Clock className="w-4 h-4 mr-2" />
            {formatTime(displayTime)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
  interviewId: string;
}

function WelcomeModal({
  isOpen,
  onClose,
  status,
  interviewId,
}: WelcomeModalProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (status === "completed") {
      navigate("/dashboard");
    } else {
      navigate(`/chat/${interviewId}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {status === "in-progress"
              ? "You have an active interview in progress. Would you like to resume where you left off?"
              : "You have completed your interview. You can view the results in your dashboard."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleNavigate}>
            {status === "completed" ? "Go to Dashboard" : "Resume Interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeModal;

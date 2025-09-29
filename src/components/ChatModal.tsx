import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  X,
  FileText,
  Image,
  File,
  Loader2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { extractPDFContents } from "@/utils/pdf";
import {
  extractCredentialsFromText,
  generateInterviewQuestion,
} from "@/utils/ai";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import WelcomeModal from "./WelcomeModal";
import { useNavigate } from "react-router-dom";
import { startInterview } from "@/features/intervieweeSlice";
import { createInterview } from "@/features/existingInterviewSlice";

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  attachments?: AttachedFile;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const maxFileSize = 20;
const allowedFileTypes = ["application/pdf"];

const mergeTwoObjects = (obj1: any, obj2: any) => {
  const result = { ...obj1 };
  for (const key in obj2) {
    if (obj2[key] !== null && obj2[key] !== undefined) {
      result[key] = obj2[key];
    } else if (
      (result[key] === null || result[key] === undefined) &&
      obj2[key] == null
    ) {
      result[key] = null;
    }
  }
  return result;
};

function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile | null>(null);
  const [completeProfile, setCompleteProfile] = useState<any>({});
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const navigate = useNavigate();
  const interviewMap = useSelector(
    (state: RootState) => state.interview.interviews
  );
  const existingInterviewMap = useSelector(
    (state: RootState) => state.existingInterview.existingInterviews
  );
  const [status, setStatus] = useState("");
  const [existingInterviewId, setExistingInterviewId] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      alert(
        `File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`
      );
      return;
    }

    const attachedFile: AttachedFile = {
      id: Date.now().toString() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    };

    setAttachedFiles(attachedFile);

    event.target.value = "";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (type === "application/pdf") return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !attachedFiles) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      attachments: attachedFiles ? attachedFiles : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsSending(true);

    const pdfText = attachedFiles?.file
      ? await extractPDFContents(attachedFiles?.file)
      : "";
    const sanitisedText = pdfText.substring(0, 200);
    const profile = await extractCredentialsFromText(
      sanitisedText + inputValue.trim()
    );

    const updatedProfile: any = mergeTwoObjects(completeProfile, profile);
    console.log("message from ai", profile);
    console.log("completeProfile: ", updatedProfile);
    if (updatedProfile.name && updatedProfile.email && updatedProfile.phone) {
      if (existingInterviewMap[updatedProfile.email]) {
        console.log("Console reached here");
        const interviewId = existingInterviewMap[updatedProfile.email];
        const interview = interviewMap[interviewId];
        console.log("interviewId: ", interviewId);
        console.log("interview: ", interview);
        if (interview) {
          if (interview.status == "completed") {
            setStatus("completed");
          } else {
            setExistingInterviewId(interviewId);
            setStatus("in-progress");
          }
          onClose();
          setIsSending(false);
          setIsWelcomeModalOpen(true);
          return;
        }
      }

      console.log("completeProfile: ", updatedProfile);
      const interviewId = crypto.randomUUID();
      const question = await generateInterviewQuestion("easy");
      dispatch(
        startInterview({
          id: interviewId,
          question,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
        })
      );
      dispatch(createInterview({ email: updatedProfile.email, interviewId }));
      console.log("Interview created with id", interviewId);

      const finalMessage: Message = {
        id: Date.now().toString(),
        content:
          "Thank you for uploading your resume. Your interview will start soon. Kindly do not refresh the page you will be navigated to the interview page.",
        sender: "ai",
      };

      setMessages((prev) => [...prev, finalMessage]);

      setTimeout(() => {
        setIsSending(false);
        navigate(`/chat/${interviewId}`);
      }, 2000);
      return;
    }

    const missingFields = [];
    if (!updatedProfile.name) missingFields.push("Name");
    if (!updatedProfile.email) missingFields.push("Email");
    if (!updatedProfile.phone) missingFields.push("Phone");

    const message: Message = {
      id: Date.now().toString(),
      content: `Please provide ${missingFields.join(", ")}.`,
      sender: "ai",
    };

    setMessages((prev) => [...prev, message]);
    setIsSending(false);
    setInputValue("");
    setCompleteProfile(updatedProfile);
    setAttachedFiles(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Interview Assistant</DialogTitle>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Please Upload your resume</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs sm:max-w-md rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.content && (
                    <p className="text-sm">{message.content}</p>
                  )}

                  {/* File attachments */}
                  {message.attachments && (
                    <div className="mt-2 space-y-2">
                      <div
                        key={message.attachments.id}
                        className="flex items-center space-x-2 text-xs bg-black/10 rounded p-2"
                      >
                        {getFileIcon(message.attachments.type)}
                        <span className="truncate">
                          {message.attachments.name}
                        </span>
                        <span>
                          ({formatFileSize(message.attachments.size)})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isSending && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* File attachments preview */}
        {attachedFiles && (
          <div className="px-4 py-2 border-t bg-muted/30">
            <div className="flex flex-wrap gap-2">
              {attachedFiles && (
                <div
                  key={attachedFiles.id}
                  className="flex items-center space-x-2 bg-background rounded-lg px-3 py-2 text-sm"
                >
                  {getFileIcon(attachedFiles.type)}
                  <span className="truncate max-w-32">
                    {attachedFiles.name}
                  </span>
                  <span className="text-muted-foreground">
                    ({formatFileSize(attachedFiles.size)})
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setAttachedFiles(null)}
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              accept={allowedFileTypes.join(",")}
              className="hidden"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className="shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              disabled={isSending}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && !attachedFiles) || isSending}
              size="icon"
            >
              {isSending && <Loader2 className="h-4 w-4 animate-spin" />}
              {!isSending && <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        status={status}
        interviewId={existingInterviewId}
      />
    </Dialog>
  );
}

export default ChatModal;

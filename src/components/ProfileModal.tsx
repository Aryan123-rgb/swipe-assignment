import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Interview } from "@/features/intervieweeSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function ProfileModal({
  isOpen,
  onClose,
  profile,
}: {
  isOpen: boolean;
  onClose: () => void;
  profile: Interview;
}) {
  const interview = profile;
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "in-progress":
        return "text-yellow-600 bg-yellow-50";
      case "not-started":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-600";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            {profile.name || "Anonymous Candidate"}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Interview Profile Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-800">{profile.email || "Not provided"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Phone:</span>
                <p className="text-gray-800">{profile.phone || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Interview Overview */}
          {interview && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Interview Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(interview.status || profile.status)}`}>
                    {interview.status || profile.status}
                  </span>
                </div>
                {interview.finalScore !== undefined && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Final Score:</span>
                    <p className={`text-xl font-bold ${getScoreColor(interview.finalScore)}`}>
                      {interview.finalScore}/100
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-500">Questions Answered:</span>
                  <p className="text-gray-800 font-semibold">{interview.answers?.length || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Summary */}
          {interview?.aiSummary && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Summary</h3>
              <p className="text-gray-700 leading-relaxed">{interview.aiSummary}</p>
            </div>
          )}

          {/* Interview Questions & Answers */}
          {interview?.answers && interview.answers.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Interview Questions & Answers</h3>
              <div className="space-y-4">
                {interview.answers.map((answer, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800 text-sm">
                        Question {index + 1}:
                      </h4>
                      <div className="flex gap-2 text-xs text-gray-500">
                        {answer.timeLeft !== undefined && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            Time Left: {answer.timeLeft}s
                          </span>
                        )}
                        {answer.score !== undefined && (
                          <span className={`px-2 py-1 rounded font-medium ${getScoreColor(answer.score)} bg-white border`}>
                            Score: {answer.score}/100
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">{answer.question}</p>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-sm font-medium text-gray-500">Answer:</span>
                      <p className="text-gray-800 mt-1">{answer.answer || "No answer provided"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!interview || !interview.answers || interview.answers.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No interview data available for this profile.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileModal;
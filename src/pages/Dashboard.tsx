import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ProfileModal from "@/components/ProfileModal";
import { Interview } from "@/features/intervieweeSlice";

// Mock data for the table
const mockCandidates : Interview[] = [
  {
    id: "interview_001",
    answers: [
      {
        question: "Tell me about yourself.",
        answer:
          "I am a frontend developer specializing in React and Next.js, passionate about building interactive UIs.",
        timeLeft: 50,
        score: 8,
      },
      {
        question: "What are your strengths?",
        answer: "Strong debugging skills and ability to learn quickly.",
        timeLeft: 40,
        score: 7,
      },
    ],
    finalScore: 8,
    aiSummary:
      "Good communication, solid technical understanding of frontend concepts.",
    status: "completed",
    name: "Aryan Srivastava",
    email: "aryan.srivastava@example.com",
    phone: "+91-9876543210",
  },
  {
    id: "interview_002",
    answers: [
      {
        question: "Why do you want this role?",
        answer:
          "I want to contribute to impactful projects and grow as a backend developer.",
        timeLeft: 35,
        score: 9,
      },
      {
        question: "What are your weaknesses?",
        answer:
          "I sometimes take extra time to perfect small details, but I am improving on balancing speed and quality.",
        timeLeft: 20,
        score: 6,
      },
    ],
    finalScore: 7,
    aiSummary:
      "Candidate is motivated and self-aware, though slightly perfectionistic.",
    status: "completed",
    name: "Riya Sharma",
    email: "riya.sharma@example.com",
    phone: "+91-9123456780",
  },
  {
    id: "interview_003",
    answers: [
      {
        question: "Tell me about yourself.",
        answer:
          "I am a computer science student with a strong interest in AI and data science.",
        timeLeft: 60,
        score: 8,
      },
      {
        question: "What is your dream project?",
        answer:
          "Building an AI system that helps with climate change research.",
        timeLeft: 40,
        score: 9,
      },
    ],
    finalScore: 9,
    aiSummary:
      "Candidate is enthusiastic about AI and socially impactful projects.",
    status: "in-progress",
    name: "Karan Mehta",
    email: "karan.mehta@example.com",
    phone: "+91-9812345678",
  },
  {
    id: "interview_004",
    answers: [
      {
        question: "What motivates you?",
        answer:
          "Learning new technologies and applying them in real-world solutions.",
        timeLeft: 45,
        score: 7,
      },
    ],
    finalScore: 7,
    aiSummary: "Candidate shows curiosity and eagerness to learn.",
    status: "not-started",
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "+91-9876501234",
  },
  {
    id: "interview_005",
    answers: [
      {
        question: "What is your biggest achievement?",
        answer: "Developed a mobile app with 10,000+ downloads.",
        timeLeft: 30,
        score: 8,
      },
      {
        question: "Where do you see yourself in 5 years?",
        answer: "Leading a team of developers in a product-based company.",
        timeLeft: 55,
        score: 9,
      },
    ],
    finalScore: 9,
    aiSummary:
      "Ambitious candidate with a proven track record of personal projects.",
    status: "completed",
    name: "Aman Gupta",
    email: "aman.gupta@example.com",
    phone: "+91-9090909090",
  },
  {
    id: "interview_006",
    answers: [
      {
        question: "How do you handle stress?",
        answer: "I prioritize tasks and take short breaks to refocus.",
        timeLeft: 40,
        score: 7,
      },
    ],
    finalScore: 7,
    aiSummary:
      "Candidate is calm and handles stress with structured approaches.",
    status: "completed",
    name: "Sneha Nair",
    email: "sneha.nair@example.com",
    phone: "+91-9223344556",
  },
  {
    id: "interview_007",
    answers: [
      {
        question: "What is your biggest challenge?",
        answer: "Balancing multiple projects simultaneously.",
        timeLeft: 25,
        score: 6,
      },
    ],
    finalScore: 6,
    aiSummary: "Candidate needs to improve time management skills.",
    status: "in-progress",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "+91-9332211000",
  },
  {
    id: "interview_008",
    answers: [
      {
        question: "Tell me about a time you solved a tough problem.",
        answer: "I optimized a SQL query reducing execution time by 80%.",
        timeLeft: 30,
        score: 9,
      },
    ],
    finalScore: 9,
    aiSummary: "Strong technical problem-solving skills.",
    status: "completed",
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    phone: "+91-9445566778",
  },
  {
    id: "interview_009",
    answers: [
      {
        question: "Why should we hire you?",
        answer:
          "Because I bring dedication, teamwork, and technical expertise.",
        timeLeft: 45,
        score: 8,
      },
    ],
    finalScore: 8,
    aiSummary:
      "Candidate positions themselves as a reliable and skilled team player.",
    status: "not-started",
    name: "Arjun Malhotra",
    email: "arjun.malhotra@example.com",
    phone: "+91-9556677889",
  },
  {
    id: "interview_010",
    answers: [
      {
        question: "What are your career goals?",
        answer:
          "To become a full-stack engineer and contribute to open-source projects.",
        timeLeft: 60,
        score: 9,
      },
    ],
    finalScore: 9,
    aiSummary:
      "Candidate has clear goals and passion for open-source contributions.",
    status: "completed",
    name: "Divya Patel",
    email: "divya.patel@example.com",
    phone: "+91-9667788990",
  },
];

type SortOrder = "asc" | "desc" | null;

const Dashboard = () => {
  const intervieweeMap = useSelector(
    (state: RootState) => state.interview.interviews
  );
  const profiles = Object.values(intervieweeMap); 
  const [openModal, setOpenModal] = useState(false);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<
    number | null
  >(null);
  console.log("profiles", profiles);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const combined = [...profiles, ...mockCandidates];
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = combined.filter(
      (candidate) =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder) {
      filtered.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.finalScore - b.finalScore;
        } else {
          return b.finalScore - a.finalScore;
        }
      });
    }

    return filtered;
  }, [searchTerm, sortOrder]);

  const handleSortScore = () => {
    if (sortOrder === null) {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder(null);
    }
  };

  const getSortIcon = () => {
    if (sortOrder === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    if (sortOrder === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Interview candidates overview
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={handleSortScore}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Score
                      {getSortIcon()}
                    </Button>
                  </TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCandidates.map((candidate, index) => (
                  <TableRow
                    key={candidate.email}
                    onClick={() => {
                      setSelectedProfileIndex(index);
                      setOpenModal(true);
                    }}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">
                      {candidate.name}
                    </TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {candidate.finalScore}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={candidate.aiSummary}>
                        {candidate.aiSummary}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAndSortedCandidates.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No candidates found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {selectedProfileIndex !== null && (
        <ProfileModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          profile={filteredAndSortedCandidates[selectedProfileIndex]}
        />
      )}
    </div>
  );
};

export default Dashboard;

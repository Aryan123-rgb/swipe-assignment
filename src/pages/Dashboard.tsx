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

// Mock data for the table
const mockCandidates = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    score: 85,
    aiSummary:
      "Strong technical skills with excellent problem-solving abilities. Demonstrated proficiency in algorithms and data structures. Shows great potential for senior roles.",
  },
  {
    name: "Bob Smith",
    email: "bob.smith@email.com",
    score: 92,
    aiSummary:
      "Outstanding performance in system design and coding challenges. Clear communication and structured thinking approach.",
  },
  {
    name: "Carol Davis",
    email: "carol.davis@email.com",
    score: 78,
    aiSummary:
      "Good grasp of fundamental concepts with room for improvement in advanced topics. Shows enthusiasm and willingness to learn.",
  },
  {
    name: "David Wilson",
    email: "david.wilson@email.com",
    score: 88,
    aiSummary:
      "Excellent coding practices and clean code structure. Strong understanding of software engineering principles and best practices.",
  },
  {
    name: "Eva Brown",
    email: "eva.brown@email.com",
    score: 95,
    aiSummary:
      "Exceptional problem-solving skills and innovative thinking. Demonstrated ability to optimize solutions and think outside the box.",
  },
  {
    name: "Frank Miller",
    email: "frank.miller@email.com",
    score: 73,
    aiSummary:
      "Basic understanding of concepts with some gaps in advanced algorithms. Needs more practice but shows improvement potential.",
  },
];

type SortOrder = "asc" | "desc" | null;

const Dashboard = () => {
  const intervieweeMap = useSelector((state: RootState) => state.interview.interviews);
  const profiles = Object.values(intervieweeMap);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<
    number | null
  >(null);
  console.log("profiles", profiles);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = profiles.filter(
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
          profile={profiles[selectedProfileIndex]}
        />
      )}
    </div>
  );
};

export default Dashboard;

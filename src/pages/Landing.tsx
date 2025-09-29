import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ChatModal from "@/components/ChatModal";

const Landing = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center animate-fade-in relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 98px,
            hsl(var(--primary)) 100px
          )`
        }} />
      </div>
      
      <div className="text-center space-y-8 px-4 relative z-10">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-primary-glow bg-clip-text text-transparent">
            Crisp
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-lg mx-auto font-medium">
            AI-Powered Interview Assistant
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Link to="/chat" className="w-full sm:w-auto">
            <Button variant="default" size="lg" className="w-full gradient-primary hover:scale-105 transition-all duration-200">
              Interviewer
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => setIsChatModalOpen(true)}
            className="w-full sm:w-auto hover:scale-105 transition-all duration-200"
          >
            Interviewee
          </Button>
        </div>
      </div>
      <ChatModal
        isOpen={isChatModalOpen} 
        onClose={() => setIsChatModalOpen(false)}
      />
    </div>
  );
};

export default Landing;
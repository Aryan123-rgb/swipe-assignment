import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">Oops! Page not found</p>
        </div>
        <a 
          href="/" 
          className="inline-flex items-center px-4 py-2 text-primary hover:text-primary-hover transition-fast underline underline-offset-4"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-900/20 flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
          <Heart className="w-10 h-10 text-white opacity-50" />
        </div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Page Not Found
        </p>
        <p className="text-muted-foreground mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button
          onClick={() => navigate("/feed")}
          className="gradient-btn text-white font-semibold flex items-center justify-center gap-2 w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

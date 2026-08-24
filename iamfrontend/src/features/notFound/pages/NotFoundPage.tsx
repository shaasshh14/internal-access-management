import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Shield } from "lucide-react";
import Button from "@/shared/components/Button/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-50 p-4 rounded-2xl">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">
          404 Error
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
          Please check the URL or navigate back to a known location.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => navigate("/dashboard")}
          >
            <Home size={16} />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
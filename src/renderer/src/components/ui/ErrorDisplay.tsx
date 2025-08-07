import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
  className?: string;
}

export const ErrorDisplay = ({ message, className = "" }: ErrorDisplayProps) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 text-red-500 ${className}`}>
      <AlertCircle className="h-8 w-8" />
      <p className="text-sm text-center">{message}</p>
    </div>
  );
};

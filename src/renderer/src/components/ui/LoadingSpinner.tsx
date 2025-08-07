interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  message = "Cargando...", 
  className = "" 
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
};

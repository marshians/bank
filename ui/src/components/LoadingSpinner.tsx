interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
      <p className="text-subtext1">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

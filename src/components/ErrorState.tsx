import { RefreshCw } from "lucide-react";

type ErrorStateProps = {
  title: string;
  message: string;
  onRetry: () => void;
  className?: string;
};

export default function ErrorState({ title, message, onRetry, className = "" }: ErrorStateProps) {
  return (
    <div className={`error-box ${className}`} role="alert">
      <h3>{title}</h3>
      <p>{message}</p>
      <button className="btn" onClick={onRetry}>
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );
}

import { CheckCircleIcon, XCircleIcon, LightbulbIcon } from "./AppIcons";

interface FeedbackCardProps {
  correct: boolean;
  feedback: string;
  suggestion?: string;
}

export function FeedbackCard({ correct, feedback, suggestion }: FeedbackCardProps) {
  return (
    <div className={`rounded-2xl p-4 ${correct ? "bg-green-50 border-2 border-green-200" : "bg-orange-50 border-2 border-orange-200"}`}>
      <div className="flex items-start gap-3">
        {correct ? (
          <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircleIcon className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
        )}
        
        <div className="flex-1">
          <p className="text-sm font-medium mb-1">{feedback}</p>
          
          {suggestion && (
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-current/10">
              <LightbulbIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">{suggestion}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
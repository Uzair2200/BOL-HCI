import { ReactNode } from "react";

interface PromptCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  color?: "purple" | "green" | "blue" | "yellow" | "orange";
}

export function PromptCard({ title, description, children, color = "purple" }: PromptCardProps) {
  const colorClasses = {
    purple: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
    green: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    yellow: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200",
    orange: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
  };

  return (
    <div className={`rounded-3xl border-2 p-5 ${colorClasses[color]}`}>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}
      {children}
    </div>
  );
}

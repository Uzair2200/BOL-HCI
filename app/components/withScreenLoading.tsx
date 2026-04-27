import { useEffect, useState } from "react";
import { ScreenSkeleton } from "./ScreenSkeleton";

type SkeletonVariant = "home" | "auth" | "ranking" | "profile" | "activity" | "default";

export function withScreenLoading<P extends object>(
  Component: React.ComponentType<P>,
  variant: SkeletonVariant = "default",
  delayMs = 180,
) {
  return function ScreenWithLoading(props: P) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const id = window.setTimeout(() => setIsLoading(false), delayMs);
      return () => window.clearTimeout(id);
    }, []);

    if (isLoading) return <ScreenSkeleton variant={variant} />;
    return <Component {...props} />;
  };
}

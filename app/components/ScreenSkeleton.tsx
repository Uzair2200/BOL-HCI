type SkeletonVariant = "home" | "auth" | "ranking" | "profile" | "activity" | "default";

interface ScreenSkeletonProps {
  variant?: SkeletonVariant;
}

function BaseBars() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-2/3 rounded-full bg-[#E8DECF] animate-pulse" />
      <div className="h-4 w-full rounded-full bg-[#E8DECF] animate-pulse" />
      <div className="h-4 w-5/6 rounded-full bg-[#E8DECF] animate-pulse" />
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] px-6 pt-6 pb-28">
      <div className="h-10 w-full rounded-2xl bg-[#E8DECF] animate-pulse" />
      <div className="mt-6 h-8 w-48 rounded-full bg-[#E8DECF] animate-pulse" />
      <div className="mt-4 h-40 w-full rounded-3xl bg-[#EFE4D4] animate-pulse" />
      <div className="mt-6 h-6 w-36 rounded-full bg-[#E8DECF] animate-pulse" />
      <div className="mt-4 grid grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-[#EFE4D4] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function AuthSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] px-6 py-10">
      <div className="mx-auto h-10 w-40 rounded-full bg-[#E8DECF] animate-pulse" />
      <div className="mx-auto mt-6 h-5 w-64 rounded-full bg-[#E8DECF] animate-pulse" />
      <div className="mt-10 rounded-3xl bg-[#EFE4D4] p-6">
        <div className="space-y-4">
          <div className="h-12 rounded-2xl bg-[#E8DECF] animate-pulse" />
          <div className="h-12 rounded-2xl bg-[#E8DECF] animate-pulse" />
          <div className="h-12 rounded-2xl bg-[#E8DECF] animate-pulse" />
        </div>
        <div className="mt-6 h-12 rounded-2xl bg-[#D7C7B1] animate-pulse" />
      </div>
    </div>
  );
}

function RankingSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] px-5 pt-5 pb-28">
      <div className="h-10 w-full rounded-2xl bg-[#E8DECF] animate-pulse" />
      <div className="mt-5 h-40 rounded-3xl bg-[#EFE4D4] animate-pulse" />
      <div className="mt-6 h-6 w-56 rounded-full bg-[#E8DECF] animate-pulse" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-[#EFE4D4] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] px-6 pt-6 pb-28">
      <div className="mx-auto h-24 w-24 rounded-full bg-[#E8DECF] animate-pulse" />
      <div className="mx-auto mt-4 h-6 w-40 rounded-full bg-[#E8DECF] animate-pulse" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 rounded-2xl bg-[#EFE4D4] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] px-6 pt-6 pb-28">
      <div className="h-10 w-full rounded-2xl bg-[#E8DECF] animate-pulse" />
      <div className="mt-6 h-28 rounded-3xl bg-[#EFE4D4] animate-pulse" />
      <div className="mt-6 h-40 rounded-3xl bg-[#EFE4D4] animate-pulse" />
      <div className="mt-6 h-20 rounded-3xl bg-[#EFE4D4] animate-pulse" />
      <div className="mt-6">
        <BaseBars />
      </div>
    </div>
  );
}

function DefaultSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] px-6 pt-6 pb-28">
      <div className="h-10 w-full rounded-2xl bg-[#E8DECF] animate-pulse" />
      <div className="mt-6 space-y-4">
        <div className="h-24 rounded-3xl bg-[#EFE4D4] animate-pulse" />
        <div className="h-24 rounded-3xl bg-[#EFE4D4] animate-pulse" />
        <div className="h-24 rounded-3xl bg-[#EFE4D4] animate-pulse" />
      </div>
    </div>
  );
}

export function ScreenSkeleton({ variant = "default" }: ScreenSkeletonProps) {
  if (variant === "home") return <HomeSkeleton />;
  if (variant === "auth") return <AuthSkeleton />;
  if (variant === "ranking") return <RankingSkeleton />;
  if (variant === "profile") return <ProfileSkeleton />;
  if (variant === "activity") return <ActivitySkeleton />;
  return <DefaultSkeleton />;
}
